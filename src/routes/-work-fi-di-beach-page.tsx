// Shared by src/routes/work-fi-di-beach.tsx. The "-" prefix excludes this
// file from route generation (TanStack Router convention) — see
// src/routes/README.md.
//
// Work Fi Di Beach pairs the American Labor Day weekend (Fri-Mon, Sept 4-7
// 2026) with the Jamaican tradition of Labour Day as a day of national
// volunteer service: a morning shoreline cleanup + litter count, followed by
// an afternoon of music, food, and dominoes, every day of the long weekend,
// at 63rd Street Beach. Same weekend as Chicago Vybez (-chicago-vybez-page),
// different venue and organizer — the two run in parallel, not in competition.
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  Share2,
  Instagram,
  Facebook,
  Twitter,
  Recycle,
  Trash2,
  Music,
  UtensilsCrossed,
  Users,
  Gamepad2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SOCIAL_LINKS } from "@/lib/social";
import flyerImg from "@/assets/work-fi-di-beach-flyer.jpg";
import clipVideo from "@/assets/work-fi-di-beach-clip.mp4";

const SITE_URL = "https://trcevent.com";
const VENUE_NAME = "63rd Street Beach";
const VENUE_ADDRESS = "63rd Street Beach, Jackson Park, Chicago, IL";
// Friday through Labor Day itself. Countdown targets the first morning shift.
const EVENT_START = new Date("2026-09-04T09:00:00");

const EVENT_DAYS = [
  { day: "Friday", date: "Sept 4" },
  { day: "Saturday", date: "Sept 5" },
  { day: "Sunday", date: "Sept 6" },
  { day: "Monday", date: "Sept 7", holiday: "Labor Day" },
];

const SHIFTS = [
  {
    time: "9:00 AM – Noon",
    title: "Beach Cleanup & Litter Log",
    description:
      "Meet at the pavilion for gloves, bags, and a tally sheet. Work the shoreline in crews, sort what you find, and log it by category before it goes in the truck.",
    tags: ["Gloves provided", "Bags provided", "Kid crews welcome"],
  },
  {
    time: "Noon – 8:00 PM",
    title: "Music, Food & Dominoes",
    description:
      "The sound system takes over where the cleanup crews leave off. Jerk pans, domino tables, and family activities run through sunset on the same stretch of sand.",
    tags: ["Live sound system", "Domino tournament", "Family activities"],
  },
];

const LITTER_CATEGORIES = [
  "Plastic fragments",
  "Cigarette butts",
  "Bottle caps",
  "Food wrappers",
  "Glass",
  "Foam pieces",
  "Other / misc.",
];

const PM_LINEUP = [
  {
    icon: Music,
    title: "Sound System",
    description:
      "Reggae and dancehall selectors on the beach PA from noon to close, building toward a sunset set.",
  },
  {
    icon: UtensilsCrossed,
    title: "Jerk & Food Stalls",
    description:
      "Jerk chicken and vegetarian jerk over pimento wood, festival, and cold drinks along the boardwalk.",
  },
  {
    icon: Gamepad2,
    title: "Domino Tables",
    description:
      "Open tables all afternoon, with a bracket tournament running from 2 to 5 for anyone who wants in.",
  },
  {
    icon: Users,
    title: "Family Activities",
    description:
      "Sand art, a kids' relay, and a shaded activity tent for the youngest crew members.",
  },
];

