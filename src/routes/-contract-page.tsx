// Shared by src/routes/contract.tsx. The "-" prefix excludes this file from
// route generation (TanStack Router convention) — see src/routes/README.md.
//
// Flow: access code -> email verification (6-digit code, not a link -- see
// supabase/functions/request-contract-verification for why) -> read the
// contract + fill in details + typed signature -> submit. All validation
// is re-checked server-side in submit-talent-contract; the client-side
// step gating here is purely UX, not the security boundary.
//
// DRAFT CONTRACT LANGUAGE: CONTRACT_SECTIONS below is a standard-form
// starting point, not reviewed by a lawyer -- keep in sync with
// buildContractSections() in supabase/functions/submit-talent-contract.
// Don't distribute real access codes until the wording is approved.
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const SITE_URL = "https://trcevent.com";

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
  actName: string;
  role: string;
  eventName: string;
  compensationTerms: string;
};

// Mirrors buildContractSections() in supabase/functions/submit-talent-contract
// -- shown here so the signer can actually read what they're agreeing to.
function contractSections(invite: InviteInfo) {
  return [
    {
      body: `This Independent Performance Agreement ("Agreement") is between Ras Tafari Inc, an Illinois nonprofit corporation ("Presenter"), and you ("Talent"), professionally known as ${invite.actName}.`,
    },
    {
      heading: "1. Engagement",
      body: `Presenter engages Talent to perform as ${invite.role} at the event known as "${invite.eventName}" (the "Event"). Date, time, load-in, and set length will be confirmed separately in writing between Presenter and Talent.`,
    },
    { heading: "2. Compensation", body: invite.compensationTerms },
    {
      heading: "3. Independent Contractor",
      body: "Talent is an independent contractor, not an employee, agent, or partner of Presenter. Talent is solely responsible for Talent's own taxes, equipment, transportation, and insurance unless otherwise agreed in writing.",
    },
    {
      heading: "4. Talent Responsibilities",
      body: "Talent agrees to arrive prepared and on time, to perform professionally, and to comply with venue rules and reasonable instructions from Presenter's event staff.",
    },
    {
      heading: "5. Cancellation",
      body: "Either party may cancel this engagement by providing written notice as far in advance as reasonably possible.",
    },
    {
      heading: "6. Media & Promotion",
      body: "Talent grants Presenter a non-exclusive, royalty-free license to use Talent's name, likeness, and performance footage or photography from the Event for promotional purposes related to the Event and Presenter's mission, unless Talent and Presenter agree otherwise in writing in advance.",
    },
    {
      heading: "7. Liability",
      body: "Talent performs at Talent's own risk. Talent agrees to release and hold harmless Presenter and its officers, directors, volunteers, and agents from claims arising from Talent's participation in the Event, except to the extent caused by Presenter's gross negligence or willful misconduct.",
    },
    {
      heading: "8. Independent Legal Review",
      body: "This is a standard-form agreement. Either party may have this Agreement reviewed by independent legal counsel before signing.",
    },
    {
      heading: "9. Governing Law",
      body: "This Agreement is governed by the laws of the State of Illinois.",
    },
    {
      heading: "10. Entire Agreement",
      body: "This Agreement, together with any written amendments signed by both parties, constitutes the entire agreement between Talent and Presenter regarding the Event and supersedes any prior oral or written understandings.",
    },
    {
      heading: "11. Electronic Signature",
      body: "Your typed name below, submitted through this form, constitutes your electronic signature and has the same legal effect as a handwritten signature.",
    },
  ];
}

const signFormSchema = z.object({
  signerFullLegalName: z.string().trim().min(2, "Enter your full legal name."),
  signerAddress: z.string().trim().min(5, "Enter your mailing address."),
  signerPhone: z.string().trim().min(7, "Enter a phone number."),
  signatureTypedName: z.string().trim().min(2, "Type your name to sign."),
  agreedTerms: z.literal(true, { message: "You must agree to the terms above to sign." }),
});
type SignFormValues = z.infer<typeof signFormSchema>;

export function ContractPage() {
  const [step, setStep] = useState<"code" | "email" | "verify" | "sign" | "done">("code");
  const [busy, setBusy] = useState(false);

  const [accessCode, setAccessCode] = useState("");
  const [invite, setInvite] = useState<InviteInfo | null>(null);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const form = useForm<SignFormValues>({
    resolver: zodResolver(signFormSchema),
    defaultValues: {
      signerFullLegalName: "",
      signerAddress: "",
      signerPhone: "",
      signatureTypedName: "",
      agreedTerms: false as unknown as true,
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
      setInvite({
        actName: data.actName,
        role: data.role,
        eventName: data.eventName,
        compensationTerms: data.compensationTerms,
      });
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
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-talent-contract", {
        body: {
          accessCode: accessCode.trim(),
          signerEmail: email.trim(),
          signerFullLegalName: values.signerFullLegalName,
          signerAddress: values.signerAddress,
          signerPhone: values.signerPhone,
          signatureTypedName: values.signatureTypedName,
          agreedTerms: values.agreedTerms,
        },
      });
      if (error || !data?.ok) {
        toast.error(data?.error ?? "Couldn't submit your contract. Try again.");
        return;
      }
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
              className="space-y-4 rounded-xl border border-border bg-card p-6"
            >
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
              <Button type="submit" variant="gold" size="xl" className="w-full" disabled={busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                Sign &amp; submit
              </Button>
            </form>
          </Form>
        </div>
      )}

      {step === "done" && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-gold/40 bg-gold/10 p-10 text-center">
          <CheckCircle2 className="size-10 text-gold" />
          <h2 className="font-display text-xl font-bold">Contract signed</h2>
          <p className="text-sm text-muted-foreground">
            Thanks — your signed contract has been submitted. You'll be contacted separately with
            any remaining event details.
          </p>
        </div>
      )}
    </div>
  );
}

function InviteSummary({ invite }: { invite: InviteInfo }) {
  return (
    <div className="rounded-lg border border-gold/30 bg-gold/5 px-4 py-3 text-sm">
      Signing as <strong className="text-foreground">{invite.actName}</strong> ({invite.role}) for{" "}
      <strong className="text-foreground">{invite.eventName}</strong>
    </div>
  );
}
