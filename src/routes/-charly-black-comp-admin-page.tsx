// Shared by src/routes/charly-black_.comp-admin.tsx. The "-" prefix excludes
// this file from route generation (TanStack Router convention) — see
// src/routes/README.md. The trailing underscore in the route file's name
// (charly-black_.comp-admin.tsx) opts this route out of nesting under
// charly-black.tsx -- see -charly-black-comp-page.tsx for why that matters.
//
// Migrated from hand-authored static HTML that lived directly in the
// trcevents/events deploy repo (charly-black/comp-admin/index.html) -- same
// backend (comp_requests/comp_admins/approvers tables, is_comp_admin /
// is_comp_super_admin / my_admin_name RPCs, admin-create-person /
// send-access-info functions), now a proper route.
//
// Auth is email+password (Supabase Auth), gated server-side by the
// is_comp_admin() RPC -- anyone can sign in with a Supabase account, but
// only emails on the comp_admins roster pass that check. Session persists
// via the shared supabase client's default localStorage handling.
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
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
const TICKET_PRICE = 20;

function payoutFor(n: number) {
  const tier1 = Math.min(n, 10);
  const tier2 = Math.max(Math.min(n, 50) - 10, 0);
  return tier1 * TICKET_PRICE * 0.7 + tier2 * TICKET_PRICE * 0.5;
}

const SOCIAL_PLATFORMS = [
  { name: "Instagram", field: "handleInstagram", placeholder: "@handle" },
  { name: "TikTok", field: "handleTiktok", placeholder: "@handle" },
  { name: "Facebook", field: "handleFacebook", placeholder: "Profile name or link" },
  { name: "X / Twitter", field: "handleTwitter", placeholder: "@handle" },
  { name: "Snapchat", field: "handleSnapchat", placeholder: "@username" },
  { name: "WhatsApp Status", field: "handleWhatsapp", placeholder: "Number they'll post from" },
  { name: "YouTube", field: "handleYoutube", placeholder: "Channel name or link" },
] as const;

