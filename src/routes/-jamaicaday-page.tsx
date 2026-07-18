// Shared by src/routes/jamaicaday.tsx. The "-" prefix excludes this file from
// route generation (TanStack Router convention) — see src/routes/README.md.
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  Utensils,
  ShieldCheck,
  Share2,
  Instagram,
  Facebook,
  Twitter,
  Music,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SOCIAL_LINKS } from "@/lib/social";
import flyerImg from "@/assets/jamaicaday-flyer.jpg";

const SOUND_SYSTEMS = [
  { name: "Class One Sound" },
  { name: "Seismic Sound" },
  { name: "Mighty Prestige Sound", tagline: "Est. 1992 — “Will Play Everytime”" },
  { name: "Q-Ality Sound", tagline: "“The Difference Is Clear”", contact: "773-554-9694" },
];

const SITE_URL = "https://trcevent.com";
const VENUE_NAME = "The Prairie Lawn";
const VENUE_ADDRESS = "6227 S Prairie Ave, Chicago, IL 60637";
// Gates open 3 PM per the flyer, local time. Countdown targets gate time.
const EVENT_START = new Date("2026-08-09T15:00:00");

export function jamaicadayHead() {
  const imageUrl = `${SITE_URL}${flyerImg}`;
  return {
    meta: [
      { title: "Jamaica Independence Celebration — Team Lenky | TRC Events" },
      {
        name: "description",
        content:
          "Team Lenky presents the annual Jamaica Independence Celebration. Sunday, August 9, 2026, gates open 3PM at The Prairie Lawn, 6227 S Prairie Ave, Chicago. Free admission, all ages.",
      },
      {
        property: "og:title",
        content: "Jamaica Independence Celebration — Team Lenky | TRC Events",
      },
      {
        property: "og:description",
        content:
          "Sunday, August 9, 2026 — gates open 3PM at The Prairie Lawn, 6227 S Prairie Ave, Chicago. Free admission, all ages.",
      },
      { property: "og:type", content: "article" },
      { property: "og:image", content: imageUrl },
      { property: "og:url", content: `${SITE_URL}/jamaicaday` },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Jamaica Independence Celebration — Team Lenky | TRC Events",
      },
      {
        name: "twitter:description",
        content:
          "Sunday, August 9, 2026 — gates open 3PM at The Prairie Lawn, 6227 S Prairie Ave, Chicago. Free admission, all ages.",
      },
      { name: "twitter:image", content: imageUrl },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/jamaicaday` }],
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

function SoundSystemsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {SOUND_SYSTEMS.map((s) => (
        <div
          key={s.name}
          className="rounded-xl border border-border bg-card p-5 text-center transition-colors hover:border-gold/50"
        >
          <p className="font-display text-lg font-bold text-white">{s.name}</p>
          {s.tagline && <p className="mt-1 text-xs italic text-gold">{s.tagline}</p>}
          {s.contact && <p className="mt-1 text-xs text-muted-foreground">{s.contact}</p>}
        </div>
      ))}
    </div>
  );
}

export function JamaicadayPage() {
  const mapsSrc = `https://www.google.com/maps?q=${encodeURIComponent(VENUE_NAME + ", " + VENUE_ADDRESS)}&output=embed`;

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Jamaica Independence Celebration",
    startDate: "2026-08-09T15:00:00-05:00",
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
      name: "Team Lenky",
    },
    performer: SOUND_SYSTEMS.map((s) => ({ "@type": "PerformingGroup", name: s.name })),
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
            <Badge className="bg-gold text-gold-foreground hover:bg-gold">The Annual</Badge>
            <Badge variant="outline" className="border-gold/40 text-gold">
              Free Admission — All Ages
            </Badge>
          </div>
          <p className="eyebrow mb-2">Team Lenky Presents</p>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
            Jamaica Independence Celebration
          </h1>

          <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4 text-gold" /> Sunday, Aug 9, 2026
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4 text-gold" /> Gates Open 3 PM
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 text-gold" /> {VENUE_NAME}
            </span>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild variant="gold" size="xl">
              <a href="#venue">Venue Info</a>
            </Button>
            <Button asChild variant="goldOutline" size="xl">
              <a href="#sounds">Sound Systems</a>
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
              Chicago's Annual Jamaica Independence Celebration
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Team Lenky presents the annual Jamaica Independence Celebration — a full day of music,
              food, and community at The Prairie Lawn. Free admission, all ages welcome.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Food and refreshments will be on sale, with security by GP Style. Wear your colors and
              bring your Jamaican vibes.
            </p>
          </div>
          <img
            src={flyerImg}
            alt="Jamaica Independence Celebration — Team Lenky presents flyer"
            className="mx-auto w-full max-w-[280px] rounded-2xl border border-gold/30 object-cover"
          />
        </section>

        {/* Sound Systems */}
        <section id="sounds" className="scroll-mt-20">
          <p className="eyebrow mb-2 flex items-center gap-1.5">
            <Music className="size-3.5 text-gold" /> Music By
          </p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Sound Systems</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Four of Chicagoland's Jamaican sound systems on the lawn all day.
          </p>
          <div className="mt-6">
            <SoundSystemsGrid />
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
                  <p className="text-sm text-muted-foreground">{VENUE_ADDRESS}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 size-5 shrink-0 text-gold" />
                <p className="text-sm">Sunday, August 9, 2026</p>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-gold" />
                <p className="text-sm">Gates Open 3 PM</p>
              </div>
              <div className="flex items-start gap-3">
                <Utensils className="mt-0.5 size-5 shrink-0 text-gold" />
                <p className="text-sm">Food &amp; refreshments on sale</p>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-gold" />
                <p className="text-sm">Security by GP Style</p>
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

        {/* Admission */}
        <section>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Admission</h2>
          <div className="mt-6 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gold/30 bg-card px-6 py-10 text-center">
            <Badge className="bg-gold text-gold-foreground hover:bg-gold">Free</Badge>
            <p className="font-display font-semibold">Free Admission — All Ages</p>
            <p className="max-w-md text-sm text-muted-foreground">
              No ticket required. Food and refreshments available for purchase on site.
            </p>
          </div>
        </section>

        {/* Share */}
        <section className="rounded-xl border border-border bg-card p-6 text-center">
          <h3 className="eyebrow mb-4 flex items-center justify-center gap-1.5">
            <Share2 className="size-3.5" /> Share This Event
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
