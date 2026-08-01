// Shared by src/routes/sing-ova-sundays.$city.tsx. The "-" prefix excludes
// this file from route generation (TanStack Router convention) — see
// src/routes/README.md.
//
// Companion site for Marlon TRC's "Sing Ova Sundays" reggae x R&B day party,
// expanding city by city (Chicago confirmed; Milwaukee, Indianapolis,
// St. Louis, and Detroit tentative). Every Sunday's "Cover Story" segment
// pairs an R&B/hip-hop original with the reggae version, sample, or riddim
// that reveals its history. People log in during the week to submit/heart
// pairings, and the resident DJ pulls from the approved queue live Sunday.
//
// City is a dimension on ACTIONS (pairings, hearts), not on the account --
// sos_verifications/sos_members are global by design, so someone who
// verifies once can participate in any city without re-verifying. This
// component is fully data-driven by citySlug: it fetches the matching
// sos_cities row (+ its sos_city_hero_slides) at runtime and renders a
// "Coming Soon" placeholder for any slug that doesn't resolve to a
// `published` city -- adding city #6 next year should never require
// touching this file, only a new sos_cities row (mirrors the existing
// -pitch-page.tsx pattern in this repo: "adding pitch #301 should never
// require touching this file, only a new DB row").
//
// Hero images live in the public `sos-hero-images` Storage bucket (not
// Vite-bundled) for the same reason -- a new city's art shouldn't require a
// rebuild/deploy.
//
// Visual design intentionally matches the official flyer aesthetic: warm
// cream/parchment, deep forest green, and gold -- a different palette from
// the rest of trcevent.com's all-dark theme. SOS_THEME_VARS below overrides
// the design system's CSS custom properties (--background, --card,
// --secondary, etc.) on this page's wrapper only, so every shadcn primitive
// (Button, Input, Card, Badge...) picks up the new palette automatically
// without touching src/styles.css or any other page. Gold text is reserved
// for the large headline and for text sitting on the deep-green plaques
// (like the flyer itself does) rather than small text directly on cream,
// since flat gold on this light cream doesn't have enough contrast to read
// well at small sizes.
//
// Deliberately NOT linked from the Navbar and not in a sitemap yet -- every
// city here is either a pending proposal or (Chicago) a still-unconfirmed
// residency, so this stays reachable by direct URL only. `robots: noindex,
// nofollow` matches that same "not for search engines yet" intent.
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
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SOCIAL_LINKS } from "@/lib/social";
import { WEEK_THEMES } from "@/lib/sing-ova-week-themes";
import { loadSession, saveSession, clearSession } from "@/lib/sing-ova-session";
import { SOS_THEME_VARS, SOS_LABEL_CLASS as LABEL_CLASS } from "@/lib/sing-ova-theme";

const SITE_URL = "https://trcevent.com";
const CONTACT_PHONE = "(414) 301-2457";
const HERO_AUTOPLAY_MS = 7000;

// Overrides the design system's CSS custom properties for this page only —
// see the file header comment for why. Values are hand-picked oklch matches
// for the flyer's cream/forest-green/gold palette -- now shared via
// src/lib/sing-ova-theme.ts so the /sing-ova hub matches exactly.

const DIRECTIONS = [
  { value: "rnb_to_reggae", label: "R&B/Hip-Hop → Reggae" },
  { value: "reggae_to_rnb", label: "Reggae → R&B/Hip-Hop" },
] as const;