export function compAdminHead() {
  return {
    meta: [
      { title: "Comp Request Admin — Charly Black | TRC Events" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/charly-black/comp-admin` }],
  };
}

type CompRequest = {
  id: string;
  full_name: string;
  crew_or_org: string | null;
  email: string;
  phone: string | null;
  tickets_requested: number;
  wants_free: boolean;
  free_tickets_requested: number;
  wants_to_sell: boolean;
  sell_tickets_requested: number;
  social_media: { platform: string; handle: string }[] | null;
  approver_name: string;
  approver_listed: boolean;
  notes: string | null;
  status: "pending" | "approved" | "rejected";
  tt_access_info: string | null;
  access_sent_at: string | null;
  created_at: string;
};

type CompAdminRow = {
  id: string;
  name: string;
  email: string;
  active: boolean;
  is_super_admin: boolean;
};
type ApproverRow = { id: string; name: string; active: boolean };

const logRequestSchema = z
  .object({
    fullName: z.string().trim().min(1, "Enter their full name."),
    crewOrOrg: z.string().trim().optional(),
    email: z.string().trim().email("Enter a valid email."),
    phone: z.string().trim().optional(),
    wantsFree: z.boolean(),
    freeTicketsRequested: z.coerce.number().int().min(0).max(2),
    wantsToSell: z.boolean(),
    sellTicketsRequested: z.coerce.number().int().min(0).max(10),
    approverName: z.string().min(1, "Choose who approved this."),
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
    message: "Choose free tickets, sell tickets, or both.",
    path: ["wantsToSell"],
  })
  .refine((v) => !v.wantsFree || v.freeTicketsRequested >= 1, {
    message: "Enter how many free tickets (up to 2).",
    path: ["freeTicketsRequested"],
  })
  .refine((v) => !v.wantsToSell || v.sellTicketsRequested >= 1, {
    message: "Enter how many tickets to sell (up to 10).",
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
      message: "Pick at least one social media platform and get their real handle.",
      path: ["socialPlatforms"],
    },
  );
type LogRequestValues = z.infer<typeof logRequestSchema>;

function GuideAndSignIn({ onSignedIn }: { onSignedIn: () => void }) {
  const [mode, setMode] = useState<"signin" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const [fpEmail, setFpEmail] = useState("");
  const [fpSent, setFpSent] = useState(false);
  const [fpCode, setFpCode] = useState("");
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpMsg, setFpMsg] = useState("");
  const [fpResetMsg, setFpResetMsg] = useState("");

  async function handleSignIn() {
    if (!email.trim() || !password) {
      setMsg("Enter both your email and password.");
      return;
    }
    setBusy(true);
    setMsg("");
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setMsg(`Error: ${error.message}`);
        return;
      }
      onSignedIn();
    } finally {
      setBusy(false);
    }
  }

  async function handleSendResetCode() {
    if (!fpEmail.trim()) {
      setFpMsg("Enter your email first.");
      return;
    }
    setBusy(true);
    setFpMsg("");
    try {
      const { data } = await supabase.functions.invoke("request-admin-password-reset", {
        body: { email: fpEmail.trim() },
      });
      if (data?.error) {
        setFpMsg(data.error);
      } else {
        setFpMsg("If that email is registered, a code was sent.");
        setFpSent(true);
      }
    } catch {
      setFpMsg("Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleResetPassword() {
    if (!fpCode.trim() || !fpNewPassword) {
      setFpResetMsg("Enter the code and a new password.");
      return;
    }
    setBusy(true);
    setFpResetMsg("");
    try {
      const { data } = await supabase.functions.invoke("reset-admin-password", {
        body: { email: fpEmail.trim(), code: fpCode.trim(), newPassword: fpNewPassword },
      });
      if (!data?.ok) {
        setFpResetMsg(data?.error ?? "That didn't work. Try again.");
        return;
      }
      setFpResetMsg("Password set! Sign in with it now.");
      setTimeout(() => {
        setMode("signin");
        setEmail(fpEmail);
      }, 1200);
    } catch {
      setFpResetMsg("Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="eyebrow">TRC Events · Charly Black — Good Times · Aug 28, 2026</p>
      <h1 className="font-display mt-1 text-2xl font-extrabold sm:text-3xl">
        How the Comp Ticket System Works
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        A quick read before you sign in below — this is the whole flow, start to finish, so you know
        what happens after you hand someone a link.
      </p>

      <ol className="mt-6 space-y-4 pl-5 text-sm">
        <li className="list-decimal leading-relaxed">
          <strong className="block">1. Sign in and grab your link.</strong>
          Once you're signed in, you'll see a box called "Your Referral Link." That link is yours —
          it already knows your name, so whoever fills it out doesn't have to guess who sent them.
        </li>
        <li className="list-decimal leading-relaxed">
          <strong className="block">2. Someone asks you for tickets? Send them your link.</strong>
          They fill out their own name, email, and phone — you don't have to do it for them.
        </li>
        <li className="list-decimal leading-relaxed">
          <strong className="block">3. They choose free, sell, or both.</strong>
          Up to 2 free tickets to keep, and up to 10 tickets to sell to start (they can always ask
          for more once they're moving them). The form shows them what selling is worth.
        </li>
        <li className="list-decimal leading-relaxed">
          <strong className="block">
            4. You and Stephen both get an email the moment they submit.
          </strong>
          Nothing to do here — it's automatic. That's your heads-up that a request is waiting.
        </li>
        <li className="list-decimal leading-relaxed">
          <strong className="block">
            5. Stephen reviews it and sets up their access in Ticket Tailor.
          </strong>
          He builds their allocation and sends them a code by email — that's what lets them actually
          claim free tickets or sell.
        </li>
        <li className="list-decimal leading-relaxed">
          <strong className="block">6. They're live.</strong>
          Free tickets are theirs to give away. Sold tickets earn them real money — and you helped
          make that happen.
        </li>
      </ol>

      <div className="mt-6 rounded-lg border border-gold/30 bg-gold/5 px-4 py-3 text-sm leading-relaxed">
        <strong className="text-gold">Why selling is worth it to them:</strong> they keep{" "}
        <strong className="text-gold">70%</strong> of every ticket for their first 10 sold, and{" "}
        <strong className="text-gold">50%</strong> on every ticket after that, up to 50 total. Worth
        mentioning when you hand out the link — it's real money, not just a favor.
      </div>

      <div className="mt-5 rounded-lg border border-border px-4 py-3 text-sm leading-relaxed text-muted-foreground">
        <strong className="text-foreground">Someone asks you in person instead of online?</strong>{" "}
        No problem. Once you're signed in, click{" "}
        <strong className="text-foreground">"+ Log a Request"</strong> and fill it in yourself on
        their behalf — same process, same review, from there.
        <br />
        <br />
        <strong className="text-foreground">Keep your login to yourself.</strong> Your email and
        password are personal — please don't forward or share them. Lost your password or need help?
        Text or call 414-909-3279.
      </div>

      <div className="mx-auto mt-10 max-w-sm border-t border-border pt-8 text-center">
        {mode === "signin" ? (
          <>
            <h2 className="font-display text-xl font-bold">Comp Admin Sign-in</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in with the email and password Stephen gave you.
            </p>
            <div className="mt-4 space-y-3 text-left">
              <Input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button variant="gold" className="w-full" onClick={handleSignIn} disabled={busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                Sign In
              </Button>
              {msg && <p className="text-sm text-destructive">{msg}</p>}
              <button
                type="button"
                className="text-sm text-gold hover:underline"
                onClick={() => setMode("forgot")}
              >
                Forgot password?
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="font-display text-xl font-bold">Reset Password</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your email to get a reset code.
            </p>
            <div className="mt-4 space-y-3 text-left">
              <Input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={fpEmail}
                onChange={(e) => setFpEmail(e.target.value)}
              />
              <Button
                variant="goldOutline"
                className="w-full"
                onClick={handleSendResetCode}
                disabled={busy}
              >
                Send Reset Code
              </Button>
              {fpMsg && <p className="text-sm text-muted-foreground">{fpMsg}</p>}

              {fpSent && (
                <div className="space-y-3 border-t border-border pt-3">
                  <Input
                    placeholder="6-digit code"
                    inputMode="numeric"
                    maxLength={6}
                    value={fpCode}
                    onChange={(e) => setFpCode(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="New password (8+ characters)"
                    autoComplete="new-password"
                    value={fpNewPassword}
                    onChange={(e) => setFpNewPassword(e.target.value)}
                  />
                  <Button
                    variant="gold"
                    className="w-full"
                    onClick={handleResetPassword}
                    disabled={busy}
                  >
                    Set New Password
                  </Button>
                  {fpResetMsg && <p className="text-sm text-muted-foreground">{fpResetMsg}</p>}
                </div>
              )}

              <button
                type="button"
                className="text-sm text-gold hover:underline"
                onClick={() => setMode("signin")}
              >
                Back to sign in
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function LogRequestForm({
  approvers,
  onSubmitted,
  onCancel,
}: {
  approvers: string[];
  onSubmitted: () => void;
  onCancel: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const form = useForm<LogRequestValues>({
    resolver: zodResolver(logRequestSchema),
    defaultValues: {
      fullName: "",
      crewOrOrg: "",
      email: "",
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

  async function handleSubmit(values: LogRequestValues) {
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
        email: values.email.trim(),
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
            "There's already a request on file with this email or phone number -- check the list before logging another.",
          );
        } else {
          toast.error(`Error submitting: ${error.message}`);
        }
        return;
      }

      form.reset();
      onSubmitted();
    } finally {
      setBusy(false);
    }
  }

  const wantsToSell = form.watch("wantsToSell");
  const sellCount = form.watch("sellTicketsRequested") || 0;
  const approverValue = form.watch("approverName");
  const socialPlatforms = form.watch("socialPlatforms");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Their full name *</FormLabel>
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
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Their email *</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
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
              <FormLabel>Their phone</FormLabel>
              <FormControl>
                <Input type="tel" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="wantsFree"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Do they want free tickets? *</FormLabel>
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
              <FormLabel>Are they selling tickets? *</FormLabel>
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
                <FormLabel>How many do they want to sell? (up to 10 to start) *</FormLabel>
                <FormControl>
                  <Input type="number" min={1} max={10} {...field} />
                </FormControl>
                <FormMessage />
                <div className="rounded-lg border border-gold/30 bg-gold/5 px-3 py-2 text-xs leading-relaxed">
                  Remind them: 70% on their first 10 sold, 50% on each one after that up to 50
                  total. At ${TICKET_PRICE}/ticket that's up to{" "}
                  <strong className="text-gold">${payoutFor(sellCount).toFixed(0)}</strong> if they
                  sell all 50.
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
              <FormLabel>Who approved this (you, or whoever they actually asked)? *</FormLabel>
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
                Where can we follow them? Pick at least one and get their real handle *
              </FormLabel>
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
                        render={({ field: f }) => <Input {...f} placeholder="Which platform?" />}
                      />
                      <FormField
                        control={form.control}
                        name="handleOther"
                        render={({ field: f }) => <Input {...f} placeholder="@handle or link" />}
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
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea rows={2} {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex flex-wrap gap-2">
          <Button type="submit" variant="gold" disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : null}
            Submit Request
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}

function RequestCard({
  r,
  currentUserEmail,
  onChanged,
}: {
  r: CompRequest;
  currentUserEmail: string;
  onChanged: () => void;
}) {
  const [ttCode, setTtCode] = useState(r.tt_access_info ?? "");
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(r.full_name);
  const [editEmail, setEditEmail] = useState(r.email);
  const [editPhone, setEditPhone] = useState(r.phone ?? "");
  const [editMsg, setEditMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function setStatus(status: "pending" | "approved" | "rejected") {
    await supabase
      .from("comp_requests")
      .update({ status, reviewed_by: currentUserEmail, reviewed_at: new Date().toISOString() })
      .eq("id", r.id);
    onChanged();
  }

  async function saveCode() {
    await supabase.from("comp_requests").update({ tt_access_info: ttCode.trim() }).eq("id", r.id);
    onChanged();
  }

  async function sendAccessInfo() {
    if (!ttCode.trim()) {
      toast.error("Save a Ticket Tailor code/link first.");
      return;
    }
    setBusy(true);
    try {
      await supabase.from("comp_requests").update({ tt_access_info: ttCode.trim() }).eq("id", r.id);
      const { error } = await supabase.functions.invoke("send-access-info", { body: { id: r.id } });
      if (error) {
        toast.error(`Failed to send: ${error.message}`);
      } else {
        onChanged();
      }
    } finally {
      setBusy(false);
    }
  }

  async function saveEdit() {
    if (!editName.trim() || !editEmail.trim()) {
      setEditMsg("Name and email can't be blank.");
      return;
    }
    const { error } = await supabase
      .from("comp_requests")
      .update({
        full_name: editName.trim(),
        email: editEmail.trim(),
        phone: editPhone.trim() || null,
      })
      .eq("id", r.id);
    if (error) {
      setEditMsg(
        (error as { code?: string }).code === "23505"
          ? "Another request already uses that email or phone number."
          : `Error: ${error.message}`,
      );
      return;
    }
    setEditing(false);
    onChanged();
  }

  const approverLine = r.approver_listed
    ? r.approver_name
    : `${r.approver_name} (typed in — verify)`;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display font-bold">
          {r.full_name}
          {r.crew_or_org ? ` — ${r.crew_or_org}` : ""}
        </h3>
        <Badge
          className={
            r.status === "approved"
              ? "bg-gold text-gold-foreground"
              : r.status === "rejected"
                ? "bg-destructive text-destructive-foreground"
                : ""
          }
          variant={r.status === "pending" ? "outline" : "default"}
        >
          {r.status}
        </Badge>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
        <div>
          <span className="text-xs uppercase">Email:</span> {r.email}
        </div>
        <div>
          <span className="text-xs uppercase">Phone:</span> {r.phone || "—"}
        </div>
        <div>
          <span className="text-xs uppercase">Total:</span> {r.tickets_requested}
        </div>
        <div>
          <span className="text-xs uppercase">Told by:</span> {approverLine}
        </div>
      </div>
      <div className="mt-1 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
        <div>
          <span className="text-xs uppercase">Free:</span>{" "}
          {r.wants_free ? r.free_tickets_requested : "—"}
        </div>
        <div>
          <span className="text-xs uppercase">Selling:</span>{" "}
          {r.wants_to_sell ? r.sell_tickets_requested : "—"}
        </div>
      </div>
      {r.social_media && r.social_media.length > 0 && (
        <div className="mt-1 text-sm text-muted-foreground">
          <span className="text-xs uppercase">Social:</span>{" "}
          {r.social_media.map((s) => `${s.platform} ${s.handle}`).join(" · ")}
        </div>
      )}
      {r.notes && (
        <div className="mt-1 text-sm text-muted-foreground">
          <span className="text-xs uppercase">Notes:</span> {r.notes}
        </div>
      )}
      <div className="mt-2 text-xs text-muted-foreground">
        Submitted {new Date(r.created_at).toLocaleString()}
        {r.access_sent_at
          ? ` · Access info sent ${new Date(r.access_sent_at).toLocaleString()}`
          : ""}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {r.status === "pending" && (
          <>
            <Button size="sm" variant="gold" onClick={() => setStatus("approved")}>
              Approve
            </Button>
            <Button size="sm" variant="destructive" onClick={() => setStatus("rejected")}>
              Reject
            </Button>
          </>
        )}
        {r.status === "approved" && (
          <>
            <Input
              value={ttCode}
              onChange={(e) => setTtCode(e.target.value)}
              placeholder="Paste Ticket Tailor access code/link here"
              className="min-w-[220px] flex-1"
            />
            <Button size="sm" variant="outline" onClick={saveCode}>
              Save Code
            </Button>
            <Button size="sm" variant="gold" onClick={sendAccessInfo} disabled={busy}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : null}
              {r.access_sent_at ? "Resend Access Info" : "Send Access Info"}
            </Button>
          </>
        )}
        {r.status !== "pending" && (
          <Button size="sm" variant="outline" onClick={() => setStatus("pending")}>
            Reopen as Pending
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={() => setEditing((v) => !v)}>
          Edit Info
        </Button>
      </div>

      {editing && (
        <div className="mt-3 space-y-3 border-t border-border pt-3">
          <div className="space-y-1.5">
            <Label>Full name</Label>
            <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
          </div>
          {editMsg && <p className="text-sm text-destructive">{editMsg}</p>}
          <div className="flex gap-2">
            <Button size="sm" variant="gold" onClick={saveEdit}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ManageTeamPanel() {
  const [open, setOpen] = useState(false);
  const [admins, setAdmins] = useState<CompAdminRow[]>([]);
  const [approvers, setApprovers] = useState<ApproverRow[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [asAdmin, setAsAdmin] = useState(false);
  const [asApprover, setAsApprover] = useState(false);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadRosters() {
    const [{ data: a }, { data: p }] = await Promise.all([
      supabase.from("comp_admins").select("*").order("name"),
      supabase.from("approvers").select("*").order("name"),
    ]);
    setAdmins((a as CompAdminRow[]) ?? []);
    setApprovers((p as ApproverRow[]) ?? []);
  }

  useEffect(() => {
    if (open) loadRosters();
  }, [open]);

  async function toggleAdmin(a: CompAdminRow) {
    await supabase.from("comp_admins").update({ active: !a.active }).eq("id", a.id);
    loadRosters();
  }

  async function toggleApprover(a: ApproverRow) {
    await supabase.from("approvers").update({ active: !a.active }).eq("id", a.id);
    loadRosters();
  }

  async function addPerson() {
    if (!name.trim() || !email.trim() || (!asAdmin && !asApprover)) {
      setMsg("Enter a name, email, and pick at least one option.");
      return;
    }
    setBusy(true);
    setMsg("");
    try {
      const { data, error } = await supabase.functions.invoke("admin-create-person", {
        body: { name: name.trim(), email: email.trim(), asAdmin, asApprover },
      });
      if (error || data?.ok === false) {
        setMsg(`Error: ${error ? error.message : data.error}`);
        return;
      }
      setMsg(`Added${asAdmin ? " -- they'll get a welcome email to set their password." : "."}`);
      setName("");
      setEmail("");
      setAsAdmin(false);
      setAsApprover(false);
      loadRosters();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <Button variant="gold" size="sm" onClick={() => setOpen((v) => !v)}>
        Manage Team
      </Button>
      {open && (
        <div className="mt-4 space-y-6">
          <div>
            <h3 className="font-display font-bold">Reviewers</h3>
            <div className="mt-2 space-y-1.5 text-sm">
              {admins.map((a) => (
                <div key={a.id} className="flex items-center gap-2">
                  <span>
                    {a.name} -- {a.email}
                    {a.is_super_admin && (
                      <Badge className="ml-2 bg-gold text-gold-foreground">super admin</Badge>
                    )}
                  </span>
                  {!a.is_super_admin && (
                    <Button size="sm" variant="ghost" onClick={() => toggleAdmin(a)}>
                      {a.active ? "Deactivate" : "Reactivate"}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold">
              Approvers (appear in the public form's dropdown)
            </h3>
            <div className="mt-2 space-y-1.5 text-sm">
              {approvers.map((a) => (
                <div key={a.id} className="flex items-center gap-2">
                  <span>
                    {a.name}
                    {!a.active && (
                      <Badge variant="destructive" className="ml-2">
                        inactive
                      </Badge>
                    )}
                  </span>
                  <Button size="sm" variant="ghost" onClick={() => toggleApprover(a)}>
                    {a.active ? "Deactivate" : "Reactivate"}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold">Add a Person</h3>
            <div className="mt-2 space-y-3">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={asAdmin} onCheckedChange={(c) => setAsAdmin(!!c)} />
                Give them sign-in access (reviewer)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={asApprover} onCheckedChange={(c) => setAsApprover(!!c)} />
                Add to the approvers dropdown
              </label>
              <Button variant="gold" size="sm" onClick={addPerson} disabled={busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                Add Person
              </Button>
              {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function CompAdminPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [referralLink, setReferralLink] = useState<string | null>(null);

  const [approvers, setApprovers] = useState<string[]>([]);
  const [showLogRequest, setShowLogRequest] = useState(false);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [requests, setRequests] = useState<CompRequest[]>([]);

  async function handleSession(email: string | null) {
    setUserEmail(email);
    if (!email) {
      setIsAdmin(false);
      return;
    }

    const { data: adminCheck } = await supabase.rpc("is_comp_admin");
    if (!adminCheck) {
      setIsAdmin(false);
      return;
    }
    setIsAdmin(true);

    const { data: superCheck } = await supabase.rpc("is_comp_super_admin");
    setIsSuperAdmin(!!superCheck);

    const { data: myName } = await supabase.rpc("my_admin_name");
    if (myName) {
      const { data: appRows } = await supabase.from("approvers").select("name").eq("active", true);
      const isApprover = (appRows ?? []).some((a) => a.name === myName);
      if (isApprover) {
        setReferralLink(
          `${window.location.origin}/charly-black/comp/?ref=${encodeURIComponent(myName)}`,
        );
      }
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      handleSession(data.session?.user?.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    supabase
      .from("approvers")
      .select("name")
      .eq("active", true)
      .order("name")
      .then(({ data }) => setApprovers((data ?? []).map((a) => a.name as string)));
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, filter]);

  async function loadRequests() {
    let query = supabase
      .from("comp_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data } = await query;
    setRequests((data as CompRequest[]) ?? []);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  if (!userEmail) {
    return <GuideAndSignIn onSignedIn={() => {}} />;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-xl font-bold">Not Authorized</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You're signed in as <strong className="text-foreground">{userEmail}</strong>, but that
          email isn't on the approved reviewer list for Charly Black comp requests.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Ask Stephen to add you, or sign in with a different email.
        </p>
        <Button variant="outline" className="mt-6" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="font-display text-2xl font-bold">Charly Black — Comp Requests</h1>
          <p className="mt-1 text-sm text-muted-foreground">Signed in as {userEmail}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>

      {referralLink && (
        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          <h3 className="font-display font-bold">Your Referral Link</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Send this to anyone you're giving comp/sellable tickets to — it pre-fills your name so
            they don't have to.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Input value={referralLink} readOnly className="min-w-[220px] flex-1" />
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigator.clipboard.writeText(referralLink)}
            >
              Copy
            </Button>
          </div>
        </div>
      )}

      {isSuperAdmin && (
        <div className="mt-6">
          <ManageTeamPanel />
        </div>
      )}

      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <Button variant="gold" size="sm" onClick={() => setShowLogRequest((v) => !v)}>
          + Log a Request
        </Button>
        <p className="mt-2 text-sm text-muted-foreground">
          Someone contacted you directly asking for tickets? Log it here instead of sending them the
          public form.
        </p>
        {showLogRequest && (
          <LogRequestForm
            approvers={approvers}
            onCancel={() => setShowLogRequest(false)}
            onSubmitted={() => {
              setShowLogRequest(false);
              setFilter("pending");
              loadRequests();
            }}
          />
        )}
      </div>

      <div className="mt-6">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-4 space-y-4">
        {requests.length === 0 && (
          <p className="text-sm text-muted-foreground">No requests here.</p>
        )}
        {requests.map((r) => (
          <RequestCard key={r.id} r={r} currentUserEmail={userEmail} onChanged={loadRequests} />
        ))}
      </div>
    </div>
  );
}
