// Shared by src/routes/sing-ova-sundays.tsx. The "-" prefix excludes this
// file from route generation (TanStack Router convention) — see
// src/routes/README.md.
//
// Companion site for Marlon TRC's proposed "Sing Ova Sundays" residency at
// Bar 22 (South Loop, Chicago): every Sunday's "Cover Story" segment pairs
// an R&B/hip-hop original with the reggae version, sample, or riddim that
// reveals its history. This page lets people log in during the week to
// submit and heart their favorite pairings, so the resident DJ has a pool
// of crowd requests to pull from live on Sunday.
//
// Visual design intentionally matches the official flyer
// (src/assets/sing-ova-sundays-flyer.jpg): warm cream/parchment, deep
// forest green, and gold -- a different palette from the rest of
// trcevent.com's all-dark theme. SOS_THEME_VARS below overrides the design
// system's CSS custom properties (--background, --card, --secondary, etc.)
// on this page's wrapper only, so every shadcn primitive (Button, Input,
// Card, Badge...) picks up the new palette automatically without touching
// src/styles.css or any other page. Gold text is reserved for the large
// headline and for text sitting on the deep-green plaques (like the flyer
// itself does) rather than small text directly on cream, since flat gold
// on this light cream doesn't have enough contrast to read well at small
// sizes -- the flyer itself uses dark ink/green for its cream-background
// labels and saves gold for the embossed title and the green plaques.
//
// The event's name on the flyer's logotype stylizes as "Sing Over Sundays"
// (a vinyl record standing in for the "O"), but the real name used in this
// page's copy stays "Sing Ova Sundays" per the source proposal doc --
// that's a deliberate call, not an inconsistency.
//
// Deliberately NOT linked from the Navbar and not in the sitemap yet — the
// Bar 22 partnership is still a pending proposal, so this stays reachable
// by direct URL only until the residency is confirmed. `robots: noindex,
// nofollow` below matches that same "not for search engines yet" intent
// used on other pre-launch/gated pages in this repo.
//
// Login uses the same emailed 6-digit code pattern as the comp/street-team
// pages (never a magic link -- those get silently consumed by mail
// scanners), via request-sos-code / verify-sos-code. The one difference:
// this session is meant to last the whole week, not just one immediate
// submit, so verify-sos-code extends the verified window server-side to 30
// days. The client only remembers { email, displayName } in localStorage as
// a UX shortcut to skip the login form on return visits -- the real gate is
// always the server-side RLS check on sos_pairings / sos_pairing_hearts.
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  Heart,
  Loader2,
  LogOut,
  MapPin,
  CheckCircle2,
  Ticket,
  Phone,
  Globe,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SOCIAL_LINKS } from "@/lib/social";
import heroImg from "@/assets/sing-ova-sundays-hero.jpg";

const SITE_URL = "https://trcevent.com";
const VENUE_NAME = "Bar 22";
const VENUE_ADDRESS = "2244 S Michigan Ave, Chicago, IL 60616";
const CONTACT_PHONE = "(414) 301-2457";
const SESSION_STORAGE_KEY = "sos_session";

// Overrides the design system's CSS custom properties for this page only —
// see the file header comment for why. Values are hand-picked oklch matches
// for the flyer's cream/forest-green/gold palette; --gold/--primary are
// deliberately left untouched so the site's one brand gold stays consistent
// everywhere it's used.
const SOS_THEME_VARS = {
  "--background": "oklch(0.93 0.028 85)",
  "--foreground": "oklch(0.22 0.025 85)",
  "--card": "oklch(0.895 0.03 82)",
  "--card-foreground": "oklch(0.22 0.025 85)",
  "--popover": "oklch(0.895 0.03 82)",
  "--popover-foreground": "oklch(0.22 0.025 85)",
  "--border": "oklch(0.72 0.035 78)",
  "--input": "oklch(0.85 0.03 82)",
  "--muted": "oklch(0.87 0.025 82)",
  "--muted-foreground": "oklch(0.42 0.03 80)",
  "--accent": "oklch(0.2 0.05 155)",
  "--accent-foreground": "oklch(0.93 0.025 85)",
  "--secondary": "oklch(0.19 0.045 155)",
  "--secondary-foreground": "oklch(0.93 0.02 85)",
  "--ring": "oklch(0.5 0.11 80)",
};

