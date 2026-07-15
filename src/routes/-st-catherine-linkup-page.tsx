// Shared by src/routes/st-catherine-linkup.tsx. The "-" prefix excludes this
// file from route generation (TanStack Router convention) — see
// src/routes/README.md.
//
// Branding note (2026-07-15): the two names circulating for this event
// ("Bad Like Di 90's" and "St. Catherine Link-Up") aren't competing options —
// the official flyer settles it by using both together: "Bad Like Di 90's"
// is the party name, "St. Catherine Link-Up" is the community tagline under
// it. Keep that hierarchy (headline + tagline) everywhere this event is
// referenced, rather than picking one and dropping the other.
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  Ticket,
  Share2,
  Instagram,
  Facebook,
  Twitter,
  UtensilsCrossed,
  Music,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SOCIAL_LINKS } from "@/lib/social";
import flyerImg from "@/assets/st-catherine-linkup-flyer.jpg";

const SITE_URL = "https://trcevent.com";
const VENUE_NAME = "ILU Club of Chicago";
const VENUE_ADDRESS = "14421 Greenwood Rd, Dolton, IL";
// Free noon–midnight, $20 after midnight, per the flyer. Countdown targets
// the noon start.
const EVENT_START = new Date("2026-08-22T12:00:00");
const HEADLINER = "Suge — Don Dadda";
const SOUND_SYSTEMS = [
  "City Rock",
  "Mighty Prestige Sound",
  "Stylez International",
  "Stone Jam Sound System",
];
const DJS = ["DJ Poyo"];

