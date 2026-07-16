// Shared by src/routes/contract.tsx. The "-" prefix excludes this file from
// route generation (TanStack Router convention) — see src/routes/README.md.
//
// Flow: access code -> email verification (6-digit code, not a link -- see
// supabase/functions/request-contract-verification for why) -> read the
// contract + fill in details + typed signature -> submit. All validation
// is re-checked server-side in submit-talent-contract; the client-side
// step gating here is purely UX, not the security boundary.
//
// DRAFT CONTRACT LANGUAGE: contractSections() below is a standard-form
// starting point, not reviewed by a lawyer -- keep in sync with
// buildContractSections() in supabase/functions/submit-talent-contract.
// Don't distribute real access codes until the wording is approved.
//
// Tech rider / hospitality / promo info is deliberately NOT collected here
// -- see src/routes/-tech-rider-page.tsx, a separate non-legal form.
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, FileSignature, KeyRound, Loader2, Mail, ShieldCheck } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const SITE_URL = "https://trcevent.com";
const PAYMENT_METHODS = ["Zelle", "Cash App", "Check", "Cash", "Bank Transfer", "Other"] as const;
const PAYEE_ENTITIES = ["Artist directly", "Manager", "Company/LLC"] as const;

export function contractHead() {
  return {
    meta: [
      { title: "Performance Contract | TRC Events" },
      {
        name: "description",
        content: "Sign your TRC Events / Ras Tafari Inc performance contract.",
      },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/contract` }],
  };
}

type InviteInfo = {
  inviteId: string;
  actName: string;
  role: string;
  performanceType: string;
  eventName: string;
  venueName: string;
  venueAddress: string;
  performanceDate: string | null;
  arrivalTime: string;
  soundcheckTime: string;
  setTime: string;
  setLengthMinutes: number | null;
  compensationTerms: string;
  taxFormRequired: boolean;
  cancellationNoticeDays: number;
  merchRightsAllowed: boolean;
  radiusClauseEnabled: boolean;
  radiusMiles: number | null;
  radiusDays: number | null;
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "to be confirmed";
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Mirrors buildContractSections() in supabase/functions/submit-talent-contract
// -- shown here so the signer can actually read what they're agreeing to.
// Signer-specific fields (business name, payment method, etc.) aren't known
// yet at this point in the flow, so those clauses reference the invite's
// deal terms only -- the final PDF fills in the rest.
function contractSections(invite: InviteInfo) {
  const sections: { heading?: string; body: string }[] = [
    {
      body: `This Independent Performance Agreement ("Agreement") is between Ras Tafari Inc, an Illinois nonprofit corporation ("Presenter"), and you ("Talent"), professionally known as ${invite.actName}.`,
    },
    {
      heading: "1. Engagement",
      body: `Presenter engages Talent to perform as ${invite.performanceType} (${invite.role}) at "${invite.eventName}" at ${invite.venueName || "a venue to be confirmed"}${invite.venueAddress ? `, ${invite.venueAddress}` : ""}, on ${formatDate(invite.performanceDate)}. Arrival/call time: ${invite.arrivalTime || "to be confirmed"}. Soundcheck: ${invite.soundcheckTime || "to be confirmed"}. Set time: ${invite.setTime || "to be confirmed"}${invite.setLengthMinutes ? `, approximately ${invite.setLengthMinutes} minutes` : ""}.`,
    },
    {
      heading: "2. Compensation & Payment",
      body: `${invite.compensationTerms} Your payment method and payee details are collected below and included in the final signed copy.`,
    },
    {
      heading: "3. Tax Documentation",
      body: invite.taxFormRequired
        ? "Talent agrees to provide Presenter a completed IRS Form W-9 before payment is issued. This form does not collect a Social Security Number or Employer Identification Number -- the W-9 is provided separately and securely."
        : "No W-9 is required for this engagement.",
    },
    {
      heading: "4. Independent Contractor",
      body: "Talent is an independent contractor, not an employee, agent, or partner of Presenter. Talent is solely responsible for Talent's own taxes, equipment, transportation, and insurance unless otherwise agreed in writing.",
    },
    {
      heading: "5. Talent Responsibilities & Conduct",
      body: "Talent agrees to arrive prepared and on time, to perform professionally, and to comply with venue rules and reasonable instructions from Presenter's event staff. Talent agrees to conduct themselves, and to ensure anyone accompanying them conducts themselves, in a professional and lawful manner while at the Event, including compliance with the venue's policies on alcohol, controlled substances, and safety.",
    },
    {
      heading: "6. Additional People",
      body: "The number of people accompanying Talent is collected below. Any guest or ticket access for Talent or their party is arranged through TRC Events' ticketing process, not through this Agreement.",
    },
    {
      heading: "7. No-Show / Late Arrival",
      body: "If Talent fails to arrive within thirty (30) minutes of the confirmed arrival/call time without prior notice to Presenter, Presenter may treat this as a no-show, cancel Talent's engagement for the Event, and Talent forfeits any deposit or compensation that would otherwise be due for the Event.",
    },
    {
      heading: "8. Cancellation",
      body: `Either party may cancel this engagement by providing written notice at least ${invite.cancellationNoticeDays} days before the Event. Cancellation with less notice may forfeit any deposit paid, except where the cancelling party is prevented from performing by a Force Majeure event (see below).`,
    },
    {
      heading: "9. Force Majeure",
      body: "Neither party is liable for failure to perform due to causes beyond their reasonable control, including but not limited to acts of God, severe weather, government order, venue closure, illness, or other emergency. The affected party will notify the other as soon as reasonably possible.",
    },
    {
      heading: "10. Media & Promotion",
      body: "Talent grants Presenter a non-exclusive, royalty-free license to record, photograph, and use Talent's name, likeness, and performance footage or photography from the Event for promotional purposes related to the Event and Presenter's mission, unless Talent and Presenter agree otherwise in writing in advance.",
    },
    {
      heading: "11. Merchandise",
      body: invite.merchRightsAllowed
        ? "Talent may sell official merchandise at the Event, subject to Presenter's standard venue table/fee policies as communicated in advance."
        : "Talent may not sell merchandise at the Event unless Presenter agrees otherwise in writing in advance.",
    },
  ];

  if (invite.radiusClauseEnabled) {
    sections.push({
      heading: "12. Exclusivity (Radius Clause)",
      body: `Talent agrees not to perform${invite.radiusMiles ? ` within ${invite.radiusMiles} miles of the Event's venue` : " at another engagement in the same market"}${invite.radiusDays ? ` during the ${invite.radiusDays} days before and after the Event` : ""}, without Presenter's prior written consent.`,
    });
  }

  const n = invite.radiusClauseEnabled ? 13 : 12;
  sections.push(
    {
      heading: `${n}. Replacement / Substitution`,
      body: "If Talent becomes unable to perform, Presenter may accept a substitute performer of reasonably comparable caliber in Talent's place; Talent will cooperate in good faith to identify a substitute where possible.",
    },
    {
      heading: `${n + 1}. Liability & Indemnification`,
      body: "Talent performs at Talent's own risk. Talent agrees to release and hold harmless Presenter and its officers, directors, volunteers, and agents from claims arising from Talent's participation in the Event, except to the extent caused by Presenter's gross negligence or willful misconduct.",
    },
    {
      heading: `${n + 2}. Independent Legal Review`,
      body: "This is a standard-form agreement. Either party may have this Agreement reviewed by independent legal counsel before signing.",
    },
    {
      heading: `${n + 3}. Governing Law`,
      body: "This Agreement is governed by the laws of the State of Illinois.",
    },
    {
      heading: `${n + 4}. Entire Agreement`,
      body: "This Agreement, together with any written amendments signed by both parties, constitutes the entire agreement between Talent and Presenter regarding the Event and supersedes any prior oral or written understandings.",
    },
    {
      heading: `${n + 5}. Electronic Signature`,
      body: "Your typed name below, submitted through this form, constitutes your electronic signature and has the same legal effect as a handwritten signature.",
    },
  );

  return sections;
}

