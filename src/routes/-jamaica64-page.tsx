// Shared by src/routes/jamaica64.tsx. The "-" prefix excludes this file from
// route generation (TanStack Router convention) — see src/routes/README.md.
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SOCIAL_LINKS } from "@/lib/social";
import flyerImg from "@/assets/jamaica64-flyer.jpg";

const SITE_URL = "https://trcevent.com";
const VENUE_NAME = "Stiner Pavilion, On the Beach";
const VENUE_ADDRESS = "Stiner Pavilion, Waukegan, IL";
// 10 AM–10 PM per the flyer, local time. Countdown targets the start time.
const EVENT_START = new Date("2026-08-02T10:00:00");

export function jamaica64Head() {
  const imageUrl = `${SITE_URL}${flyerImg}`;
  return {
    meta: [
      { title: "Jamaica64 — Chicagoland Celebrates Jamaica | TRC Events" },
      {
        name: "description",
        content:
          "Jamaica64: United in Celebrating Resilience. Sunday, Aug 2, 2026, 10AM–10PM at Stiner Pavilion on the beach, Waukegan, IL. Presented by TRC Events & Ras Tafari Inc.",
      },
      { property: "og:title", content: "Jamaica64 — Chicagoland Celebrates Jamaica | TRC Events" },
      {
        property: "og:description",
        content:
          "United in Celebrating Resilience. Sunday, Aug 2, 2026 — Stiner Pavilion, Waukegan, IL.",
      },
      { property: "og:type", content: "article" },
      { property: "og:image", content: imageUrl },
      { property: "og:url", content: `${SITE_URL}/jamaica64` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Jamaica64 — Chicagoland Celebrates Jamaica | TRC Events" },
      {
        name: "twitter:description",
        content:
          "United in Celebrating Resilience. Sunday, Aug 2, 2026 — Stiner Pavilion, Waukegan, IL.",
      },
      { name: "twitter:image", content: imageUrl },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/jamaica64` }],
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

export function Jamaica64Page() {
  const mapsSrc = `https://www.google.com/maps?q=${encodeURIComponent(VENUE_ADDRESS)}&output=embed`;

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Jamaica64 — Chicagoland Celebrates Jamaica",
    startDate: "2026-08-02T10:00:00-05:00",
    endDate: "2026-08-02T22:00:00-05:00",
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
            <Badge className="bg-gold text-gold-foreground hover:bg-gold">64th Independence</Badge>
            <Badge variant="outline" className="border-gold/40 text-gold">
              Free Community Event
            </Badge>
          </div>
          <p className="eyebrow mb-2">Presented by TRC Events &amp; Ras Tafari Inc</p>
          <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
            Jamaica64
          </h1>
          <p className="mt-1 font-display text-2xl italic text-gradient-gold sm:text-3xl">
            United in Celebrating Resilience
          </p>

          <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4 text-gold" /> Sunday, Aug 2, 2026
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4 text-gold" /> 10 AM – 10 PM
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 text-gold" /> {VENUE_NAME}
            </span>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild variant="gold" size="xl">
              <a href="#tickets">
                <Ticket className="size-4" /> Get Updates
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
          <p className="eyebrow mb-6">Gates Open In</p>
          <CountdownStrip />
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-20 px-4 py-16 sm:px-6">
        {/* About */}
        <section className="grid items-center gap-10 md:grid-cols-[1fr_320px]">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Chicagoland Celebrates Jamaica
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Jamaica64 marks 64 years of independence with a full day of community, culture, and
              resilience on the beach in Waukegan. Presented by TRC Events in partnership with Ras
              Tafari Inc, this is a gathering for the whole Chicagoland Jamaican diaspora — from
              sunrise to sundown.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Wear your colors and bring your Jamaican vibes. Bring your chairs, your crew, and your
              island spirit — this one is for the culture.
            </p>
          </div>
          <img
            src={flyerImg}
            alt="Jamaica64 — Chicagoland Celebrates Jamaica flyer"
            className="mx-auto w-full max-w-[280px] rounded-2xl border border-gold/30 object-cover"
          />
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
                  <p className="text-sm text-muted-foreground">Waukegan, IL</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 size-5 shrink-0 text-gold" />
                <p className="text-sm">Sunday, August 2, 2026</p>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-gold" />
                <p className="text-sm">10:00 AM – 10:00 PM</p>
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

        {/* Tickets / Updates */}
        <section id="tickets" className="scroll-mt-20">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Tickets</h2>
          <div className="mt-6 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gold/30 bg-card px-6 py-10 text-center">
            <Ticket className="size-6 text-gold" />
            <p className="font-display font-semibold">Free Community Event</p>
            <p className="max-w-md text-sm text-muted-foreground">
              No ticket required — ticket outlet links coming soon for any add-on offerings.
            </p>
          </div>
        </section>

        {/* Share */}
        <section className="rounded-xl border border-border bg-card p-6 text-center">
          <h3 className="eyebrow mb-4 flex items-center justify-center gap-1.5">
            <Share2 className="size-3.5" /> Share Jamaica64
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