export function workFiDiBeachHead() {
  const imageUrl = `${SITE_URL}${flyerImg}`;
  return {
    meta: [
      { title: "Work Fi Di Beach — Labour Day Weekend | TRC Events" },
      {
        name: "description",
        content:
          "Work Fi Di Beach: a Labour Day weekend cleanup and celebration at 63rd Street Beach, Chicago. Friday–Monday, Sept 4–7, 2026 — free morning shoreline cleanup, afternoon music, food, and dominoes, every day. Free, all ages.",
      },
      { property: "og:title", content: "Work Fi Di Beach — Labour Day Weekend | TRC Events" },
      {
        property: "og:description",
        content:
          "Labour Day Weekend 2026, Fri–Mon at 63rd Street Beach. Free morning cleanup, free afternoon celebration.",
      },
      { property: "og:type", content: "article" },
      { property: "og:image", content: imageUrl },
      { property: "og:url", content: `${SITE_URL}/work-fi-di-beach` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Work Fi Di Beach — Labour Day Weekend | TRC Events" },
      {
        name: "twitter:description",
        content: "Fri–Mon, Sept 4–7, 2026 at 63rd Street Beach. Free. All ages.",
      },
      { name: "twitter:image", content: imageUrl },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/work-fi-di-beach` }],
  };
}

function useCountdown(target: Date) {
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setRemainingMs(Math.max(0, target.getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return remainingMs;
}

function CountdownStrip() {
  const remainingMs = useCountdown(EVENT_START);
  const totalSeconds = remainingMs == null ? null : Math.floor(remainingMs / 1000);

  const units = [
    { label: "Days", value: totalSeconds == null ? null : Math.floor(totalSeconds / 86400) },
    {
      label: "Hours",
      value: totalSeconds == null ? null : Math.floor((totalSeconds % 86400) / 3600),
    },
    { label: "Min", value: totalSeconds == null ? null : Math.floor((totalSeconds % 3600) / 60) },
    { label: "Sec", value: totalSeconds == null ? null : totalSeconds % 60 },
  ];

  return (
    <div className="flex justify-center gap-6 sm:gap-10">
      {units.map((u) => (
        <div key={u.label} className="text-center">
          <p className="font-display text-3xl font-extrabold tabular-nums text-gold sm:text-4xl">
            {u.value == null ? "--" : String(u.value).padStart(2, "0")}
          </p>
          <p className="mt-1 text-[0.65rem] uppercase tracking-wider text-muted-foreground">
            {u.label}
          </p>
        </div>
      ))}
    </div>
  );
}

export function WorkFiDiBeachPage() {
  const mapsSrc = `https://www.google.com/maps?q=${encodeURIComponent(VENUE_ADDRESS)}&output=embed`;

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Work Fi Di Beach",
    startDate: "2026-09-04T09:00:00-05:00",
    endDate: "2026-09-07T20:00:00-05:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    isAccessibleForFree: true,
    image: [`${SITE_URL}${flyerImg}`],
    location: {
      "@type": "Place",
      name: VENUE_NAME,
      address: "Chicago, IL",
    },
    organizer: {
      "@type": "Organization",
      name: "TRC Events",
      url: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/work-fi-di-beach#entry`,
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-16">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            <Badge className="bg-gold text-gold-foreground hover:bg-gold">
              Chicago Meets Jamaica
            </Badge>
            <Badge variant="outline" className="border-gold/40 text-gold">
              Free · All Ages
            </Badge>
          </div>
          <p className="eyebrow mb-2">Presented by TRC Events</p>
          <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
            Work Fi Di Beach
          </h1>
          <p className="mt-1 font-display text-2xl italic text-gradient-gold sm:text-3xl">
            Service Is the Celebration
          </p>

          <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4 text-gold" /> Labor Day Weekend · Sept 4–7, 2026
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4 text-gold" /> Daily, 9 AM – 8 PM
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 text-gold" /> 63rd Street Beach, Chicago
            </span>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild variant="gold" size="xl">
              <a href="#shift">
                <Recycle className="size-4" /> See the Shift Schedule
              </a>
            </Button>
            <Button asChild variant="goldOutline" size="xl">
              <a href="#venue">Get Directions</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Countdown */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-10 text-center sm:px-6">
          <p className="eyebrow mb-6">First Shift Starts In</p>
          <CountdownStrip />
          <div className="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-2">
            {EVENT_DAYS.map(({ day, date, holiday }) => (
              <Badge
                key={day}
                variant="outline"
                className={
                  holiday
                    ? "border-transparent bg-gold px-3 py-1.5 text-sm text-gold-foreground shadow shadow-gold/30"
                    : "border-gold/30 px-3 py-1.5 text-sm"
                }
              >
                <span className={holiday ? "font-semibold" : "font-semibold text-foreground"}>
                  {day}
                </span>
                <span className={holiday ? "ml-1.5" : "ml-1.5 text-muted-foreground"}>
                  {date}
                  {holiday ? ` — ${holiday}` : ""}
                </span>
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-20 px-4 py-16 sm:px-6">
        {/* About + Flyer */}
        <section className="grid items-center gap-10 md:grid-cols-[1fr_320px]">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Two Calendars, One Word</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              America clocks out for Labor Day. Jamaica clocks in for it — Labour Day there, marked
              every May 23, has been a day of national volunteer service since 1972, not a day of
              rest. 63rd Street Beach runs that model on the American calendar date, and stretches
              it across all four days of the long weekend.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Monday, September 7 is the actual U.S. holiday. Every morning that weekend — Friday
              through Monday — starts with a shoreline cleanup and litter count. Every afternoon
              turns into a celebration: sound system, jerk food, and dominoes, free and open to all
              ages.
            </p>
            <p className="mt-4 text-sm font-medium text-gold">#WorkFiDiBeach</p>
          </div>
          <img
            src={flyerImg}
            alt="Work Fi Di Beach flyer — volunteers cleaning 63rd Street Beach with recycling and trash bags, a litter log clipboard, and banners for the September 4-7, 2026 event"
            className="mx-auto w-full max-w-[320px] rounded-2xl border border-gold/30 object-cover"
          />
        </section>

        {/* Two Traditions */}
        <section>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Two Traditions, One Beach</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="eyebrow mb-3">United States · First Monday in September</h3>
              <p className="font-display text-xl font-semibold">Labor Day</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                First marked by New York City workers in 1882. President Grover Cleveland signed it
                into a federal holiday in 1894, days after federal troops put down the Pullman
                Strike. It has since settled into America's unofficial last day of summer.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="eyebrow mb-3">Jamaica · May 23</h3>
              <p className="font-display text-xl font-semibold">Labour Day</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Established in 1960 to mark the 1938 workers' uprising. In 1972, Michael Manley
                rededicated it to national volunteer service — the first project cleared and
                beautified the Palisadoes Road.
              </p>
            </div>
          </div>
        </section>

        {/* The Shift */}
        <section id="shift" className="scroll-mt-20">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">The Shift</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            One day, two shifts — repeated Friday, Saturday, Sunday, and Monday. Clock in for
            either, or both, on as many days as you've got in you.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {SHIFTS.map((shift) => (
              <div key={shift.title} className="rounded-xl border border-border bg-card p-5">
                <h3 className="eyebrow mb-3 flex items-center gap-1.5">
                  <Clock className="size-3.5 text-gold" /> {shift.time}
                </h3>
                <p className="font-display text-xl font-semibold">{shift.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {shift.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {shift.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-gold/30 text-xs text-gold">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* The Litter Log */}
        <section>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Why We Count What We Pick Up
          </h2>
          <div className="mt-6 grid gap-8 md:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="leading-relaxed text-muted-foreground">
                Shoreline cleanups along the Great Lakes have logged litter by category for over two
                decades — more than 14,000 cleanups' worth of data across all five lakes. Roughly
                86% of what's collected in a given season is plastic, in some form, down to the
                cigarette butts and foam fragments that never made it into a bin.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                We're running our own tally sheet on the same model: what gets picked up gets
                counted, by type, before it's bagged, fresh each of the four mornings. This isn't a
                formal partnership with any shoreline program — just borrowed practice. If this
                weekend's count is good, formal registration with an established Adopt-a-Beach
                program is the natural next step for next year.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="eyebrow flex items-center gap-1.5">
                  <Trash2 className="size-3.5 text-gold" /> Litter Log
                </h3>
                <span className="text-xs text-muted-foreground">63rd St.</span>
              </div>
              <ul className="divide-y divide-border text-sm">
                {LITTER_CATEGORIES.map((item) => (
                  <li key={item} className="flex items-center justify-between gap-3 py-2.5">
                    <span>{item}</span>
                    <span className="text-xs tabular-nums text-muted-foreground">TALLY</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Flyer & Clip */}
        <section>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">The Flyer &amp; The Clip</h2>
          <div className="mt-6 grid items-start gap-8 md:grid-cols-2">
            <img
              src={flyerImg}
              alt="Work Fi Di Beach event flyer"
              className="aspect-[2/3] w-full rounded-xl border border-gold/30 object-cover"
            />
            <video
              controls
              playsInline
              poster={flyerImg}
              preload="metadata"
              className="aspect-[2/3] w-full rounded-xl border border-gold/30 object-cover"
            >
              <source src={clipVideo} type="video/mp4" />
            </video>
          </div>
        </section>

        {/* Venue */}
        <section id="venue" className="scroll-mt-20">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">The Site</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            The bathing pavilion behind 63rd Street Beach, finished in 1919, is the oldest beach
            house left on the Chicago lakefront. By 1960 the beach itself was a site of organized
            wade-ins against a segregated lakefront — a crew showing up to do something together, in
            public, on purpose, is a continuation of that history, not a departure from it.
          </p>
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <div className="space-y-4 rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-gold" />
                <div>
                  <p className="font-semibold">{VENUE_NAME}</p>
                  <p className="text-sm text-muted-foreground">Jackson Park, Chicago, IL</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 size-5 shrink-0 text-gold" />
                <p className="text-sm">Friday–Monday, September 4–7, 2026</p>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-gold" />
                <p className="text-sm">Daily, 9 AM cleanup – 8 PM celebration</p>
              </div>
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

        {/* PM Lineup */}
        <section>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">The P.M. Lineup</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The gloves come off, the speakers go up — everything below runs all four afternoons, on
            the same sand as the morning shift.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {PM_LINEUP.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-5 text-center"
              >
                <Icon className="size-5 text-gold" />
                <span className="text-sm font-medium">{title}</span>
                <span className="text-xs leading-relaxed text-muted-foreground">{description}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Entry */}
        <section id="entry" className="scroll-mt-20">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Come for Either Shift</h2>
          <div className="mt-6 rounded-xl border-2 border-gold bg-gold/10 p-8 text-center shadow-lg shadow-gold/20">
            <p className="font-display text-3xl font-extrabold text-gold">Free · All Ages</p>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              No registration required to walk up on any of the four days. We bring gloves, bags,
              sorting bins, tally sheets, and the sound system. Bring sunscreen, a reusable water
              bottle, and closed-toe shoes for the shoreline.
            </p>
          </div>
        </section>

        {/* Share */}
        <section className="rounded-xl border border-border bg-card p-6 text-center">
          <h3 className="eyebrow mb-4 flex items-center justify-center gap-1.5">
            <Share2 className="size-3.5" /> Share Work Fi Di Beach
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
        </section>
      </div>
    </div>
  );
}
