// Shared by src/routes/charly-black_.street-team.tsx -- see the "-" prefix /
// trailing underscore route-naming notes in -charly-black-comp-page.tsx,
// which this file is adapted from.
//
// Same backend (comp_requests table, request-comp-verification /
// verify-comp-code functions, email_is_verified()) as the referred comp
// flow, distinguished by comp_requests.program = 'street'. Unlike that flow,
// this one has no "who told you" gate -- it's for whoever Stephen talks to
// in person while promoting street-side, so the offer is fixed (2 free
// tickets, unlimited to sell at a flat 50% cut) and the request is
// auto-approved on submit rather than sitting in a review queue.
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const SITE_URL = "https://trcevent.com";
const OTHER_PLATFORM = "__other__";
const FREE_TICKETS = 2;

// Update this when the live ticket tier changes (Early Bird -> Regular -> Door).
const TICKET_PRICE = 20;

function payoutFor(n: number) {
  return n * TICKET_PRICE * 0.5;
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

export function streetTeamHead() {
  return {
    meta: [
      { title: "Street Team Sign-Up — Charly Black | TRC Events" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/charly-black/street-team` }],
  };
}

const streetTeamSchema = z
  .object({
    fullName: z.string().trim().min(1, "Enter your full name."),
    crewOrOrg: z.string().trim().optional(),
    phone: z.string().trim().optional(),
    sellEstimate: z.coerce.number().int().min(0).max(100000),
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
        v.socialPlatforms.includes(OTHER_PLATFORM) &&
        !!v.otherPlatformName?.trim() &&
        !!v.handleOther?.trim();
      return hasFixed || hasOther;
    },
    {
      message: "Pick at least one social media platform and give us your real handle.",
      path: ["socialPlatforms"],
    },
  );
type StreetTeamValues = z.infer<typeof streetTeamSchema>;

export function StreetTeamPage() {
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<StreetTeamValues>({
    resolver: zodResolver(streetTeamSchema),
    defaultValues: {
      fullName: "",
      crewOrOrg: "",
      phone: "",
      sellEstimate: 0,
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
      setVerifyMsg({
        text: result.message ? result.message : "That code didn't work. Try again.",
        ok: false,
      });
    } catch {
      setVerifyMsg({
        text: "Something went wrong checking that code. Try again.",
        ok: false,
      });
    } finally {
      setVerifyingCode(false);
    }
  }

  async function handleSubmit(values: StreetTeamValues) {
    if (!emailVerified || email.trim().toLowerCase() !== verifiedEmail) {
      toast.error("Please verify your email before submitting.");
      return;
    }
    setBusy(true);
    try {
      const socialMedia = [
        ...SOCIAL_PLATFORMS.filter((p) => values.socialPlatforms.includes(p.name))
          .map((p) => ({ platform: p.name, handle: (values[p.field] ?? "").trim() }))
          .filter((s) => s.handle),
        ...(values.socialPlatforms.includes(OTHER_PLATFORM) &&
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
        tickets_requested: FREE_TICKETS + values.sellEstimate,
        wants_free: true,
        free_tickets_requested: FREE_TICKETS,
        wants_to_sell: true,
        sell_tickets_requested: values.sellEstimate,
        social_media: socialMedia,
        approver_name: "Street team (walk-up)",
        approver_listed: false,
        notes: values.notes?.trim() || null,
        program: "street",
        status: "approved",
      });

      if (error) {
        if ((error as { code?: string }).code === "23505") {
          toast.error(
            "Looks like you've already signed up with this email or phone number. If you need to change something, call or text 414-909-3279.",
          );
        } else {
          toast.error(
            "Something went wrong submitting your sign-up. Please try again or call/text 414-909-3279.",
          );
        }
        return;
      }

      setSubmitted(true);
    } finally {
      setBusy(false);
    }
  }

  const sellEstimate = form.watch("sellEstimate") || 0;
  const socialPlatforms = form.watch("socialPlatforms");

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Join the Street Team</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Charly Black — Good Times · Friday, Aug 28, 2026 · Bombay Banquet Hall
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        We just talked, and you're in. You get{" "}
        <strong className="text-foreground">2 free tickets</strong> for yourself, plus the chance to
        sell as many more as you want — you keep <strong className="text-foreground">50%</strong> of
        every ticket you sell. Verify your email below to lock it in.
      </p>

      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <div className="space-y-2">
          <Label htmlFor="street-email">Verify Your Email Address *</Label>
          <Input
            id="street-email"
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
                name="sellEstimate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      About how many tickets do you think you can sell? (no limit — just helps us
                      plan)
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                    <div className="rounded-lg border border-gold/30 bg-gold/5 px-4 py-3 text-sm leading-relaxed">
                      Keep <strong className="text-gold">50%</strong> of every ticket you sell — no
                      cap. At ${TICKET_PRICE}/ticket, selling{" "}
                      <strong className="text-gold">{sellEstimate}</strong> could put{" "}
                      <strong className="text-gold">${payoutFor(sellEstimate).toFixed(0)}</strong>{" "}
                      in your pocket.
                    </div>
                  </FormItem>
                )}
              />

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
                            checked={field.value.includes(OTHER_PLATFORM)}
                            onCheckedChange={(checked) =>
                              field.onChange(
                                checked
                                  ? [...field.value, OTHER_PLATFORM]
                                  : field.value.filter((v) => v !== OTHER_PLATFORM),
                              )
                            }
                          />
                          Other
                        </label>
                        {socialPlatforms.includes(OTHER_PLATFORM) && (
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
                Sign Me Up
              </Button>
            </form>
          </Form>
        )}

        {submitted && (
          <p className="mt-8 text-sm text-muted-foreground">
            You're in! We'll email you at the address you provided with your access details shortly.
          </p>
        )}
      </div>
    </div>
  );
}
