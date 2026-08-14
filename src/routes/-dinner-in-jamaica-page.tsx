// Shared by src/routes/dinner-in-jamaica.tsx. The "-" prefix excludes this
// file from route generation (TanStack Router convention) — see
// src/routes/README.md.
//
// Launch scope (2026-08-14): teaser + rotation table + notify-me signup only.
// Per the concept doc's own "pilot for a month before opening memberships"
// guidance, membership pricing, the Passport program, and the corporate
// package ladder are intentionally NOT built here yet — add them once the
// pilot at Jerky Jerk proves out which nights actually pull traffic.
import { useState, type FormEvent } from "react";
import {
  CalendarDays,
  Music,
  UtensilsCrossed,
  BookOpen,
  Mail,
  CheckCircle2,
  Share2,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SOCIAL_LINKS } from "@/lib/social";
import { supabase } from "@/lib/supabase";

const SITE_URL = "https://trcevent.com";
const EVENT_SLUG = "dinner-in-jamaica";
const EVENT_NAME = "Dinner in Jamaica";

const ROTATION = [
  {
    day: "Sunday",
    identity: "Sunday Dinner",
    food: "Rice & Peas, Brown Stew Chicken, Curry Goat, Oxtail",
    music: "Beres Hammond, Dennis Brown, Gospel Reggae",
    hook: "Jamaica's Thanksgiving — every week.",
  },
  {
    day: "Monday",
    identity: "Sunday Monday",
    food: "Yesterday's leftovers, reimagined",
    music: "Quiet Lovers Rock",
    hook: "Discount plate. The comfort-food comedown.",
  },
  {
    day: "Tuesday",
    identity: "Curry Tuesday",
    food: "Curry Chicken, Curry Goat, White Rice, Festival",
    music: "Dancehall Classics — Super Cat, Shabba, Buju",
    hook: "Economical, bold, built to reheat well — just like home.",
  },
  {
    day: "Wednesday",
    identity: "Stew Peas Wednesday",
    food: "Stew Peas, Spinners",
    music: "Roots Reggae — Burning Spear, Culture",
    hook: "The education night — a short culture story with the meal.",
  },
  {
    day: "Thursday",
    identity: "Throwback Thursday",
    food: "Brown Stew Chicken, Escovitch Fish",
    music: "Ska, Rocksteady, Studio One",
    hook: "Old-school Jamaican dance party energy.",
  },
  {
    day: "Friday",
    identity: "Cook Wah?",
    food: "Jerk Chicken, Jerk Pork, Fried Fish, Rum Punch",
    music: "Live DJ — Dancehall, Afrobeats, Soca",
    hook: "“Mama nah cook tonight.” The week's biggest night.",
    flagship: true,
  },
  {
    day: "Saturday",
    identity: "Soup Saturday",
    food: "Chicken, Red Peas & Pumpkin Soup, Mannish Water (monthly)",
    music: "Nyabinghi, Roots, Live Drumming",
    hook: "Rotates monthly: Sound System Night, Dominoes, Rum & Roots, Live Band.",
  },
];