const signFormSchema = z.object({
  signerFullLegalName: z.string().trim().min(2, "Enter your full legal name."),
  signerBusinessName: z.string().trim().optional(),
  signerAddress: z.string().trim().min(5, "Enter your mailing address."),
  signerPhone: z.string().trim().min(7, "Enter a phone number."),
  emergencyContactName: z.string().trim().min(2, "Enter an emergency contact name."),
  emergencyContactPhone: z.string().trim().min(7, "Enter an emergency contact phone number."),
  governmentIdName: z.string().trim().min(2, "Enter the name on your government ID."),
  paymentMethods: z.array(z.enum(PAYMENT_METHODS)).min(1, "Choose at least one payment method."),
  payeeEntity: z.enum(PAYEE_ENTITIES, { message: "Choose who gets paid." }),
  payeeDetails: z.string().trim().optional(),
  taxFormAcknowledged: z.boolean(),
  additionalPeopleCount: z.coerce.number().int().min(0).default(0),
  additionalPeopleNotes: z.string().trim().optional(),
  signatureTypedName: z.string().trim().min(2, "Type your name to sign."),
  agreedTerms: z.literal(true, { message: "You must agree to the terms above to sign." }),
});
type SignFormValues = z.infer<typeof signFormSchema>;

// The tailored ticket-request step after signing -- same underlying flow as
// the public /charly-black/comp/ form, but name/email/phone are pulled from
// the just-signed contract server-side rather than asked again here.
const ticketFormSchema = z
  .object({
    wantsFree: z.boolean(),
    freeTicketsRequested: z.coerce.number().int().min(0).max(2),
    wantsToSell: z.boolean(),
    sellTicketsRequested: z.coerce.number().int().min(0).max(10),
    socialInstagram: z.string().trim().optional(),
    socialTiktok: z.string().trim().optional(),
    socialOther: z.string().trim().optional(),
    notes: z.string().trim().optional(),
  })
  .refine((v) => v.wantsFree || v.wantsToSell, {
    message: "Request free tickets, tickets to sell, or both.",
    path: ["wantsToSell"],
  })
  .refine((v) => !v.wantsFree || v.freeTicketsRequested >= 1, {
    message: "Enter how many free tickets (1-2).",
    path: ["freeTicketsRequested"],
  })
  .refine((v) => !v.wantsToSell || v.sellTicketsRequested >= 1, {
    message: "Enter how many tickets to sell (1-10).",
    path: ["sellTicketsRequested"],
  })
  .refine((v) => v.socialInstagram || v.socialTiktok || v.socialOther, {
    message: "Add at least one social media handle.",
    path: ["socialInstagram"],
  });
