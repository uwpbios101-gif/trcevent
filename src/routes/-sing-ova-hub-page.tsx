// Shared by src/routes/sing-ova.tsx. The "-" prefix excludes this file from
// route generation (TanStack Router convention) — see src/routes/README.md.
//
// The "Sing Ova" hub: one global home for the brand, sitting above every
// city chapter (/sing-ova-sundays/$city). The account layer was already
// global by design (one verified email works in any city), but until this
// page existed there was no single place that felt like "the movement"
// rather than five unrelated event pages. This page is that place:
//
// - The brand story and the shared 8-week Cover Story format (identical
//   across every chapter, imported from src/lib/sing-ova-week-themes.ts).
// - A directory of every chapter, published or still pending -- reads from
//   sos_cities_public (a view exposing just {id, slug, name, status} for
//   ALL rows regardless of status, unlike the base sos_cities table whose
//   RLS only lets anon see `published` rows). Announcing "we're coming to
//   Milwaukee" is fine; a real address/date for an unconfirmed venue isn't,
//   which is why the view deliberately omits those columns.
// - A cross-city trending feed: the most-hearted approved/played pairings
//   from ANY chapter, each tagged with which city it's from. This also
//   solves the "brand-new chapter's feed looks empty" problem -- Milwaukee
//   visitors see Chicago's activity here before Milwaukee has its own.
// - The same email+code join flow as every chapter page, using the shared
//   session helpers in src/lib/sing-ova-session.ts so joining here or on a
//   city page is the same account either way.
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Heart, Loader2, LogOut, MapPin, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SOCIAL_LINKS } from "@/lib/social";
import { WEEK_THEMES } from "@/lib/sing-ova-week-themes";
import { loadSession, saveSession, clearSession } from "@/lib/sing-ova-session";
import { SOS_THEME_VARS, SOS_LABEL_CLASS as LABEL_CLASS } from "@/lib/sing-ova-theme";

const SITE_URL = "https://trcevent.com";