export function singOvaSundaysHead() {
  return {
    meta: [
      { title: "Sing Ova Sundays — TRC Events" },
      {
        name: "description",
        content:
          "Sing Ova Sundays: a weekly reggae x R&B day party, city by city. Log in during the week to submit and vote on your favorite R&B-to-reggae song pairings for the DJ to play live on Sunday.",
      },
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

// city.launch_date is a plain 'YYYY-MM-DD' calendar date with no time
// component -- parse it as local, not UTC, or a date like "2026-08-30"
// can render as "August 29" depending on the reader's timezone offset.
function formatLaunchDate(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function prettifySlug(slug) {
  return slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export function SingOvaSundaysPage({ citySlug }) {
  const [city, setCity] = useState(null);
  const [cityLoading, setCityLoading] = useState(true);
  const [heroSlides, setHeroSlides] = useState([]);
  const [heroSelected, setHeroSelected] = useState(0);

  const [session, setSession] = useState(() => loadSession());

  const [emailInput, setEmailInput] = useState("");
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState(null);

  const [pairings, setPairings] = useState([]);
  // Submissions are moderated -- a fresh pairing is `pending` and invisible
  // in the public feed (loadFeed only selects approved/played) until a city
  // admin approves it. Without this, hitting "Submit" feels like it did
  // nothing. Since there's no per-session anon identity for RLS to key a
  // "show me my own pending rows" policy off of, this is a client-only
  // optimistic echo of what was just submitted -- not re-fetched from the
  // server, cleared on city change, and deduped against the real feed once
  // an admin approves it and it shows up there for real.
  const [myPendingSubmissions, setMyPendingSubmissions] = useState([]);
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

  useEffect(() => {
    let cancelled = false;
    async function loadCity() {
      setCityLoading(true);
      setCity(null);
      setHeroSlides([]);
      setHeroSelected(0);
      setMyPendingSubmissions([]);
      // RLS only returns a row here when status = 'published' -- a pending
      // or nonexistent slug both come back empty, indistinguishable from
      // the anon side on purpose (no leaking which cities are in the works).
      const { data: cityRow } = await supabase
        .from("sos_cities")
        .select("*")
        .eq("slug", citySlug)
        .maybeSingle();
      if (cancelled) return;
      setCity(cityRow ?? null);
      if (cityRow) {
        const { data: slides } = await supabase
          .from("sos_city_hero_slides")
          .select("*")
          .eq("city_id", cityRow.id)
          .order("position", { ascending: true });
        if (!cancelled) setHeroSlides(slides ?? []);
      }
      if (!cancelled) setCityLoading(false);
    }
    loadCity();
    return () => {
      cancelled = true;
    };
  }, [citySlug]);

  // A slow crossfade rather than a slide -- since every banner shares the
  // same layout, dissolving between them reads as "the artist photos
  // changed" rather than "a new slide arrived." Kept deliberately gentle: a
  // long hold per slide and a long, eased opacity transition so the change
  // is only obvious to someone actively watching for it.
  useEffect(() => {
    if (heroSlides.length < 2) return;
    const id = setInterval(
      () => setHeroSelected((i) => (i + 1) % heroSlides.length),
      HERO_AUTOPLAY_MS,
    );
    return () => clearInterval(id);
  }, [heroSlides.length]);

  async function loadFeed() {
    if (!city) return;
    setLoadingFeed(true);
    const { data: pairingRows } = await supabase
      .from("sos_pairings")
      .select("*")
      .eq("city_id", city.id)
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
  }, [city?.id, session?.email]);

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
    if (!session || !city) return;
    if (!originalArtist.trim() || !originalTitle.trim() || !reggaeArtist.trim() || !reggaeTitle.trim()) {
      setSubmitMsg({ text: "Fill in both songs before submitting.", ok: false });
      return;
    }
    setSubmittingPairing(true);
    setSubmitMsg(null);
    try {
      const trimmedOriginalArtist = originalArtist.trim();
      const trimmedOriginalTitle = originalTitle.trim();
      const trimmedReggaeArtist = reggaeArtist.trim();
      const trimmedReggaeTitle = reggaeTitle.trim();
      const trimmedNote = note.trim();
      const submittedWeekTheme = weekTheme === "any" ? null : weekTheme;

      const { error } = await supabase.from("sos_pairings").insert({
        city_id: city.id,
        email: session.email,
        display_name: session.displayName,
        original_artist: trimmedOriginalArtist,
        original_title: trimmedOriginalTitle,
        reggae_artist: trimmedReggaeArtist,
        reggae_title: trimmedReggaeTitle,
        direction,
        note: trimmedNote || null,
        week_theme: submittedWeekTheme,
      });
      if (error) {
        setSubmitMsg({
          text: "Your session may have expired -- try logging in again.",
          ok: false,
        });
        return;
      }
      // The real row is `pending` and invisible to the public feed until a
      // city admin approves it (no anon RLS policy can key "my own rows" --
      // there's no per-request identity for the anon role). Echo it locally
      // so the submitter sees proof it was received.
      setMyPendingSubmissions((prev) => [
        {
          id: `local-${crypto.randomUUID()}`,
          email: session.email,
          display_name: session.displayName,
          original_artist: trimmedOriginalArtist,
          original_title: trimmedOriginalTitle,
          reggae_artist: trimmedReggaeArtist,
          reggae_title: trimmedReggaeTitle,
          direction,
          note: trimmedNote || null,
          week_theme: submittedWeekTheme,
          status: "pending",
          created_at: new Date().toISOString(),
          _localOnly: true,
        },
        ...prev,
      ]);
      setOriginalArtist("");
      setOriginalTitle("");
      setReggaeArtist("");
      setReggaeTitle("");
      setNote("");
      setWeekTheme("any");
      setSubmitMsg({
        text: "Pairing submitted! You'll see it marked \"Pending\" below until it's approved.",
        ok: true,
      });
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

  if (cityLoading) {
    return (
      <div
        className="flex min-h-[60vh] items-center justify-center bg-background text-foreground"
        style={SOS_THEME_VARS}
      >
        <Loader2 className="size-6 animate-spin text-secondary" />
      </div>
    );
  }

  if (!city) {
    const prettyName = prettifySlug(citySlug);
    return (
      <div
        className="flex min-h-[60vh] flex-col items-center justify-center gap-3 bg-background px-4 text-center text-foreground"
        style={SOS_THEME_VARS}
      >
        <p className={LABEL_CLASS}>Sing Ova Sundays</p>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Coming Soon to {prettyName}</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          We're working on bringing Sing Ova Sundays to {prettyName}. In the meantime, check out{" "}
          <a href="/sing-ova-sundays/chicago" className="text-secondary underline">
            the Chicago edition
          </a>
          , live now.
        </p>
      </div>
    );
  }

  const launchDateFormatted = formatLaunchDate(city.launch_date);

  // Once a locally-echoed submission shows up for real (admin approved it
  // while the submitter is still on the page), drop the local echo instead
  // of showing it twice.
  const confirmedPending = myPendingSubmissions.filter(
    (local) =>
      !pairings.some(
        (real) =>
          real.email === local.email &&
          real.original_artist === local.original_artist &&
          real.original_title === local.original_title &&
          real.reggae_artist === local.reggae_artist &&
          real.reggae_title === local.reggae_title,
      ),
  );
  const displayPairings = [...confirmedPending, ...pairings];

  const eventSchema = city.launch_date
    ? {
        "@context": "https://schema.org",
        "@type": "Event",
        name: `Sing Ova Sundays — ${city.name}`,
        startDate: `${city.launch_date}T16:00:00`,
        eventSchedule: "Weekly on Sunday",
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        image: heroSlides.map((s) => s.image_url),
        location: {
          "@type": "Place",
          name: city.venue_name,
          address: city.venue_address,
        },
        organizer: {
          "@type": "Organization",
          name: "Marlon TRC",
          url: SITE_URL,
        },
        offers: {
          "@type": "Offer",
          url: `${SITE_URL}/sing-ova-sundays/${city.slug}`,
          priceCurrency: "USD",
          price: "0",
          availability: "https://schema.org/InStock",
          description: "Free admission for the first four Sundays.",
        },
      }
    : null;

  return (
    <div className="bg-background text-foreground" style={SOS_THEME_VARS}>
      {eventSchema && (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
        />
      )}

      {/* Hero */}
      <section className="border-b border-border">
        <h1 className="sr-only">Sing Ova — {city.name}</h1>
        <div className="border-b border-border/60 bg-card px-4 py-2 text-center sm:px-6">
          <a
            href="/sing-ova"
            className={`${LABEL_CLASS} inline-flex items-center gap-1 hover:text-gold`}
          >
            ← Sing Ova · {city.name} Chapter
          </a>
        </div>
        {heroSlides.length > 0 && (
          <div className="relative aspect-[100/39] w-full overflow-hidden">
            {heroSlides.map((slide, i) => (
              <img
                key={slide.id}
                src={slide.image_url}
                alt={slide.alt_text}
                aria-hidden={i !== heroSelected}
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-[3000ms] ease-in-out",
                  i === heroSelected ? "opacity-100" : "opacity-0",
                )}
              />
            ))}

            {heroSlides.length > 1 && (
              <div className="absolute inset-x-0 bottom-3 flex justify-center">
                <div className="flex items-center gap-2 rounded-full bg-black/25 px-3 py-1.5 backdrop-blur-sm">
                  {heroSlides.map((slide, i) => (
                    <button
                      key={slide.id}
                      type="button"
                      aria-label={`Show hero slide ${i + 1}`}
                      aria-current={heroSelected === i}
                      onClick={() => setHeroSelected(i)}
                      className={cn(
                        "size-2 rounded-full transition-colors",
                        heroSelected === i ? "bg-gold" : "bg-white/50 hover:bg-white/80",
                      )}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <div className="mx-auto max-w-5xl px-4 py-10 text-center sm:px-6">
          <div className="flex flex-wrap justify-center gap-3">
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
        {heroSlides[heroSelected]?.pairings?.length > 0 && (
          <section className="rounded-xl border border-border bg-card p-6 text-center">
            <p className={`${LABEL_CLASS} mb-4`}>Featuring the Music Of</p>
            <div className="grid gap-6 sm:grid-cols-3">
              {heroSlides[heroSelected].pairings.map((p) => (
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
        )}

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
                    We'll email you a 6-digit code — no password, no link to click. One login
                    works for every Sing Ova Sundays city.
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

          {!loadingFeed && displayPairings.length === 0 && (
            <p className="mt-8 text-sm text-muted-foreground">
              No approved pairings yet — be the first to submit one above.
            </p>
          )}

          <div className="mt-6 space-y-4">
            {displayPairings.map((p) => {
              const count = heartCounts[p.id] ?? 0;
              const mine = myHearts.has(p.id);
              const directionLabel = DIRECTIONS.find((d) => d.value === p.direction)?.label ?? "";
              return (
                <div
                  key={p.id}
                  className={`rounded-xl border p-5 ${p._localOnly ? "border-dashed border-secondary/60 bg-secondary/5" : "border-border bg-card"}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {directionLabel}
                        {p.week_theme ? ` · ${p.week_theme}` : ""}
                        {p.status === "played" ? " · Played" : ""}
                        {p._localOnly ? " · Pending review — only you can see this" : ""}
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
                    {p._localOnly ? (
                      <span
                        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-dashed border-secondary/60 px-3 py-2 text-sm text-secondary"
                        title="This hasn't been approved yet, so hearting isn't available until it's live for everyone"
                      >
                        <Loader2 className="size-4" /> Pending
                      </span>
                    ) : (
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
                    )}
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
              { icon: MapPin, label: "Address", value: city.venue_address ?? "TBA" },
              { icon: Clock, label: "Time", value: city.hours_label ?? "TBA" },
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

          <div className="mt-8">
            <div className="space-y-4 rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-secondary" />
                <div>
                  <p className="font-semibold">{city.venue_name ?? `${city.name} venue TBA`}</p>
                  {city.venue_address && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(city.venue_address)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-muted-foreground underline decoration-dotted hover:text-secondary"
                    >
                      {city.venue_address}
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 size-5 shrink-0 text-secondary" />
                <p className="text-sm">
                  {launchDateFormatted ? `Every Sunday, starting ${launchDateFormatted}` : "Every Sunday"}
                </p>
              </div>
              {city.hours_label && (
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 size-5 shrink-0 text-secondary" />
                  <p className="text-sm">{city.hours_label}</p>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-secondary" />
                <a
                  href={`tel:${CONTACT_PHONE.replace(/[^\d+]/g, "")}`}
                  className="text-sm text-muted-foreground underline decoration-dotted hover:text-secondary"
                >
                  {CONTACT_PHONE}
                </a>
              </div>
              <p className="text-xs text-muted-foreground">
                Schedule, occupancy, and admission remain subject to venue confirmation.
              </p>
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