type TicketFormValues = z.infer<typeof ticketFormSchema>;

export function ContractPage() {
  const [step, setStep] = useState<"code" | "email" | "verify" | "sign" | "tickets" | "done">(
    "code",
  );
  const [busy, setBusy] = useState(false);

  const [accessCode, setAccessCode] = useState("");
  const [invite, setInvite] = useState<InviteInfo | null>(null);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const form = useForm<SignFormValues>({
    resolver: zodResolver(signFormSchema),
    defaultValues: {
      signerFullLegalName: "",
      signerBusinessName: "",
      signerAddress: "",
      signerPhone: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      governmentIdName: "",
      paymentMethods: [],
      payeeDetails: "",
      taxFormAcknowledged: false,
      additionalPeopleCount: 0,
      additionalPeopleNotes: "",
      signatureTypedName: "",
      agreedTerms: false as unknown as true,
    },
  });

  const ticketForm = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      wantsFree: false,
      freeTicketsRequested: 0,
      wantsToSell: false,
      sellTicketsRequested: 0,
      socialInstagram: "",
      socialTiktok: "",
      socialOther: "",
      notes: "",
    },
  });

  async function handleCheckAccessCode(e: React.FormEvent) {
    e.preventDefault();
    if (!accessCode.trim()) return;
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-contract-access", {
        body: { accessCode: accessCode.trim() },
      });
      if (error || !data?.valid) {
        toast.error(data?.error ?? "Couldn't check that access code. Try again.");
        return;
      }
      if (data.status === "signed") {
        toast.error("This contract has already been signed.");
        return;
      }
      setInvite(data as InviteInfo);
      setStep("email");
    } catch {
      toast.error("Something went wrong. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRequestCode(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("request-contract-verification", {
        body: { email: email.trim() },
      });
      if (error || data?.error) {
        toast.error(data?.error ?? "Couldn't send a verification code. Try again.");
        return;
      }
      toast.success("Check your email for a 6-digit code.");
      setStep("verify");
    } catch {
      toast.error("Something went wrong. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) return;
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-contract-code", {
        body: { email: email.trim(), code: otp },
      });
      if (error || !data?.valid) {
        toast.error(data?.error ?? "That code didn't work. Try again.");
        return;
      }
      toast.success("Email verified.");
      setStep("sign");
    } catch {
      toast.error("Something went wrong. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmitContract(values: SignFormValues) {
    if (invite?.taxFormRequired && !values.taxFormAcknowledged) {
      toast.error("You must acknowledge that you'll provide a W-9 before submitting.");
      return;
    }
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-talent-contract", {
        body: {
          accessCode: accessCode.trim(),
          signerEmail: email.trim(),
          ...values,
        },
      });
      if (error || !data?.ok) {
        toast.error(data?.error ?? "Couldn't submit your contract. Try again.");
        return;
      }
      setStep("tickets");
    } catch {
      toast.error("Something went wrong. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmitTickets(values: TicketFormValues) {
    setBusy(true);
    try {
      const socialMedia = [
        values.socialInstagram && { platform: "Instagram", handle: values.socialInstagram },
        values.socialTiktok && { platform: "TikTok", handle: values.socialTiktok },
        values.socialOther && { platform: "Other", handle: values.socialOther },
      ].filter(Boolean);

      const { data, error } = await supabase.functions.invoke("submit-performer-ticket-request", {
        body: {
          accessCode: accessCode.trim(),
          wantsFree: values.wantsFree,
          freeTicketsRequested: values.freeTicketsRequested,
          wantsToSell: values.wantsToSell,
          sellTicketsRequested: values.sellTicketsRequested,
          socialMedia,
          notes: values.notes,
        },
      });
      if (error || !data?.ok) {
        toast.error(data?.error ?? "Couldn't submit your ticket request. Try again.");
        return;
      }
      toast.success("Ticket request submitted.");
      setStep("done");
    } catch {
      toast.error("Something went wrong. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <p className="eyebrow mb-2">Ras Tafari Inc — TRC Events</p>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Performance Contract</h1>
      </div>

      {step === "code" && (
        <form
          onSubmit={handleCheckAccessCode}
          className="space-y-4 rounded-xl border border-border bg-card p-6"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <KeyRound className="size-4 text-gold" />
            Enter the access code TRC Events gave you to unlock your contract.
          </div>
          <div>
            <Label htmlFor="access-code">Access code</Label>
            <Input
              id="access-code"
              autoFocus
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              placeholder="e.g. 7F3KQ9WCXM"
              className="mt-1.5 font-mono tracking-widest"
            />
          </div>
          <Button type="submit" variant="gold" className="w-full" disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : null}
            Continue
          </Button>
        </form>
      )}

      {step === "email" && invite && (
        <div className="space-y-4 rounded-xl border border-border bg-card p-6">
          <InviteSummary invite={invite} />
          <form onSubmit={handleRequestCode} className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="size-4 text-gold" />
              We'll email you a 6-digit code to confirm it's really you.
            </div>
            <div>
              <Label htmlFor="email">Your email</Label>
              <Input
                id="email"
                type="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1.5"
              />
            </div>
            <Button type="submit" variant="gold" className="w-full" disabled={busy}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : null}
              Send code
            </Button>
          </form>
        </div>
      )}

      {step === "verify" && invite && (
        <div className="space-y-4 rounded-xl border border-border bg-card p-6">
          <InviteSummary invite={invite} />
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="size-4 text-gold" />
              Enter the code we sent to {email}.
            </div>
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <Button
              type="submit"
              variant="gold"
              className="w-full"
              disabled={busy || otp.length !== 6}
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : null}
              Verify
            </Button>
            <button
              type="button"
              className="w-full text-center text-xs text-muted-foreground hover:text-gold"
              onClick={handleRequestCode}
              disabled={busy}
            >
              Didn't get it? Resend code
            </button>
          </form>
        </div>
      )}

      {step === "sign" && invite && (
        <div className="space-y-6">
          <InviteSummary invite={invite} />

          <div className="max-h-96 overflow-y-auto rounded-xl border border-border bg-card p-6 text-sm leading-relaxed text-muted-foreground">
            {contractSections(invite).map((s, i) => (
              <div key={i} className="mb-4">
                {s.heading ? (
                  <p className="mb-1 font-semibold text-foreground">{s.heading}</p>
                ) : null}
                <p>{s.body}</p>
              </div>
            ))}
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmitContract)}
              className="space-y-5 rounded-xl border border-border bg-card p-6"
            >
              <div className="space-y-4">
                <p className="eyebrow">Your information</p>
                <FormField
                  control={form.control}
                  name="signerFullLegalName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full legal name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="signerBusinessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business name (if applicable)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="governmentIdName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name on your government ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="signerAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mailing address</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <Label>Email</Label>
                  <Input value={email} disabled className="mt-1.5 opacity-70" />
                </div>
                <FormField
                  control={form.control}
                  name="signerPhone"
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
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="emergencyContactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency contact name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emergencyContactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency contact phone</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4 border-t border-border pt-5">
                <p className="eyebrow">Payment</p>
                <FormField
                  control={form.control}
                  name="paymentMethods"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Payment method (how do you prefer to get paid — choose all that work for
                        you)
                      </FormLabel>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {PAYMENT_METHODS.map((m) => (
                          <label key={m} className="flex items-center gap-2 text-sm">
                            <Checkbox
                              checked={field.value.includes(m)}
                              onCheckedChange={(checked) =>
                                field.onChange(
                                  checked
                                    ? [...field.value, m]
                                    : field.value.filter((v) => v !== m),
                                )
                              }
                            />
                            {m}
                          </label>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="payeeEntity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Who gets paid</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose who gets paid" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PAYEE_ENTITIES.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="payeeDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment details (handle, account name, etc.)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. Zelle to 555-0100, or LLC name for check"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {invite.taxFormRequired && (
                  <FormField
                    control={form.control}
                    name="taxFormAcknowledged"
                    render={({ field }) => (
                      <FormItem className="flex items-start gap-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div>
                          <FormLabel className="font-normal">
                            I will provide a completed IRS Form W-9 to Presenter before payment is
                            issued.
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="space-y-4 border-t border-border pt-5">
                <p className="eyebrow">Additional People</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="additionalPeopleCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>People accompanying you</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="additionalPeopleNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Who (roles)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. 1 hype man, 1 manager" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Guest and ticket access is handled separately, right after you sign — not here.
                </p>
              </div>

              <div className="space-y-4 border-t border-border pt-5">
                <p className="eyebrow">Signature</p>
                <FormField
                  control={form.control}
                  name="signatureTypedName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <FileSignature className="size-3.5 text-gold" /> Type your full name to sign
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="font-display italic"
                          placeholder="Your name here"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="agreedTerms"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div>
                        <FormLabel className="font-normal">
                          I have read this Agreement and agree to its terms. I understand my typed
                          signature is legally binding.
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" variant="gold" size="xl" className="w-full" disabled={busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                Sign &amp; submit
              </Button>
            </form>
          </Form>
        </div>
      )}

      {step === "tickets" && invite && (
        <div className="space-y-6">
          <div className="rounded-lg border border-gold/30 bg-gold/5 px-4 py-3 text-sm">
            <p className="mb-1 font-semibold text-foreground">Contract signed ✓</p>
            <p className="text-muted-foreground">
              Now let's get your ticket allocation — same as everyone else, just without re-asking
              for your name, email, or phone.
            </p>
          </div>

          <Form {...ticketForm}>
            <form
              onSubmit={ticketForm.handleSubmit(handleSubmitTickets)}
              className="space-y-5 rounded-xl border border-border bg-card p-6"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3 rounded-lg border border-border p-4">
                  <FormField
                    control={ticketForm.control}
                    name="wantsFree"
                    render={({ field }) => (
                      <FormItem className="flex items-start gap-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal">I'd like free tickets</FormLabel>
                      </FormItem>
                    )}
                  />
                  {ticketForm.watch("wantsFree") && (
                    <FormField
                      control={ticketForm.control}
                      name="freeTicketsRequested"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How many (1–2)</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} max={2} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                <div className="space-y-3 rounded-lg border border-border p-4">
                  <FormField
                    control={ticketForm.control}
                    name="wantsToSell"
                    render={({ field }) => (
                      <FormItem className="flex items-start gap-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal">I'd like tickets to sell</FormLabel>
                      </FormItem>
                    )}
                  />
                  {ticketForm.watch("wantsToSell") && (
                    <FormField
                      control={ticketForm.control}
                      name="sellTicketsRequested"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How many (1–10)</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} max={10} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
              {invite.role === "Opening Act" && (
                <p className="text-xs text-muted-foreground">
                  As an opening act, your compensation is based on tickets you sell — this is where
                  that starts.
                </p>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={ticketForm.control}
                  name="socialInstagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="@handle" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={ticketForm.control}
                  name="socialTiktok"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TikTok</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="@handle" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={ticketForm.control}
                name="socialOther"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other social</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={ticketForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (optional)</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={2} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" variant="gold" size="xl" className="w-full" disabled={busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                Submit ticket request
              </Button>
              <button
                type="button"
                className="w-full text-center text-xs text-muted-foreground hover:text-gold"
                onClick={() => setStep("done")}
                disabled={busy}
              >
                Skip for now — I'll request tickets later
              </button>
            </form>
          </Form>
        </div>
      )}

      {step === "done" && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-gold/40 bg-gold/10 p-10 text-center">
          <CheckCircle2 className="size-10 text-gold" />
          <h2 className="font-display text-xl font-bold">All set</h2>
          <p className="text-sm text-muted-foreground">
            Thanks — your signed contract is in, and a copy has been emailed to you for your
            records. If TRC Events also asked for a tech rider, use the same access code at{" "}
            <a href="/tech-rider" className="text-gold hover:underline">
              trcevent.com/tech-rider
            </a>
            .
          </p>
        </div>
      )}
    </div>
  );
}

function InviteSummary({ invite }: { invite: InviteInfo }) {
  return (
    <div className="space-y-1 rounded-lg border border-gold/30 bg-gold/5 px-4 py-3 text-sm">
      <p>
        Signing as <strong className="text-foreground">{invite.actName}</strong> ({invite.role}) for{" "}
        <strong className="text-foreground">{invite.eventName}</strong>
      </p>
      <p className="text-muted-foreground">
        {invite.venueName ? `${invite.venueName} — ` : ""}
        {formatDate(invite.performanceDate)}
        {invite.setTime ? ` — set time ${invite.setTime}` : ""}
      </p>
    </div>
  );
}
