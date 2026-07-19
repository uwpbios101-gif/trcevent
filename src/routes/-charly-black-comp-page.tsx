// Shared by src/routes/charly-black_.comp.tsx. The "-" prefix excludes this
// file from route generation (TanStack Router convention) — see
// src/routes/README.md. The trailing underscore in the route file's name
// (charly-black_.comp.tsx) opts this route out of nesting under
// charly-black.tsx -- without it, TanStack Router treats a same-named
// sibling file as an implicit parent layout, and since CharlyBlackPage
// doesn't render an <Outlet />, this page's content would silently never
// appear (only its <title>/meta would show, from head() merging).
//
// Migrated from hand-authored static HTML that lived directly in the
// trcevents/events deploy repo (charly-black/comp/index.html) -- same
// backend (comp_requests table, request-comp-verification /
// verify-comp-code functions), now a proper route so it gets the site's
// design system and build pipeline instead of manual deploy-repo edits.
//
// Email verification uses a 6-digit code (not a magic link) so the person
// never has to leave this tab. Once verified, the rest of the form appears.
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const SITE_URL = "https://trcevent.com";
const OTHER_APPROVER = "__other__";

// Update this when the live ticket tier changes (Early Bird -> Regular -> Door).
const TICKET_PRICE = 20;

// 70% for the first 10 tickets sold, 50% for the next 40 (tickets 11-50) --
// the form only asks for up to 10 up front, but the payout preview shows the
// ceiling as an incentive to keep selling past that.
function payoutFor(n: number) {
  const tier1 = Math.min(n, 10);
  const tier2 = Math.max(Math.min(n, 50) - 10, 0);
  return tier1 * TICKET_PRICE * 0.7 + tier2 * TICKET_PRICE * 0.5;
}

// supabase.functions.invoke() routes a non-2xx response into `error` rather
// than `data`, even when the function's JSON body has a perfectly good
// `.error` message (FunctionsHttpError carries the raw Response on
// `.context`). Without this, a non-2xx failure shows a generic fallback
// instead of the real reason.
async function extractFunctionErrorMessage(error: unknown): Promise<string | null> {
  if (!error || typeof error !== "object") return null;
  const context = (error as { context?: Response }).context;
  if (context && typeof context.json === "function") {
    try {
      const body = await context.json();
      if (body && typeof body.error === "string") return body.error;
    } catch {
      // context body wasn't JSON -- fall through to error.message
    }
  }
  const message = (error as { message?: string }).message;
  return typeof message === "string" ? message : null;
}

const SOCIAL_PLATFORMS = [
  { name: "Instagram", field: "handleInstagram", placeholder: "@handle" },
  { name: "TikTok", field: "handleTiktok", placeholder: "@handle" },
  { name: "Facebook", field: "handleFacebook", placeholder: "Profile name or link" },
  { name: "X / Twitter", field: "handleTwitter", placeholder: "@handle" },
  { name: "Snapchat", field: "handleSnapchat", placeholder: "@username" },
  { name: "WhatsApp Status", field: "handleWhatsapp", placeholder: "Number you'll post from" },
  { name: "YouTube", field: "handleYoutube", placeholder: "Channel name or link" },
] as const;

