// Shared by src/routes/tech-rider.tsx. The "-" prefix excludes this file
// from route generation (TanStack Router convention) — see
// src/routes/README.md.
//
// Separate from the contract flow on purpose -- see migration 0010's
// comment on tech_rider_submissions. Gated by the same access code as the
// contract, but no email verification and no signature: this is
// operational/technical info, not a legal term. Can be submitted before or
// after the contract itself is signed.
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { KeyRound, Loader2, CheckCircle2 } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const SITE_URL = "https://trcevent.com";

export function techRiderHead() {
  return {
    meta: [
      { title: "Tech Rider & Promo Info | TRC Events" },
      {
        name: "description",
        content: "Submit your technical rider, hospitality needs, and promo info to TRC Events.",
      },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/tech-rider` }],
  };
}

const DJ_EQUIPMENT_OPTIONS = [
  "CDJs",
  "Mixer",
  "Controller",
  "Turntables",
  "Microphone",
  "Headphones",
];

type FormValues = {
  socialInstagram: string;
  socialTiktok: string;
  socialOther: string;
  pressPhotoUrl: string;
  shortBio: string;
  promoCommitmentAck: boolean;
  // DJ
  djFormat: string;
  djEquipmentNeeded: string[];
  djBringsOwnGear: boolean;
  djNeedsTableBooth: boolean;
  djNeedsMcMic: boolean;
  djSetStyle: string;
  djSpecialIntro: string;
  djPreferredGenre: string;
  djNoPlayList: string;
  // Opening act / other
  oaPerformerCount: number;
  oaUsesBackingTracks: boolean;
  oaMicCount: number;
  oaBackingTrackFormat: string;
  oaTravelingDj: boolean;
  oaInputList: string;
  oaStagePlotNotes: string;
  oaSpecialProps: string;
  oaWalkOnCue: string;
};

const DEFAULTS: FormValues = {
  socialInstagram: "",
  socialTiktok: "",
  socialOther: "",
  pressPhotoUrl: "",
  shortBio: "",
  promoCommitmentAck: false,
  djFormat: "",
  djEquipmentNeeded: [],
  djBringsOwnGear: false,
  djNeedsTableBooth: false,
  djNeedsMcMic: false,
  djSetStyle: "",
  djSpecialIntro: "",
  djPreferredGenre: "",
  djNoPlayList: "",
  oaPerformerCount: 1,
  oaUsesBackingTracks: false,
  oaMicCount: 1,
  oaBackingTrackFormat: "",
  oaTravelingDj: false,
  oaInputList: "",
  oaStagePlotNotes: "",
  oaSpecialProps: "",
  oaWalkOnCue: "",
};

export function TechRiderPage() {
  const [step, setStep] = useState<"code" | "form" | "done">("code");
  const [busy, setBusy] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [invite, setInvite] = useState<{ actName: string; role: string } | null>(null);

  const { register, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: DEFAULTS,
  });
  const isDj = invite?.role === "DJ";
  const equipment = watch("djEquipmentNeeded");

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
      setInvite({ actName: data.actName, role: data.role });
      setStep("form");
    } catch {
      toast.error("Something went wrong. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function onSubmit(values: FormValues) {
    setBusy(true);
    try {
      const socialMedia = [
        values.socialInstagram && { platform: "Instagram", handle: values.socialInstagram },
        values.socialTiktok && { platform: "TikTok", handle: values.socialTiktok },
        values.socialOther && { platform: "Other", handle: values.socialOther },
      ].filter(Boolean);

      const body: Record<string, unknown> = {
        accessCode: accessCode.trim(),
        socialMedia,
        pressPhotoUrl: values.pressPhotoUrl || null,
        shortBio: values.shortBio || null,
        promoCommitmentAck: values.promoCommitmentAck,
      };

      if (isDj) {
        body.dj = {
          format: values.djFormat,
          equipmentNeeded: values.djEquipmentNeeded,
          bringsOwnGear: values.djBringsOwnGear,
          needsTableBooth: values.djNeedsTableBooth,
          needsMcMic: values.djNeedsMcMic,
          setStyle: values.djSetStyle,
          specialIntro: values.djSpecialIntro,
          preferredGenre: values.djPreferredGenre,
          noPlayList: values.djNoPlayList,
        };
      } else {
        body.openingAct = {
          performerCount: values.oaPerformerCount,
          usesBackingTracks: values.oaUsesBackingTracks,
          micCount: values.oaMicCount,
          backingTrackFormat: values.oaBackingTrackFormat,
          travelingDj: values.oaTravelingDj,
          inputList: values.oaInputList,
          stagePlotNotes: values.oaStagePlotNotes,
          specialProps: values.oaSpecialProps,
          walkOnCue: values.oaWalkOnCue,
        };
      }

      const { data, error } = await supabase.functions.invoke("submit-tech-rider", { body });
      if (error || !data?.ok) {
        toast.error(data?.error ?? "Couldn't submit. Try again.");
        return;
      }
      setStep("done");
    } catch {
      toast.error("Something went wrong. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  function toggleEquipment(item: string) {
    const next = equipment.includes(item)
      ? equipment.filter((i) => i !== item)
      : [...equipment, item];
    setValue("djEquipmentNeeded", next);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <p className="eyebrow mb-2">Ras Tafari Inc — TRC Events</p>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Tech Rider &amp; Promo Info</h1>
      </div>

      {step === "code" && (
        <form
          onSubmit={handleCheckAccessCode}
          className="space-y-4 rounded-xl border border-border bg-card p-6"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <KeyRound className="size-4 text-gold" />
            Use the same access code TRC Events gave you for your contract.
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

      {step === "form" && invite && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="rounded-lg border border-gold/30 bg-gold/5 px-4 py-3 text-sm">
            Submitting as <strong className="text-foreground">{invite.actName}</strong> (
            {invite.role})
          </div>

          {isDj ? (
            <div className="space-y-4 rounded-xl border border-border bg-card p-6">
              <p className="eyebrow">DJ tech rider</p>
              <div>
                <Label>Format</Label>
                <Input
                  {...register("djFormat")}
                  placeholder="USB / Serato / Rekordbox / Laptop + Controller"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Equipment needed</Label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {DJ_EQUIPMENT_OPTIONS.map((item) => (
                    <label key={item} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={equipment.includes(item)}
                        onCheckedChange={() => toggleEquipment(item)}
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox {...checkboxProps(register, "djBringsOwnGear")} /> Bringing my own
                laptop/controller
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox {...checkboxProps(register, "djNeedsTableBooth")} /> Need a table/booth
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox {...checkboxProps(register, "djNeedsMcMic")} /> Need an MC mic
              </label>
              <div>
                <Label>Set style</Label>
                <RadioGroup
                  className="mt-2"
                  value={watch("djSetStyle")}
                  onValueChange={(v) => setValue("djSetStyle", v)}
                >
                  {["Clean / open-format", "Explicit"].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-sm">
                      <RadioGroupItem value={opt} /> {opt}
                    </label>
                  ))}
                </RadioGroup>
              </div>
              <div>
                <Label>Special intro or drops</Label>
                <Input {...register("djSpecialIntro")} className="mt-1.5" />
              </div>
              <div>
                <Label>Preferred genre / vibe</Label>
                <Input {...register("djPreferredGenre")} className="mt-1.5" />
              </div>
              <div>
                <Label>No-play restrictions</Label>
                <Textarea {...register("djNoPlayList")} rows={2} className="mt-1.5" />
              </div>
            </div>
          ) : (
            <div className="space-y-4 rounded-xl border border-border bg-card p-6">
              <p className="eyebrow">Performance tech rider</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Number of performers</Label>
                  <Input
                    type="number"
                    min={1}
                    {...register("oaPerformerCount")}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Microphones needed</Label>
                  <Input type="number" min={0} {...register("oaMicCount")} className="mt-1.5" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox {...checkboxProps(register, "oaUsesBackingTracks")} /> Performing with
                backing tracks
              </label>
              <div>
                <Label>Backing track format</Label>
                <Input
                  {...register("oaBackingTrackFormat")}
                  placeholder="Phone / USB / Laptop"
                  className="mt-1.5"
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox {...checkboxProps(register, "oaTravelingDj")} /> Traveling with our own DJ
              </label>
              <div>
                <Label>Input list</Label>
                <Textarea {...register("oaInputList")} rows={2} className="mt-1.5" />
              </div>
              <div>
                <Label>Stage plot notes (if more than one performer)</Label>
                <Textarea {...register("oaStagePlotNotes")} rows={2} className="mt-1.5" />
              </div>
              <div>
                <Label>Special props / playback / dancers</Label>
                <Input {...register("oaSpecialProps")} className="mt-1.5" />
              </div>
              <div>
                <Label>Walk-on cue / intro music</Label>
                <Input {...register("oaWalkOnCue")} className="mt-1.5" />
              </div>
            </div>
          )}

          <div className="space-y-4 rounded-xl border border-border bg-card p-6">
            <p className="eyebrow">Promo</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Instagram</Label>
                <Input {...register("socialInstagram")} placeholder="@handle" className="mt-1.5" />
              </div>
              <div>
                <Label>TikTok</Label>
                <Input {...register("socialTiktok")} placeholder="@handle" className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label>Other social</Label>
              <Input {...register("socialOther")} className="mt-1.5" />
            </div>
            <div>
              <Label>Press photo URL</Label>
              <Input
                {...register("pressPhotoUrl")}
                placeholder="Link to a photo you'd like us to use"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Short bio</Label>
              <Textarea {...register("shortBio")} rows={3} className="mt-1.5" />
            </div>
            <label className="flex items-start gap-2 text-sm">
              <Checkbox {...checkboxProps(register, "promoCommitmentAck")} />
              I'll post about this event and tag TRC Events' pages as requested.
            </label>
          </div>

          <Button type="submit" variant="gold" size="xl" className="w-full" disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : null}
            Submit
          </Button>
        </form>
      )}

      {step === "done" && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-gold/40 bg-gold/10 p-10 text-center">
          <CheckCircle2 className="size-10 text-gold" />
          <h2 className="font-display text-xl font-bold">Submitted</h2>
          <p className="text-sm text-muted-foreground">
            Thanks — your tech rider and promo info have been sent to TRC Events.
          </p>
        </div>
      )}
    </div>
  );
}

// react-hook-form's Controller isn't worth the ceremony for these plain
// boolean checkboxes -- register() gives us onChange/onBlur/name/ref, and
// the shadcn Checkbox forwards standard input props through Radix, so this
// small shim is enough to wire the two together without extra state.
function checkboxProps(
  register: ReturnType<typeof useForm<FormValues>>["register"],
  name: keyof FormValues,
) {
  const { onChange, name: fieldName, ref } = register(name);
  return {
    ref,
    name: fieldName,
    onCheckedChange: (checked: boolean) =>
      onChange({ target: { name: fieldName, type: "checkbox", checked }, type: "change" }),
  };
}