export function dinnerInJamaicaHead() {
  return {
    meta: [
      { title: "Dinner in Jamaica — The Dinner Riddim | Jerky Jerk x TRC Events" },
      {
        name: "description",
        content:
          "A New Track Every Day. Same Riddim All Week. Dinner in Jamaica is the weekly Jamaican dinner rotation at Jerky Jerk — presented by TRC Events, with cultural programming by Ras Tafari Inc.",
      },
      {
        property: "og:title",
        content: "Dinner in Jamaica — The Dinner Riddim | Jerky Jerk x TRC Events",
      },
      {
        property: "og:description",
        content:
          "A New Track Every Day. Same Riddim All Week. The weekly Jamaican dinner rotation at Jerky Jerk.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/dinner-in-jamaica` },
      { name: "twitter:card", content: "summary" },
      {
        name: "twitter:title",
        content: "Dinner in Jamaica — The Dinner Riddim | Jerky Jerk x TRC Events",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/dinner-in-jamaica` }],
  };
}

function NotifySignup() {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (honeypot) {
      setStatus("done");
      return;
    }
    setStatus("loading");
    const { error } = await supabase.from("event_notify_signups").insert({
      event_slug: EVENT_SLUG,
      event_name: EVENT_NAME,
      brand: "trc",
      email: email.trim(),
    });
    // Unique on (event_slug, email) -- a duplicate signup is still a
    // "yes I'm in", so treat it as success rather than surfacing an error.
    if (error && error.code !== "23505") {
      setStatus("error");
      return;
    }
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="mx-auto flex max-w-md items-center justify-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-6 py-8 text-center">
        <CheckCircle2 className="size-5 shrink-0 text-gold" />
        <p className="font-medium">
          You're on the list — we'll let you know when it's your turn to eat.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          name="company"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />
        <Input
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10"
        />
        <Button type="submit" variant="gold" size="lg" disabled={status === "loading"}>
          <Mail className="size-4" /> {status === "loading" ? "Joining…" : "Notify Me"}
        </Button>
      </form>
      {status === "error" && (
        <p className="mt-3 text-sm text-destructive">
          Something went wrong — try again in a moment.
        </p>
      )}
    </div>
  );
}

export function DinnerInJamaicaPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="eyebrow mb-3">The Dinner Riddim</p>
          <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
            Dinner in <span className="text-gradient-gold">Jamaica</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-display text-xl italic text-muted-foreground sm:text-2xl">
            A New Track Every Day. Same Riddim All Week.
          </p>
          <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4 text-gold" /> Every night, all week
            </span>
            <span className="inline-flex items-center gap-1.5">
              <UtensilsCrossed className="size-4 text-gold" /> At Jerky Jerk
            </span>
          </div>
          <div className="mt-7">
            <Button asChild variant="gold" size="xl">
              <a href="#notify">Get Notified</a>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-20 px-4 py-16 sm:px-6">
        {/* The Hook */}
        <section className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            A Real Tradition, Not a Theme Night
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Every Jamaican household already runs on the same seven-day rotation — rice and peas
            Sunday, curry Tuesday, stew peas Wednesday, "Cook wah pon Friday?", soup Saturday.
            Dinner in Jamaica brings that rotation to life as a recurring weekly experience at{" "}
            <a
              href="https://www.jerkyjerk.net/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground hover:text-gold hover:underline"
            >
              Jerky Jerk
            </a>{" "}
            — a different track every night, all riding the same riddim.
          </p>
        </section>

        {/* Rotation */}
        <section>
          <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">
            The Week, Track by Track
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
            {ROTATION.map((night) => (
              <div
                key={night.day}
                className={
                  night.flagship
                    ? "rounded-xl border-2 border-gold bg-gold/10 p-4 shadow-lg shadow-gold/20"
                    : "rounded-xl border border-border bg-card p-4"
                }
              >
                {night.flagship && (
                  <span className="mb-2 inline-block whitespace-nowrap rounded-full bg-gold px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-gold-foreground">
                    Biggest Night
                  </span>
                )}
                <p className="eyebrow mb-1">{night.day}</p>
                <p className="font-display text-lg font-bold">{night.identity}</p>
                <p className="mt-2 text-sm text-muted-foreground">{night.food}</p>
                <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
                  <Music className="mt-0.5 size-3.5 shrink-0 text-gold" /> {night.music}
                </p>
                <p className="mt-3 text-sm font-medium italic">{night.hook}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Culture Card */}
        <section className="rounded-xl border border-border bg-card p-6 sm:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <BookOpen className="mx-auto size-6 text-gold" />
            <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">The Culture Card</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Every table gets a short Culture Card tied to that night's dish or tradition — why
              Saturday became soup day, why rice and peas is inseparable from Sunday. It's a direct
              extension of Ras Tafari Inc.'s educational mission, delivered through food instead of
              a lecture hall.
            </p>
          </div>
        </section>

        {/* Notify */}
        <section id="notify" className="scroll-mt-20 text-center">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Get the First Seat at the Table
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Dinner in Jamaica is launching in pilot at Jerky Jerk. Drop your email and we'll tell
            you the moment the first rotation night is open.
          </p>
          <div className="mt-6">
            <NotifySignup />
          </div>
        </section>

        {/* Share */}
        <section className="rounded-xl border border-border bg-card p-6 text-center">
          <h3 className="eyebrow mb-4 flex items-center justify-center gap-1.5">
            <Share2 className="size-3.5" /> Share The Dinner Riddim
          </h3>
          <div className="mx-auto flex max-w-xs gap-2">
            {[
              { Icon: Instagram, href: SOCIAL_LINKS.instagram, label: "Instagram" },
              { Icon: Facebook, href: SOCIAL_LINKS.facebook, label: "Facebook" },
              { Icon: Twitter, href: SOCIAL_LINKS.twitter, label: "X (Twitter)" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center rounded-lg border border-border py-2.5 text-muted-foreground transition-colors hover:border-gold hover:text-gold"
                aria-label={label}
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Presented by TRC Events, at{" "}
            <a
              href="https://www.jerkyjerk.net/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground hover:text-gold hover:underline"
            >
              Jerky Jerk
            </a>
            , with cultural programming by Ras Tafari Inc.
          </p>
        </section>
      </div>
    </div>
  );
}