export function singOvaHubHead() {
  return {
    meta: [
      { title: "Sing Ova — TRC Events" },
      {
        name: "description",
        content:
          "Sing Ova: one riddim, two worlds, endless classics. Join the community debating R&B-to-reggae pairings, then find your city's Sunday.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/sing-ova` }],
  };
}

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

// Two invented hosts (not real people -- same reasoning as the AI-generated
// artist-representation hero art, just original characters instead), voiced
// live via the browser's Web Speech API rather than pre-rendered audio.
// Free and requires no backend, at the cost of voice quality/availability
// varying by the visitor's browser and OS -- a deliberate tradeoff, not an
// oversight. HOST_INFO.avatar is a placeholder monogram until real host
// portraits exist; swapping in an <img> there later is a one-line change.
const HOST_INFO = {
  marcus: { name: "Marcus", role: "Selector" },
  nadine: { name: "Nadine", role: "Host" },
};

// A scripted duet, not two monologues -- the back-and-forth is what makes
// it read as a real conversation rather than narration split across two
// voices. The user's only real "input" is which branch to hear next; both
// branches converge on the same wrap-up either way.
const HOSTS_SCRIPT = {
  coldOpen: [
    { speaker: "marcus", text: "Every Sunday, somebody in that room hears their pick get played." },
    { speaker: "nadine", text: "And by the time the needle drops, they've already been arguing about it all week." },
    { speaker: "marcus", text: "That's the whole idea. One riddim—" },
    { speaker: "nadine", text: "—two worlds—" },
    { speaker: "marcus", text: "—and a room full of people who showed up because of a song, not because of an app." },
    { speaker: "nadine", text: "So — which side do you want first? The conversation, or the Sunday?" },
  ],
  branches: {
    conversation: [
      {
        speaker: "nadine",
        text: "Here's how it actually works. You hear a song — say, Anita Baker — and somewhere in the back of your head you know there's a reggae version that hits just as hard.",
      },
      { speaker: "marcus", text: "So you say so. Right there in the feed. Beres Hammond, you said?" },
      {
        speaker: "nadine",
        text: "And somebody else jumps in — maybe they've never even heard the original, only the cover.",
      },
      {
        speaker: "marcus",
        text: "That's the whole debate. Which one came first, which one hits harder, why the reggae version changes the whole feeling of the song.",
      },
      {
        speaker: "nadine",
        text: "It's not a suggestion box. It's a conversation that's been going on all week before you ever walk in the door.",
      },
    ],
    sunday: [
      {
        speaker: "marcus",
        text: "Four o'clock, the room's still easy — lovers rock, slow jams, people getting settled.",
      },
      { speaker: "nadine", text: "By six it's turned all the way over. Dancehall next to hip-hop, everybody on the floor." },
      {
        speaker: "marcus",
        text: "And somewhere in there, the DJ pulls up a pairing straight from the feed — somebody's pick, live, in front of the room.",
      },
      { speaker: "nadine", text: "That's the moment the whole week of arguing was for." },
      { speaker: "marcus", text: "Out by nine. No 2 a.m. energy required." },
    ],
  },
  wrap: [
    { speaker: "nadine", text: "So — one login. Every city." },
    { speaker: "marcus", text: "Start the conversation whenever. Show up whenever your city's ready." },
    { speaker: "nadine", text: "This is Sing Ova." },
    { speaker: "marcus", text: "Every hit has a history." },
    { speaker: "nadine", text: "Go on and hear it sung ova." },
  ],
};

function HostsConversation() {
  const [phase, setPhase] = useState("idle"); // idle | playing | choice | done
  const [currentLine, setCurrentLine] = useState(null);
  const [muted, setMuted] = useState(false);
  const [voices, setVoices] = useState({ male: null, female: null });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(true);
  const cancelledRef = useRef(false);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  useEffect(() => {
    setTtsSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    if (typeof window !== "undefined" && window.matchMedia) {
      setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    function pickVoices() {
      const all = window.speechSynthesis.getVoices();
      if (!all.length) return;
      const isFemale = (v) => /female|zira|samantha|victoria|susan|karen|moira|tessa|fiona|aria/i.test(v.name);
      const isMale = (v) => /male|david|daniel|alex|fred|george|mark|guy/i.test(v.name);
      const english = all.filter((v) => v.lang.startsWith("en"));
      const pool = english.length ? english : all;
      const female = pool.find(isFemale) ?? pool[0];
      const male = pool.find((v) => isMale(v) && v !== female) ?? pool.find((v) => v !== female) ?? pool[0];
      setVoices({ male, female });
    }
    pickVoices();
    window.speechSynthesis.addEventListener("voiceschanged", pickVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", pickVoices);
  }, []);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
  }, []);

  function speakLine(line, onDone) {
    setCurrentLine(line);
    if (!ttsSupported) {
      // No TTS support -- advance on a timer so captions still tell the story.
      const t = setTimeout(() => !cancelledRef.current && onDone(), 2400);
      return () => clearTimeout(t);
    }
    const utter = new SpeechSynthesisUtterance(line.text);
    const voice = line.speaker === "marcus" ? voices.male : voices.female;
    if (voice) utter.voice = voice;
    utter.pitch = line.speaker === "marcus" ? 0.9 : 1.08;
    utter.rate = 0.98;
    // Mute only affects lines spoken from here on -- an in-flight utterance
    // can't have its volume changed mid-speech, so toggling mute during a
    // line lets that one line finish rather than cutting off mid-word.
    utter.volume = mutedRef.current ? 0 : 1;
    utter.onend = () => !cancelledRef.current && onDone();
    utter.onerror = () => !cancelledRef.current && onDone();
    window.speechSynthesis.speak(utter);
  }

  function playSequence(lines, onComplete) {
    let i = 0;
    function next() {
      if (cancelledRef.current) return;
      if (i >= lines.length) {
        onComplete();
        return;
      }
      const line = lines[i];
      i += 1;
      speakLine(line, next);
    }
    next();
  }

  function handleStart() {
    cancelledRef.current = false;
    setPhase("playing");
    playSequence(HOSTS_SCRIPT.coldOpen, () => setPhase("choice"));
  }

  function handleChoice(branch) {
    setPhase("playing");
    playSequence(HOSTS_SCRIPT.branches[branch], () => {
      playSequence(HOSTS_SCRIPT.wrap, () => setPhase("done"));
    });
  }

  function handleReplay() {
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    setCurrentLine(null);
    handleStart();
  }

  const speaking = phase === "playing";

  return (
    <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center justify-center gap-8 sm:gap-12">
        {["marcus", "nadine"].map((key) => {
          const active = currentLine?.speaker === key;
          return (
            <div key={key} className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex size-16 items-center justify-center rounded-full border-2 bg-secondary font-display text-xl font-bold text-gold transition-all sm:size-20",
                  active && speaking ? "border-gold scale-105" : "border-border",
                )}
              >
                {HOST_INFO[key].name[0]}
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {HOST_INFO[key].name}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mx-auto mt-6 flex min-h-[4.5rem] max-w-xl items-center justify-center text-center">
        {currentLine ? (
          <p className="font-display text-lg italic sm:text-xl">
            <span className="not-italic text-gold">{HOST_INFO[currentLine.speaker].name}:</span> "
            {currentLine.text}"
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Press play to hear Marcus and Nadine talk through what Sing Ova actually is.
          </p>
        )}
      </div>

      {!reducedMotion && speaking && (
        <div className="mt-4 flex justify-center gap-1" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="w-1 animate-pulse rounded-full bg-gold"
              style={{ height: `${8 + (i % 3) * 6}px`, animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {phase === "idle" && (
          <Button variant="gold" size="lg" onClick={handleStart}>
            <Play className="size-4" /> Start the Conversation
          </Button>
        )}
        {phase === "choice" && (
          <>
            <Button variant="gold" onClick={() => handleChoice("conversation")}>
              Show me the conversation
            </Button>
            <Button
              variant="outline"
              className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
              onClick={() => handleChoice("sunday")}
            >
              Show me the Sunday
            </Button>
          </>
        )}
        {phase !== "idle" && (
          <>
            <Button variant="outline" size="sm" onClick={handleReplay} disabled={speaking}>
              <RotateCcw className="size-4" /> Replay
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setMuted((m) => !m)}>
              {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              {muted ? "Unmute" : "Mute"}
            </Button>
          </>
        )}
      </div>

      {!ttsSupported && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Your browser doesn't support voice narration — captions will play on their own.
        </p>
      )}
    </div>
  );
}

export function SingOvaHubPage() {
  const [session, setSession] = useState(() => loadSession());

  const [emailInput, setEmailInput] = useState("");
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState(null);

  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(true);

  const [trending, setTrending] = useState([]);
  const [heartCounts, setHeartCounts] = useState({});
  const [myHearts, setMyHearts] = useState(new Set());
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [heartBusyId, setHeartBusyId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadCities() {
      setCitiesLoading(true);
      const { data } = await supabase
        .from("sos_cities_public")
        .select("*")
        .order("status", { ascending: true }) // 'pending' < 'published' alphabetically -- reorder below
        .order("name", { ascending: true });
      if (!cancelled) {
        const rows = data ?? [];
        // Published chapters first, then pending ones, each alphabetical.
        rows.sort((a, b) => {
          if (a.status !== b.status) return a.status === "published" ? -1 : 1;
          return a.name.localeCompare(b.name);
        });
        setCities(rows);
        setCitiesLoading(false);
      }
    }
    loadCities();
    return () => {
      cancelled = true;
    };
  }, []);

  async function loadTrending() {
    setLoadingTrending(true);
    const { data: pairingRows } = await supabase
      .from("sos_pairings")
      .select("*, sos_cities(name, slug)")
      .in("status", ["approved", "played"])
      .order("created_at", { ascending: false })
      .limit(200);
    const rows = pairingRows ?? [];

    if (rows.length === 0) {
      setTrending([]);
      setHeartCounts({});
      setMyHearts(new Set());
      setLoadingTrending(false);
      return;
    }

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
    const ranked = [...rows].sort((a, b) => (counts[b.id] ?? 0) - (counts[a.id] ?? 0));
    setTrending(ranked.slice(0, 8));
    setHeartCounts(counts);
    setMyHearts(mine);
    setLoadingTrending(false);
  }

  useEffect(() => {
    loadTrending();
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
      await loadTrending();
    } finally {
      setHeartBusyId(null);
    }
  }

  return (
    <div className="bg-background text-foreground" style={SOS_THEME_VARS}>
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6">
          <p className={`${LABEL_CLASS} mb-2`}>Marlon TRC · The Reggae Connection</p>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-gold sm:text-5xl">
            Sing Ova
          </h1>
          <p className="mt-2 font-display text-lg italic text-secondary sm:text-xl">
            One Riddim. Two Worlds. Endless Classics.
          </p>
          <HostsConversation />
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-20 px-4 py-16 sm:px-6">
        {/* Chapters */}
        <section>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Chapters</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            One community, one city at a time. Live chapters have a Sunday and a venue; the rest are
            building their local conversation before one is confirmed.
          </p>

          {citiesLoading && (
            <div className="mt-8 flex justify-center">
              <Loader2 className="size-6 animate-spin text-secondary" />
            </div>
          )}

          {!citiesLoading && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {cities.map((c) => {
                const isLive = c.status === "published";
                return (
                  <a
                    key={c.id}
                    href={`/sing-ova-sundays/${c.slug}`}
                    className={cn(
                      "flex items-center justify-between rounded-xl border p-5 transition-colors",
                      isLive
                        ? "border-gold/50 bg-gold/10 hover:border-gold"
                        : "border-border bg-card hover:border-secondary",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className={cn("size-5", isLive ? "text-gold" : "text-secondary")} />
                      <div>
                        <p className="font-display text-lg font-semibold">{c.name}</p>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          {isLive ? "Live chapter" : "Coming soon"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                        isLive ? "bg-gold text-gold-foreground" : "border border-secondary/50 text-secondary",
                      )}
                    >
                      <span className={cn("size-1.5 rounded-full", isLive ? "bg-gold-foreground" : "bg-secondary")} />
                      {isLive ? "Live" : "Soon"}
                    </span>
                  </a>
                );
              })}
            </div>
          )}
        </section>

        {/* Trending across chapters */}
        <section>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Trending Across Every Chapter</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            The most-hearted pairings from any city right now.
          </p>

          {loadingTrending && (
            <div className="mt-8 flex justify-center">
              <Loader2 className="size-6 animate-spin text-secondary" />
            </div>
          )}

          {!loadingTrending && trending.length === 0 && (
            <p className="mt-8 text-sm text-muted-foreground">
              No approved pairings yet across any chapter — be the first to submit one in a live city.
            </p>
          )}

          <div className="mt-6 space-y-4">
            {trending.map((p) => {
              const count = heartCounts[p.id] ?? 0;
              const mine = myHearts.has(p.id);
              const cityName = p.sos_cities?.name;
              const citySlug = p.sos_cities?.slug;
              return (
                <div key={p.id} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {citySlug ? (
                          <a href={`/sing-ova-sundays/${citySlug}`} className="text-gold hover:underline">
                            {cityName}
                          </a>
                        ) : (
                          cityName
                        )}
                        {p.week_theme ? ` · ${p.week_theme}` : ""}
                        {p.status === "played" ? " · Played" : ""}
                      </p>
                      <p className="mt-1 font-display text-lg font-semibold">
                        {p.original_artist} — "{p.original_title}"
                        <span className="mx-2 text-secondary">→</span>
                        {p.reggae_artist} — "{p.reggae_title}"
                      </p>
                      {p.note && <p className="mt-2 text-sm text-muted-foreground">{p.note}</p>}
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

        {/* Eight-week themes */}
        <section>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">The Cover Story Format</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Every chapter runs the same eight-week rotation — the format never changes, only the
            pairings do. Week 8 hands the mic to the crowd.
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

        {/* Join */}
        <section id="join" className="scroll-mt-20">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Join Sing Ova</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            One login works in every chapter — verify once here, then submit and heart pairings in
            any city, live or coming soon.
          </p>

          <div className="mt-6 rounded-xl border border-border bg-card p-6">
            {!session && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hub-name">Display name</Label>
                  <Input
                    id="hub-name"
                    placeholder="What should we call you in the feed?"
                    value={displayNameInput}
                    onChange={(e) => setDisplayNameInput(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hub-email">Email address</Label>
                  <Input
                    id="hub-email"
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
            )}
          </div>
        </section>
      </div>

      {/* Closing bar */}
      <section className="bg-secondary py-10 text-secondary-foreground">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="font-display text-xl font-semibold sm:text-2xl">
            One Riddim. Two Worlds. <span className="text-gold">Endless Classics.</span>
          </p>
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