export function stCatherineLinkupHead() {
  const imageUrl = `${SITE_URL}${flyerImg}`;
  return {
    meta: [
      { title: "Bad Like Di 90's — St. Catherine Link-Up | TRC Events" },
      {
        name: "description",
        content:
          "Bad Like Di 90's — St. Catherine Link-Up. One Parish, One Link, One Community. Featuring Suge (Don Dadda), City Rock, Mighty Prestige Sound & more — Saturday, Aug 22, 2026 at ILU Club of Chicago, Dolton, IL. Free noon–midnight.",
      },
      { property: "og:title", content: "Bad Like Di 90's — St. Catherine Link-Up | TRC Events" },
      {
        property: "og:description",
        content:
          "One Parish, One Link, One Community. Aug 22, 2026 — Dolton, IL. Free noon–midnight.",
      },
      { property: "og:type", content: "article" },
      { property: "og:image", content: imageUrl },
      { property: "og:url", content: `${SITE_URL}/st-catherine-linkup` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Bad Like Di 90's — St. Catherine Link-Up | TRC Events" },
      {
        name: "twitter:description",
        content:
          "One Parish, One Link, One Community. Aug 22, 2026 — Dolton, IL. Free noon–midnight.",
      },
      { name: "twitter:image", content: imageUrl },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/st-catherine-linkup` }],
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

const AREAS = [
  { name: "Linstead", coords: "18.1368° N, 77.0317° W" },
  { name: "Spanish Town", coords: "17.9911° N, 76.9574° W" },
  { name: "Portmore", coords: "17.9506° N, 76.8824° W" },
];

export function StCatherineLinkupPage() {
  const mapsSrc = `https://www.google.com/maps?q=${encodeURIComponent(VENUE_ADDRESS)}&output=embed`;

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Bad Like Di 90's — St. Catherine Link-Up",
    startDate: "2026-08-22T12:00:00-05:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: [`${SITE_URL}${flyerImg}`],
    location: {
      "@type": "Place",
      name: VENUE_NAME,
      address: VENUE_ADDRESS,
    },
    organizer: {
      "@type": "Organization",
      name: "TRC Events",
      url: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/st-catherine-linkup#tickets`,
      priceCurrency: "USD",
      price: "0",
      availability: "https://schema.org/InStock",
      description: "Free entry noon–midnight; $20 cover after midnight",
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
              Celebrating Prestige Finest: Suge
            </Badge>
            <Badge variant="outline" className="border-gold/40 text-gold">
              Free Before Midnight
            </Badge>
          </div>
          <p className="eyebrow mb-2">Presented by TRC Events</p>
          <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
            Bad Like Di 90's
          </h1>
          <p className="mt-1 font-display text-2xl italic text-gradient-gold sm:text-3xl">
            St. Catherine Link-Up
          </p>
          <p className="mt-1 text-sm uppercase tracking-wide text-muted-foreground">
            One Parish · One Link · One Community
          </p>

          <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4 text-gold" /> Saturday, Aug 22, 2026
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4 text-gold" /> Noon – Late
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 text-gold" /> Dolton, IL
            </span>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild variant="gold" size="xl">
              <a href="#tickets">
                <Ticket className="size-4" /> Entry Info
              </a>
            </Button>
            <Button asChild variant="goldOutline" size="xl">
              <a href="#venue">Venue Info</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Countdown */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-10 text-center sm:px-6">
          <p className="eyebrow mb-6">Link-Up Starts In</p>
          <CountdownStrip />
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-20 px-4 py-16 sm:px-6">
        {/* About */}
        <section className="grid items-center gap-10 md:grid-cols-[1fr_320px]">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Strong. Proud. Connected.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              St. Catherine Link-Up brings together Chicagoland's community from three of St.
              Catherine parish's proudest areas — Linstead, Spanish Town, and Portmore — for a full
              day of 90s dancehall nostalgia, headlined by{" "}
              <strong className="text-foreground">{HEADLINER}</strong>. One parish, one link, one
              community, stronger together.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Free entry from noon until midnight, with a $20 cover after midnight for those keeping
              the vibe going late.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <UtensilsCrossed className="size-4 text-gold" />
              Pre-ordered food available on-site — Jerky Jerk &amp; Tropical Jerk
            </div>
            <p className="mt-4 text-sm font-medium text-gold">#StCatherineLinkUp</p>
          </div>
          <img
            src={flyerImg}
            alt="Bad Like Di 90's — St. Catherine Link-Up flyer, featuring Suge (Don Dadda)"
            className="mx-auto w-full max-w-[320px] rounded-2xl border border-gold/30 object-cover"
          />
        </section>

        {/* Lineup */}
        <section>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Full Lineup</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border-2 border-gold bg-gold/10 p-5">
              <h3 className="eyebrow mb-3">Headliner</h3>
              <p className="font-display text-xl font-semibold">{HEADLINER}</p>
              <p className="text-sm text-muted-foreground">Celebrating Prestige Finest</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="eyebrow mb-3 flex items-center gap-1.5">
                <Music className="size-3.5 text-gold" /> Sound Systems &amp; DJs
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {[...SOUND_SYSTEMS, ...DJS].map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Areas */}
        <section>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Three Areas, One Link</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {AREAS.map((area) => (
              <div
                key={area.name}
                className="rounded-xl border border-border bg-card p-5 text-center"
              >
                <MapPin className="mx-auto mb-2 size-5 text-gold" />
                <h3 className="font-display font-semibold">{area.name}</h3>
                <p className="mt-1 text-xs tabular-nums text-muted-foreground">{area.coords}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Venue */}
        <section id="venue" className="scroll-mt-20">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Venue &amp; Details</h2>
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <div className="space-y-4 rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-gold" />
                <div>
                  <p className="font-semibold">{VENUE_NAME}</p>
                  <p className="text-sm text-muted-foreground">Dolton, IL</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 size-5 shrink-0 text-gold" />
                <p className="text-sm">Saturday, August 22, 2026</p>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-gold" />
                <p className="text-sm">Free noon–midnight · $20 after midnight</p>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-gold" />
                <a href="tel:+14149093279" className="text-sm hover:text-gold">
                  414-909-3279
                </a>
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

        {/* Tickets / Entry */}
        <section id="tickets" className="scroll-mt-20">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Entry</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border-2 border-gold bg-gold/10 p-5 text-center shadow-lg shadow-gold/20">
              <p className="eyebrow mb-1">Noon – Midnight</p>
              <p className="font-display text-3xl font-extrabold text-gold">Free</p>
            </div>
            <div className="rounded-xl border border-gold/30 bg-card p-5 text-center">
              <p className="eyebrow mb-1">After Midnight</p>
              <p className="font-display text-3xl font-extrabold text-gold">$20</p>
            </div>
          </div>
          <div className="mt-6 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gold/30 bg-card px-6 py-8 text-center">
            <Ticket className="size-6 text-gold" />
            <p className="font-display font-semibold">Ticket outlet link coming soon</p>
            <p className="max-w-md text-sm text-muted-foreground">
              No pre-sale required to attend — walk-ins welcome.
            </p>
          </div>
        </section>

        {/* Share */}
        <section className="rounded-xl border border-border bg-card p-6 text-center">
          <h3 className="eyebrow mb-4 flex items-center justify-center gap-1.5">
            <Share2 className="size-3.5" /> Share Bad Like Di 90's
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