const EMBOSS_SHADOW = "[text-shadow:0_1px_1px_rgba(20,15,5,0.35),0_0_18px_rgba(201,168,76,0.25)]";
const LABEL_CLASS = "text-xs font-semibold uppercase tracking-wide text-secondary";

const FEATURED_PAIRINGS = [
  { rnb: "Anita Baker", reggae: "Beres Hammond", genres: "Quiet Storm × Lovers Rock" },
  { rnb: "Sade", reggae: "Maxi Priest", genres: "Smooth Soul × Reggae Fusion" },
  { rnb: "Mary J. Blige", reggae: "Buju Banton", genres: "Hip-Hop Soul × Reggae/Dancehall" },
];

const WEEK_THEMES = [
  { week: 1, theme: "Lovers Rock vs. Slow Jams", promise: "Reggae lovers rock paired with R&B slow jams." },
  { week: 2, theme: "Riddim Rewind", promise: "One riddim traced across eras, artists, and genres." },
  { week: 3, theme: "Dancehall x Hip-Hop", promise: "Dancehall anthems beside the hip-hop records they influenced." },
  { week: 4, theme: "Roots & Culture", promise: "Message-driven reggae with a deeper cultural frame." },
  { week: 5, theme: "Unexpected Voices", promise: "White/Latino paired with dancehall/reggae crossover." },
  { week: 6, theme: "Throwback Sunday", promise: "60s/70s R&B, reggae, and dancehall side by side." },
  { week: 7, theme: "Queens of the Riddim", promise: "Women artists across R&B, reggae, and dancehall." },
  { week: 8, theme: "Wildcard / Request Sunday", promise: "Crowd pairings, resident picks, and a guest selector." },
] as const;

const DIRECTIONS = [
  { value: "rnb_to_reggae", label: "R&B/Hip-Hop → Reggae" },
  { value: "reggae_to_rnb", label: "Reggae → R&B/Hip-Hop" },
] as const;