export function compHead() {
  return {
    meta: [
      { title: "Comp / Sellable Ticket Request — Charly Black | TRC Events" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/charly-black/comp` }],
  };
}

const compRequestSchema = z
  .object({
    fullName: z.string().trim().min(1, "Enter your full name."),
    crewOrOrg: z.string().trim().optional(),
    phone: z.string().trim().optional(),
    wantsFree: z.boolean(),
    freeTicketsRequested: z.coerce.number().int().min(0).max(2),
    wantsToSell: z.boolean(),
    sellTicketsRequested: z.coerce.number().int().min(0).max(10),
    approverName: z.string().min(1, "Choose who told you that you could get these."),
    otherApproverName: z.string().trim().optional(),
    socialPlatforms: z.array(z.string()),
    handleInstagram: z.string().trim().optional(),
    handleTiktok: z.string().trim().optional(),
    handleFacebook: z.string().trim().optional(),
    handleTwitter: z.string().trim().optional(),
    handleSnapchat: z.string().trim().optional(),
    handleWhatsapp: z.string().trim().optional(),
    handleYoutube: z.string().trim().optional(),
    otherPlatformName: z.string().trim().optional(),
    handleOther: z.string().trim().optional(),
    notes: z.string().trim().optional(),
  })
  .refine((v) => v.wantsFree || v.wantsToSell, {
    message: "Let us know if you want free tickets, tickets to sell, or both.",
    path: ["wantsToSell"],
  })
  .refine((v) => !v.wantsFree || v.freeTicketsRequested >= 1, {
    message: "Enter how many free tickets you'd like (up to 2).",
    path: ["freeTicketsRequested"],
  })
  .refine((v) => !v.wantsToSell || v.sellTicketsRequested >= 1, {
    message: "Enter how many tickets you'd like to sell (up to 10).",
    path: ["sellTicketsRequested"],
  })
  .refine((v) => v.approverName !== OTHER_APPROVER || !!v.otherApproverName, {
    message: "Enter their name.",
    path: ["otherApproverName"],
  })
  .refine(
    (v) => {
      const handleMap: Record<string, string | undefined> = {
        Instagram: v.handleInstagram,
        TikTok: v.handleTiktok,
        Facebook: v.handleFacebook,
        "X / Twitter": v.handleTwitter,
        Snapchat: v.handleSnapchat,
        "WhatsApp Status": v.handleWhatsapp,
        YouTube: v.handleYoutube,
      };
      const hasFixed = v.socialPlatforms.some((p) => !!handleMap[p]?.trim());
      const hasOther =
        v.socialPlatforms.includes(OTHER_APPROVER) &&
        !!v.otherPlatformName?.trim() &&
        !!v.handleOther?.trim();
      return hasFixed || hasOther;
    },
    {
      message: "Pick at least one social media platform and give us your real handle.",
      path: ["socialPlatforms"],
    },
  );
type CompRequestValues = z.infer<typeof compRequestSchema>;

export function CompPage() {
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [approvers, setApprovers] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<CompRequestValues>({
    resolver: zodResolver(compRequestSchema),
    defaultValues: {
      fullName: "",
      crewOrOrg: "",
      phone: "",
      wantsFree: false,
      freeTicketsRequested: 0,
      wantsToSell: false,
      sellTicketsRequested: 0,
      approverName: "",
      otherApproverName: "",
      socialPlatforms: [],
      handleInstagram: "",
      handleTiktok: "",
      handleFacebook: "",
      handleTwitter: "",
      handleSnapchat: "",
      handleWhatsapp: "",
      handleYoutube: "",
      otherPlatformName: "",
      handleOther: "",
      notes: "",
    },
  });

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("approvers")
        .select("name")
        .eq("active", true)
        .order("name");
      if (error || !data) return;
      const names = data.map((a) => a.name as string);
      setApprovers(names);

      // A personal link like ?ref=Marlon pre-fills who referred this person.
      const ref = new URLSearchParams(window.location.search).get("ref");
      if (ref) {
        const match = names.find((n) => n.toLowerCase() === ref.toLowerCase());
        if (match) form.setValue("approverName", match);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (emailVerified && email.trim().toLowerCase() !== verifiedEmail) {
      setEmailVerified(false);
      setVerifiedEmail("");
      setVerifyMsg({ text: "Email changed -- verify again before submitting.", ok: false });
      setCodeSent(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  async function handleSendCode() {
    const trimmed = email.trim();
    if (!trimmed || !/^\S+@\S+\.\S+$/.test(trimmed)) {
      setVerifyMsg({ text: "Enter a valid email first.", ok: false });
      return;
    }
    setSendingCode(true);
    setVerifyMsg(null);
    try {
      const { data, error } = await supabase.functions.invoke("request-comp-verification", {
        body: { email: trimmed },
      });
      if (error || data?.error) {
        const message = data?.error ?? (await extractFunctionErrorMessage(error)) ?? "try again";
        setVerifyMsg({ text: `Couldn't send a code: ${message}`, ok: false });
        return;
      }
      setCodeSent(true);
      setVerifyMsg({ text: "Code sent -- check your email.", ok: true });
    } catch {
      setVerifyMsg({ text: "Something went wrong sending the code. Try again.", ok: false });
    } finally {
      setSendingCode(false);
    }
  }

  async function callVerifyCode(trimmedEmail: string, trimmedCode: string) {
    const { data, error } = await supabase.functions.invoke("verify-comp-code", {
      body: { email: trimmedEmail, code: trimmedCode },
    });
    if (data?.valid) return { valid: true as const };
    const message = data?.error ?? (error ? await extractFunctionErrorMessage(error) : null);
    return { valid: false as const, message };
  }

  async function handleConfirmCode() {
    const trimmed = email.trim();
    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setVerifyMsg({ text: "Enter the code from your email.", ok: false });
      return;
    }
    setVerifyingCode(true);
    try {
      let result = await callVerifyCode(trimmed, trimmedCode);
      // A failure with no specific reason usually means a transient hiccup
      // (e.g. a cold-start blip) rather than an actually-wrong code -- the
      // function is otherwise very consistent about explaining itself, so
      // one silent retry smooths that over instead of showing a confusing
      // generic error for something that would've worked a second later.
      if (!result.valid && !result.message) {
        result = await callVerifyCode(trimmed, trimmedCode);
      }
      if (result.valid) {
        setEmailVerified(true);
        setVerifiedEmail(trimmed.toLowerCase());
        setVerifyMsg({ text: "✓ Email verified", ok: true });
        setCodeSent(false);
        return;
      }
      setVerifyMsg({ text: result.message ?? "That code didn't work.", ok: false });
    } catch {
      setVerifyMsg({ text: "Something went wrong checking that code. Try again.", ok: false });
    } finally {
      setVerifyingCode(false);
    }
  }

  async function handleSubmit(values: CompRequestValues) {
    if (!emailVerified || email.trim().toLowerCase() !== verifiedEmail) {
      toast.error("Please verify your email before submitting.");
      return;
    }
    setBusy(true);
    try {
      const isOther = values.approverName === OTHER_APPROVER;
      const socialMedia = [
        ...SOCIAL_PLATFORMS.filter((p) => values.socialPlatforms.includes(p.name))
          .map((p) => ({ platform: p.name, handle: (values[p.field] ?? "").trim() }))
          .filter((s) => s.handle),
        ...(values.socialPlatforms.includes(OTHER_APPROVER) &&
        values.otherPlatformName?.trim() &&
        values.handleOther?.trim()
          ? [{ platform: values.otherPlatformName.trim(), handle: values.handleOther.trim() }]
          : []),
      ];

      const { error } = await supabase.from("comp_requests").insert({
        full_name: values.fullName.trim(),
        crew_or_org: values.crewOrOrg?.trim() || null,
        email: verifiedEmail,
        phone: values.phone?.trim() || null,
        tickets_requested: values.freeTicketsRequested + values.sellTicketsRequested,
        wants_free: values.wantsFree,
        free_tickets_requested: values.freeTicketsRequested,
        wants_to_sell: values.wantsToSell,
        sell_tickets_requested: values.sellTicketsRequested,
        social_media: socialMedia,
        approver_name: isOther ? values.otherApproverName?.trim() : values.approverName,
        approver_listed: !isOther,
        notes: values.notes?.trim() || null,
      });

      if (error) {
        if ((error as { code?: string }).code === "23505") {
          toast.error(
            "Looks like you've already submitted a request with this email or phone number. If you need to change something, call or text 414-909-3279.",
          );
        } else {
          toast.error(
            "Something went wrong submitting your request. Please try again or call/text 414-909-3279.",
          );
        }
        return;
      }

      setSubmitted(true);
    } finally {
      setBusy(false);
    }
  }

  const wantsToSell = form.watch("wantsToSell");
  const sellCount = form.watch("sellTicketsRequested") || 0;
  const approverValue = form.watch("approverName");
  const socialPlatforms = form.watch("socialPlatforms");

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">
        Comp / Sellable Ticket Request
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Charly Black — Good Times · Friday, Aug 28, 2026 · Bombay Banquet Hall
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        If someone on the TRC team told you that you can get tickets — to keep for yourself or sell
        — fill this out. We'll review it and email you your access details.
      </p>

      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <div className="space-y-2">
          <Label htmlFor="comp-email">Verify Your Email Address *</Label>
          <Input
            id="comp-email"
            type="email"
            placeholder="Enter your email address here"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={emailVerified}
            required
          />
          <p className="text-xs text-muted-foreground">
            We'll send your access details here. You'll need to confirm it before you can continue.
          </p>

          {!emailVerified && (
            <div className="mt-2 space-y-3 rounded-lg border border-border p-4">
              <Button
                type="button"
                variant="goldOutline"
                size="sm"
                onClick={handleSendCode}
                disabled={sendingCode}
              >
                {sendingCode ? <Loader2 className="size-4 animate-spin" /> : null}
                {codeSent ? "Resend code" : "Verify Email Address"}
              </Button>
              {codeSent && (
                <div className="flex gap-2">
                  <Input
                    placeholder="6-digit code"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="gold"
                    size="sm"
                    onClick={handleConfirmCode}
                    disabled={verifyingCode}
                  >
                    {verifyingCode ? <Loader2 className="size-4 animate-spin" /> : null}
                    Confirm Code
                  </Button>
                </div>
              )}
              {verifyMsg && (
                <p className={`text-xs ${verifyMsg.ok ? "text-gold" : "text-destructive"}`}>
                  {verifyMsg.text}
                </p>
              )}
            </div>
          )}
          {emailVerified && (
            <p className="flex items-center gap-1.5 text-sm text-gold">
              <CheckCircle2 className="size-4" /> Email verified
            </p>
          )}
        </div>

        {emailVerified && !submitted && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-6 space-y-5">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your full name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="crewOrOrg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crew / organization (if any)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="wantsFree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Do you want free tickets? *</FormLabel>
                    <ToggleGroup
                      type="single"
                      variant="outline"
                      className="grid grid-cols-2"
                      value={field.value ? "yes" : "no"}
                      onValueChange={(v) => v && field.onChange(v === "yes")}
                    >
                      <ToggleGroupItem
                        value="no"
                        className="data-[state=on]:bg-gold data-[state=on]:text-gold-foreground"
                      >
                        No
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="yes"
                        className="data-[state=on]:bg-gold data-[state=on]:text-gold-foreground"
                      >
                        Yes
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormItem>
                )}
              />
              {form.watch("wantsFree") && (
                <FormField
                  control={form.control}
                  name="freeTicketsRequested"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How many free tickets? (up to 2) *</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} max={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="wantsToSell"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Are you selling tickets? *</FormLabel>
                    <ToggleGroup
                      type="single"
                      variant="outline"
                      className="grid grid-cols-2"
                      value={field.value ? "yes" : "no"}
                      onValueChange={(v) => v && field.onChange(v === "yes")}
                    >
                      <ToggleGroupItem
                        value="no"
                        className="data-[state=on]:bg-gold data-[state=on]:text-gold-foreground"
                      >
                        No
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="yes"
                        className="data-[state=on]:bg-gold data-[state=on]:text-gold-foreground"
                      >
                        Yes
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormItem>
                )}
              />
              {wantsToSell && (
                <FormField
                  control={form.control}
                  name="sellTicketsRequested"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        How many do you want to sell? (up to 10 to start — ask if you need more) *
                      </FormLabel>
                      <FormControl>
                        <Input type="number" min={1} max={10} {...field} />
                      </FormControl>
                      <FormMessage />
                      <div className="rounded-lg border border-gold/30 bg-gold/5 px-4 py-3 text-sm leading-relaxed">
                        Keep <strong className="text-gold">70%</strong> of every ticket you sell,
                        for your first 10. Once you've sold more than that — up to 50 total — you
                        keep <strong className="text-gold">50%</strong> on every extra one after
                        that. No reason to stop at 10 if you can move more.
                        <div className="mt-2">
                          At ${TICKET_PRICE}/ticket, selling{" "}
                          <strong className="text-gold">{sellCount}</strong> could put{" "}
                          <strong className="text-gold">${payoutFor(sellCount).toFixed(0)}</strong>{" "}
                          in your pocket. Sell your way to 50 total and that grows to{" "}
                          <strong className="text-gold">${payoutFor(50).toFixed(0)}</strong>.
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="approverName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Who told you that you could get these? *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose a name…" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {approvers.map((name) => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                        <SelectItem value={OTHER_APPROVER}>Someone else not listed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {approverValue === OTHER_APPROVER && (
                <FormField
                  control={form.control}
                  name="otherApproverName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Their name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="socialPlatforms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Where can we follow you? Pick at least one and give us your real handle *
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      We'd love to follow you everywhere you're active — check off and fill in every
                      platform that applies. Only one is required, but the more you add, the better.
                      We follow everyone who gets tickets -- this is how we find you.
                    </p>
                    <div className="mt-2 space-y-3">
                      {SOCIAL_PLATFORMS.map((p) => (
                        <div key={p.name} className="space-y-1.5">
                          <label className="flex items-center gap-2 text-sm">
                            <Checkbox
                              checked={field.value.includes(p.name)}
                              onCheckedChange={(checked) =>
                                field.onChange(
                                  checked
                                    ? [...field.value, p.name]
                                    : field.value.filter((v) => v !== p.name),
                                )
                              }
                            />
                            {p.name}
                          </label>
                          {socialPlatforms.includes(p.name) && (
                            <FormField
                              control={form.control}
                              name={p.field}
                              render={({ field: handleField }) => (
                                <Input
                                  {...handleField}
                                  placeholder={p.placeholder}
                                  className="ml-6 w-[calc(100%-1.5rem)]"
                                />
                              )}
                            />
                          )}
                        </div>
                      ))}
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={field.value.includes(OTHER_APPROVER)}
                            onCheckedChange={(checked) =>
                              field.onChange(
                                checked
                                  ? [...field.value, OTHER_APPROVER]
                                  : field.value.filter((v) => v !== OTHER_APPROVER),
                              )
                            }
                          />
                          Other
                        </label>
                        {socialPlatforms.includes(OTHER_APPROVER) && (
                          <div className="ml-6 space-y-1.5">
                            <FormField
                              control={form.control}
                              name="otherPlatformName"
                              render={({ field: f }) => (
                                <Input {...f} placeholder="Which platform?" />
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="handleOther"
                              render={({ field: f }) => (
                                <Input {...f} placeholder="@handle or link" />
                              )}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anything else we should know?</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" variant="gold" size="xl" className="w-full" disabled={busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                Submit Request
              </Button>
            </form>
          </Form>
        )}

        {submitted && (
          <p className="mt-8 text-sm text-muted-foreground">
            Thanks! We've got your request and will email you at the address you provided once it's
            reviewed.
          </p>
        )}
      </div>
    </div>
  );
}