export function singOvaSundaysHead() {
  const imageUrl = `${SITE_URL}${heroImg}`;
  return {
    meta: [
      { title: "Sing Ova Sundays — TRC Events" },
      {
        name: "description",
        content:
          "Sing Ova Sundays: one riddim, two worlds, endless classics. A weekly reggae x R&B day party at Bar 22, South Loop Chicago, starting Sunday, August 30, 2026, 4-9 PM. Log in during the week to submit and vote on your favorite R&B-to-reggae song pairings for the DJ to play live on Sunday. Free admission the first four Sundays.",
      },
      { property: "og:title", content: "Sing Ova Sundays — TRC Events" },
      {
        property: "og:description",
        content: "One Riddim. Two Worlds. Endless Classics. Starting Sunday, Aug 30, 2026 — every Sunday, 4-9 PM — Bar 22, South Loop Chicago.",
      },
      { property: "og:type", content: "article" },
      { property: "og:image", content: imageUrl },
      { property: "og:url", content: `${SITE_URL}/sing-ova-sundays` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Sing Ova Sundays — TRC Events" },
      { name: "twitter:image", content: imageUrl },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/sing-ova-sundays` }],
  };
}

// supabase.functions.invoke() routes a non-2xx response into `error` rather
// than `data`, even when the function's JSON body has a perfectly good
// `.error` message. Without this, a non-2xx failure shows a generic
// fallback instead of the real reason.
async function extractFunctionErrorMessage(error) {
  if (!error || typeof error !== "object") return null;
  const context = error.context;
  if (context && typeof context.json === "function") {
    try {
      const body = await context.json();
      if (body && typeof body.error === "string") return body.error;
    } catch {
      // context body wasn't JSON -- fall through to error.message
    }
  }
  return typeof error.message === "string" ? error.message : null;
}

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.email && parsed?.displayName) return parsed;
    return null;
  } catch {
    return null;
  }
}

function saveSession(session) {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

export function SingOvaSundaysPage() {
  const [session, setSession] = useState(() => loadSession());

  const [emailInput, setEmailInput] = useState("");
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState(null);

  const [pairings, setPairings] = useState([]);
  const [heartCounts, setHeartCounts] = useState({});
  const [myHearts, setMyHearts] = useState(new Set());
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [heartBusyId, setHeartBusyId] = useState(null);

  const [originalArtist, setOriginalArtist] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [reggaeArtist, setReggaeArtist] = useState("");
  const [reggaeTitle, setReggaeTitle] = useState("");
  const [direction, setDirection] = useState("rnb_to_reggae");
  const [note, setNote] = useState("");
  const [weekTheme, setWeekTheme] = useState("any");
  const [submittingPairing, setSubmittingPairing] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);

  async function loadFeed() {
    setLoadingFeed(true);
    const { data: pairingRows } = await supabase
      .from("sos_pairings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    const rows = pairingRows ?? [];
    setPairings(rows);

    if (rows.length > 0) {
      const ids = rows.map((r) => r.id);
      const { data: heartRows } = await supabase
        .from("sos_pairing_hearts")
        .select("pairing_id, email")
        .in("pairing_id", ids);
      const counts = {};
      const mine = new Set();
      for (const h of heartRows ?? []) {
        counts[h.pairing_id] = (counts[h.pairing_id] ?? 0) + 1;
        if (session && h.email.toLowerCase() === session.email.toLowerCase()) {
          mine.add(h.pairing_id);
        }
      }
      setHeartCounts(counts);
      setMyHearts(mine);
    } else {
      setHeartCounts({});
      setMyHearts(new Set());
    }
    setLoadingFeed(false);
  }

  useEffect(() => {
    loadFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.email]);

  async function handleSendCode() {
    const trimmedEmail = emailInput.trim();
    if (!trimmedEmail || !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setVerifyMsg({ text: "Enter a valid email first.", ok: false });
      return;
    }
    if (!displayNameInput.trim()) {
      setVerifyMsg({ text: "Enter a display name -- it'll show next to your pairings.", ok: false });
      return;
    }
    setSendingCode(true);
    setVerifyMsg(null);
    try {
      const { data, error } = await supabase.functions.invoke("request-sos-code", {
        body: { email: trimmedEmail },
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

  async function callVerifyCode(trimmedEmail, trimmedCode, trimmedName) {
    const { data, error } = await supabase.functions.invoke("verify-sos-code", {
      body: { email: trimmedEmail, code: trimmedCode, displayName: trimmedName },
    });
    if (data?.valid) return { valid: true };
    const message = data?.error ?? (error ? await extractFunctionErrorMessage(error) : null);
    return { valid: false, message };
  }

  async function handleConfirmCode() {
    const trimmedEmail = emailInput.trim();
    const trimmedCode = code.trim();
    const trimmedName = displayNameInput.trim();
    if (!trimmedCode) {
      setVerifyMsg({ text: "Enter the code from your email.", ok: false });
      return;
    }
    setVerifyingCode(true);
    try {
      let result = await callVerifyCode(trimmedEmail, trimmedCode, trimmedName);
      // A failure with no specific reason usually means a transient hiccup
      // rather than an actually-wrong code -- one silent retry smooths that
      // over, same as the comp page's verify flow.
      if (!result.valid && !result.message) {
        result = await callVerifyCode(trimmedEmail, trimmedCode, trimmedName);
      }
      if (result.valid) {
        const newSession = { email: trimmedEmail.toLowerCase(), displayName: trimmedName };
        saveSession(newSession);
        setSession(newSession);
        setCodeSent(false);
        setCode("");
        setVerifyMsg(null);
        return;
      }
      setVerifyMsg({
        text: result.message ? result.message : "That code didn't work. Try again.",
        ok: false,
      });
    } catch {
      setVerifyMsg({ text: "Something went wrong checking that code. Try again.", ok: false });
    } finally {
      setVerifyingCode(false);
    }
  }

  function handleLogOut() {
    clearSession();
    setSession(null);
    setEmailInput("");
    setDisplayNameInput("");
    setCodeSent(false);
    setCode("");
    setVerifyMsg(null);
  }

  async function handleSubmitPairing(e) {
    e.preventDefault();
    if (!session) return;
    if (!originalArtist.trim() || !originalTitle.trim() || !reggaeArtist.trim() || !reggaeTitle.trim()) {
      setSubmitMsg({ text: "Fill in both songs before submitting.", ok: false });
      return;
    }
    setSubmittingPairing(true);
    setSubmitMsg(null);
    try {
      const { error } = await supabase.from("sos_pairings").insert({
        email: session.email,
        display_name: session.displayName,
        original_artist: originalArtist.trim(),
        original_title: originalTitle.trim(),
        reggae_artist: reggaeArtist.trim(),
        reggae_title: reggaeTitle.trim(),
        direction,
        note: note.trim() || null,
        week_theme: weekTheme === "any" ? null : weekTheme,
      });
      if (error) {
        setSubmitMsg({
          text: "Your session may have expired -- try logging in again.",
          ok: false,
        });
        return;
      }
      setOriginalArtist("");
      setOriginalTitle("");
      setReggaeArtist("");
      setReggaeTitle("");
      setNote("");
      setWeekTheme("any");
      setSubmitMsg({ text: "Pairing submitted!", ok: true });
      await loadFeed();
    } finally {
      setSubmittingPairing(false);
    }
  }

  async function handleToggleHeart(pairingId) {
    if (!session) return;
    setHeartBusyId(pairingId);
    try {
      if (myHearts.has(pairingId)) {
        await supabase
          .from("sos_pairing_hearts")
          .delete()
          .eq("pairing_id", pairingId)
          .eq("email", session.email);
      } else {
        await supabase
          .from("sos_pairing_hearts")
          .insert({ pairing_id: pairingId, email: session.email });
      }
      await loadFeed();
    } finally {
      setHeartBusyId(null);
    }
  }

  const mapsSrc = `https://www.google.com/maps?q=${encodeURIComponent(VENUE_ADDRESS)}&output=embed`;

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Sing Ova Sundays",
    startDate: "2026-08-30T16:00:00-05:00",
    eventSchedule: "Weekly on Sunday",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: [`${SITE_URL}${heroImg}`],
    location: {
      "@type": "Place",
      name: VENUE_NAME,
      address: VENUE_ADDRESS,
    },
    organizer: {
      "@type": "Organization",
      name: "Marlon TRC",
      url: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/sing-ova-sundays`,
      priceCurrency: "USD",
      price: "0",
      availability: "https://schema.org/InStock",
      description: "Free admission for the first four Sundays.",
    },
  };

  return (
    <div className="bg-background text-foreground" style={SOS_THEME_VARS}>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />

      {/* Hero */}
      <section className="border-b border-border">
        <img
          src={heroImg}
          alt="Sing Ova Sundays featured pairings: Anita Baker × Beres Hammond (Quiet Storm × Lovers Rock), Sade × Maxi Priest (Smooth Soul × Reggae Fusion), and Mary J. Blige × Buju Banton (Hip-Hop Soul × Reggae/Dancehall)"
          className="w-full object-cover"
        />
        <div className="mx-auto max-w-5xl px-4 py-10 text-center sm:px-6">
          <p className={`${LABEL_CLASS} mb-2`}>Marlon TRC · The Reggae Connection Presents</p>
          <h1
            className={`font-display text-4xl font-extrabold tracking-tight text-gold sm:text-5xl ${EMBOSS_SHADOW}`}
          >
            Sing Ova Sundays
          </h1>
          <p className="mt-2 font-display text-lg italic text-secondary sm:text-xl">
            A Weekly Reggae &amp; R&amp;B Day Party
          </p>

          <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4 text-secondary" /> Starting Sun, Aug 30, 2026
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 text-secondary" /> {VENUE_NAME}, South Loop
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Ticket className="size-4 text-secondary" /> Free — First 4 Sundays
            </span>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild variant="gold" size="xl">
              <a href="#pairings">See This Week's Pairings</a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="xl"
              className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
            >
              <a href="#login">Submit Your Pairing</a>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-20 px-4 py-16 sm:px-6">
        {/* Featuring the music of */}
        <section className="rounded-xl border border-border bg-card p-6 text-center">
          <p className={`${LABEL_CLASS} mb-4`}>Featuring the Music Of</p>
          <div className="grid gap-6 sm:grid-cols-3">
            {FEATURED_PAIRINGS.map((p) => (
              <div key={p.rnb} className="rounded-lg border border-border/60 p-4">
                <p className="font-display text-lg font-semibold sm:text-xl">
                  {p.rnb} <span className="text-secondary">×</span> {p.reggae}
                </p>
                <p className="mt-1 text-xs italic text-muted-foreground">{p.genres}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm text-muted-foreground">...and many more R&B &amp; reggae legends</p>
          <p className="mx-auto mt-5 max-w-md text-xs italic text-muted-foreground">
            Featured music only — artists will not appear live at this event.
          </p>
        </section>

        {/* Cover Story blurb */}
        <section className="text-center">
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Every hit has a history — heard ova. Each Sunday's "Cover Story" segment pairs the
            R&B or hip-hop record you know with the reggae version, sample, or riddim that reveals
            where it came from.
          </p>
          <p className="mt-3 text-xs uppercase tracking-widest text-secondary">
            Classic Vibes · Timeless Music · Elegant People
          </p>
        </section>

        {/* Eight-week themes */}
        <section>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Eight-Week Theme Rotation</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            The Cover Story format never changes — only the pairings do. Week 8 hands the mic to
            the crowd.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {WEEK_THEMES.map((w) => (
              <div
                key={w.week}
                className={`rounded-xl border p-5 ${
                  w.week === 8 ? "border-2 border-gold bg-gold/10" : "border-border bg-card"
                }`}
              >
                <p className={LABEL_CLASS}>Week {w.week}</p>
                <p className="mt-1 font-display text-lg font-semibold">{w.theme}</p>
                <p className="mt-1 text-sm text-muted-foreground">{w.promise}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Login / submit */}
        <section id="login" className="scroll-mt-20">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Submit Your Pairing</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Log in during the week to post your favorite R&B ↔ reggae pairing and heart the ones
            you want to hear. Come back Sunday to hear the DJ rip it.
          </p>

          <div className="mt-6 rounded-xl border border-border bg-card p-6">
            {!session && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sos-name">Display name</Label>
                  <Input
                    id="sos-name"
                    placeholder="What should we call you in the feed?"
                    value={displayNameInput}
                    onChange={(e) => setDisplayNameInput(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sos-email">Email address</Label>
                  <Input
                    id="sos-email"
                    type="email"
                    placeholder="you@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll email you a 6-digit code — no password, no link to click.
                  </p>
                </div>

                <div className="space-y-3 rounded-lg border border-border p-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                    onClick={handleSendCode}
                    disabled={sendingCode}
                  >
                    {sendingCode ? <Loader2 className="size-4 animate-spin" /> : null}
                    {codeSent ? "Resend code" : "Send login code"}
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
                        Log In
                      </Button>
                    </div>
                  )}
                  {verifyMsg && (
                    <p className={`text-xs ${verifyMsg.ok ? "text-secondary" : "text-destructive"}`}>
                      {verifyMsg.text}
                    </p>
                  )}
                </div>
              </div>
            )}

            {session && (
              <>
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-1.5 text-sm text-secondary">
                    <CheckCircle2 className="size-4" /> Logged in as {session.displayName}
                  </p>
                  <button
                    type="button"
                    onClick={handleLogOut}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-secondary"
                  >
                    <LogOut className="size-3.5" /> Log out
                  </button>
                </div>

                <form onSubmit={handleSubmitPairing} className="mt-6 space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sos-og-artist">R&B / Hip-Hop artist *</Label>
                      <Input
                        id="sos-og-artist"
                        value={originalArtist}
                        onChange={(e) => setOriginalArtist(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sos-og-title">R&B / Hip-Hop song *</Label>
                      <Input
                        id="sos-og-title"
                        value={originalTitle}
                        onChange={(e) => setOriginalTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sos-reggae-artist">Reggae artist *</Label>
                      <Input
                        id="sos-reggae-artist"
                        value={reggaeArtist}
                        onChange={(e) => setReggaeArtist(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sos-reggae-title">Reggae song *</Label>
                      <Input
                        id="sos-reggae-title"
                        value={reggaeTitle}
                        onChange={(e) => setReggaeTitle(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Which way's the cover?</Label>
                    <ToggleGroup
                      type="single"
                      variant="outline"
                      className="grid grid-cols-2"
                      value={direction}
                      onValueChange={(v) => v && setDirection(v)}
                    >
                      {DIRECTIONS.map((d) => (
                        <ToggleGroupItem
                          key={d.value}
                          value={d.value}
                          className="data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground"
                        >
                          {d.label}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sos-week">Tag it to a week (optional)</Label>
                    <Select value={weekTheme} onValueChange={setWeekTheme}>
                      <SelectTrigger id="sos-week" className="w-full">
                        <SelectValue placeholder="Any week" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any week</SelectItem>
                        {WEEK_THEMES.map((w) => (
                          <SelectItem key={w.week} value={w.theme}>
                            Week {w.week} — {w.theme}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sos-note">Why this pairing? (optional)</Label>
                    <Textarea
                      id="sos-note"
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Tell the room what makes it work..."
                    />
                  </div>

                  {submitMsg && (
                    <p className={`text-sm ${submitMsg.ok ? "text-secondary" : "text-destructive"}`}>
                      {submitMsg.text}
                    </p>
                  )}

                  <Button type="submit" variant="gold" size="xl" className="w-full" disabled={submittingPairing}>
                    {submittingPairing ? <Loader2 className="size-4 animate-spin" /> : null}
                    Submit Pairing
                  </Button>
                </form>
              </>
            )}
          </div>
        </section>

        {/* Community feed */}
        <section id="pairings" className="scroll-mt-20">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">This Week's Pairings</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Everything the room's talking about — heart the ones you want to hear Sunday.
          </p>

          {loadingFeed && (
            <div className="mt-8 flex justify-center">
              <Loader2 className="size-6 animate-spin text-secondary" />
            </div>
          )}

          {!loadingFeed && pairings.length === 0 && (
            <p className="mt-8 text-sm text-muted-foreground">
              No pairings submitted yet — be the first to drop one above.
            </p>
          )}

          <div className="mt-6 space-y-4">
            {pairings.map((p) => {
              const count = heartCounts[p.id] ?? 0;
              const mine = myHearts.has(p.id);
              const directionLabel = DIRECTIONS.find((d) => d.value === p.direction)?.label ?? "";
              return (
                <div key={p.id} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {directionLabel}
                        {p.week_theme ? ` · ${p.week_theme}` : ""}
                      </p>
                      <p className="mt-1 font-display text-lg font-semibold">
                        {p.original_artist} — "{p.original_title}"
                        <span className="mx-2 text-secondary">→</span>
                        {p.reggae_artist} — "{p.reggae_title}"
                      </p>
                      {p.note && (
                        <p className="mt-2 text-sm text-muted-foreground">{p.note}</p>
                      )}
                      <p className="mt-2 text-xs text-muted-foreground">— {p.display_name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleHeart(p.id)}
                      disabled={!session || heartBusyId === p.id}
                      className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors ${
                        mine
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-border text-muted-foreground hover:border-secondary hover:text-secondary"
                      } ${!session ? "cursor-not-allowed opacity-50" : ""}`}
                      title={session ? "Heart this pairing" : "Log in to heart pairings"}
                    >
                      {heartBusyId === p.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Heart className={`size-4 ${mine ? "fill-gold" : ""}`} />
                      )}
                      {count}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Venue */}
        <section id="venue" className="scroll-mt-20">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Venue &amp; Details</h2>

          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            {[
              { icon: MapPin, label: "Address", value: "2244 S Michigan Ave, Chicago, IL" },
              { icon: Clock, label: "Time", value: "4 PM – 9 PM" },
              { icon: Ticket, label: "Admission", value: "Free · First 4 Sundays" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-secondary">
                  <Icon className="size-6 text-gold" />
                </div>
                <p className={`${LABEL_CLASS} mt-2`}>{label}</p>
                <p className="text-sm">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div className="space-y-4 rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-secondary" />
                <div>
                  <p className="font-semibold">{VENUE_NAME}</p>
                  <p className="text-sm text-muted-foreground">{VENUE_ADDRESS}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 size-5 shrink-0 text-secondary" />
                <p className="text-sm">Every Sunday, starting August 30, 2026</p>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-secondary" />
                <p className="text-sm">4:00 PM – 9:00 PM</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Proposed eight-week pilot — final schedule, occupancy, and admission remain
                subject to Bar 22 confirmation.
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-border">
              <iframe
                className="aspect-square w-full sm:aspect-video"
                src={mapsSrc}
                title={`Map of ${VENUE_NAME}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Closing bar */}
      <section className="bg-secondary py-10 text-secondary-foreground">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="font-display text-xl font-semibold sm:text-2xl">
            One Riddim. Two Worlds. <span className="text-gold">Endless Classics.</span>
          </p>
          <div className="mx-auto mt-6 flex max-w-md flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm">
            <a
              href={`tel:${CONTACT_PHONE.replace(/[^\d+]/g, "")}`}
              className="inline-flex items-center gap-1.5 hover:text-gold"
            >
              <Phone className="size-4 text-gold" /> {CONTACT_PHONE}
            </a>
            <a href={SITE_URL} className="inline-flex items-center gap-1.5 hover:text-gold">
              <Globe className="size-4 text-gold" /> trcevent.com
            </a>
          </div>
          <div className="mx-auto mt-4 flex max-w-xs justify-center gap-4 text-sm">
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noreferrer" className="hover:text-gold">
              Instagram
            </a>
            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noreferrer" className="hover:text-gold">
              Facebook
            </a>
            <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noreferrer" className="hover:text-gold">
              TikTok
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
