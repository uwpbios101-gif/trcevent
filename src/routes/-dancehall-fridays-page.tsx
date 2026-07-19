// Shared by src/routes/dancehall-fridays.tsx. The "-" prefix excludes this
// file from route generation (TanStack Router convention) — see
// src/routes/README.md.
//
// Recurring weekly party (every Friday), not a one-off show like Charly Black
// or St. Catherine Link-Up. The countdown/hero treats the Sept 25, 2026
// opening night as the featured launch date since that's the one with a
// unique promo (ladies free all night + free jerk dinner for the first 25),
// while copy throughout makes clear the series continues every Friday after.
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
  Music,
  Gift,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SOCIAL_LINKS } from "@/lib/social";
import flyerImg from "@/assets/dancehall-fridays-flyer.jpg";

const SITE_URL = "https://trcevent.com";
const VENUE_NAME = "Banquet Hall – A Place for You";
const VENUE_ADDRESS = "12746 South Halsted Street, Chicago, IL";
// Opening night — every Friday after follows the same 9 PM start.
const EVENT_START = new Date("2026-09-25T21:00:00");
const HOST_DJ = "DJ Bad Chargie";

export function dancehallFridaysHead() {
  const imageUrl = `${SITE_URL}${flyerImg}`;
  return {
    meta: [
      { title: "Dancehall Fridays — Girls Night Out | TRC Events" },
      {
        name: "description",
        content:
          "Dancehall Fridays — Girls Night Out with DJ Bad Chargie. Starting Friday, Sept 25, 2026 and every Friday night after at Banquet Hall – A Place for You, Chicago. Ladies free opening night, $20 general admission, free parking.",
      },
      { property: "og:title", content: "Dancehall Fridays — Girls Night Out | TRC Events" },
      {
        property: "og:description",
        content:
          "Every Friday Night. Ladies free opening night — Sept 25, 2026 — Chicago. Presented by Dougiefresh & One Draw Crew.",
      },
      { property: "og:type", content: "article" },
      { property: "og:image", content: imageUrl },
      { property: "og:url", content: `${SITE_URL}/dancehall-fridays` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Dancehall Fridays — Girls Night Out | TRC Events" },
      {
        name: "twitter:description",
        content:
          "Every Friday Night. Ladies free opening night — Sept 25, 2026 — Chicago. Presented by Dougiefresh & One Draw Crew.",
      },
      { name: "twitter:image", content: imageUrl },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/dancehall-fridays` }],
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

export function DancehallFridaysPage() {
  const mapsSrc = `https://www.google.com/maps?q=${encodeURIComponent(VENUE_ADDRESS)}&output=embed`;

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Dancehall Fridays — Girls Night Out",
    startDate: "2026-09-25T21:00:00-05:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: [`${SITE_URL}${flyerImg}`],
    location: {
      "@type": "Place",
      name: VENUE_NAME,
      address: VENUE_ADDRESS,
    },
    performer: {
      "@type": "Person",
      name: HOST_DJ,
    },
    organizer: {
      "@type": "Organization",
      name: "TRC Events",
      url: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/dancehall-fridays#tickets`,
      priceCurrency: "USD",
      price: "20",
      availability: "https://schema.org/InStock",
      description: "$20 general admission; ladies free per current promo",
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
            <Badge className="bg-gold text-gold-foreground hover:bg-gold">{HOST_DJ}</Badge>
            <Badge variant="outline" className="border-gold/40 text-gold">
              Every Friday Night
            </Badge>
            <Badge variant="destructive">Opening Night: Ladies Free All Night</Badge>
          </div>
          <p className="eyebrow mb-2">Presented by TRC Events</p>
          <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
            Dancehall Fridays
          </h1>
          <p className="mt-1 font-display text-2xl italic text-gradient-gold sm:text-3xl">
            Girls Night Out
          </p>
          <p className="mt-1 text-sm uppercase tracking-wide text-muted-foreground">
            Presented by Dougiefresh &amp; One Draw Crew — &ldquo;It&rsquo;s About Time&rdquo;
          </p>

          <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4 text-gold" /> Every Friday · Starting Sept 25, 2026
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4 text-gold" /> 9 PM – Late
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 text-gold" /> {VENUE_NAME}
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
          <p className="eyebrow mb-6">Opening Night Starts In</p>
          <CountdownStrip />
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-20 px-4 py-16 sm:px-6">
        {/* About */}
        <section className="grid items-center gap-10 md:grid-cols-[1fr_320px]">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Every Friday Night</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Dancehall Fridays brings Chicago its new Girls Night Out — a weekly series presented
              by Dougiefresh &amp; One Draw Crew, with{" "}
              <strong className="text-foreground">{HOST_DJ}</strong> holding down the mic and
              various selectors keeping the dancehall energy going from doors to last call.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Opening night — Friday, September 25, 2026 — ladies are free all night. Every Friday
              after, ladies get in free until midnight with a valid pass, with general admission at
              $20.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Gift className="size-4 text-gold" />
              Special opening night: the first 25 ladies receive a free jerk dinner
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Car className="size-4 text-gold" />
              Free parking on-site
            </div>
          </div>
          <img
            src={flyerImg}
            alt="Dancehall Fridays — Girls Night Out flyer, featuring DJ Bad Chargie"
            className="mx-auto w-full max-w-[320px] rounded-2xl border border-gold/30 object-cover"
          />
        </section>

        {/* Lineup */}
        <section>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Lineup</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border-2 border-gold bg-gold/10 p-5">
              <h3 className="eyebrow mb-3">Host DJ</h3>
              <p className="font-display text-xl font-semibold">{HOST_DJ}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="eyebrow mb-3 flex items-center gap-1.5">
                <Music className="size-3.5 text-gold" /> Music
              </h3>
              <p className="text-sm text-muted-foreground">
                Music by various selectors, presented by Dougiefresh &amp; One Draw Crew
              </p>
            </div>
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
                <p className="text-sm">Every Friday night, starting September 25, 2026</p>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-gold" />
                <p className="text-sm">9:00 PM until late</p>
              </div>
              <div className="flex items-start gap-3">
                <Car className="mt-0.5 size-5 shrink-0 text-gold" />
                <p className="text-sm">Free parking</p>
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

        {/* Entry */}
        <section id="tickets" className="scroll-mt-20">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Entry</h2>
          <div className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive">
            <Gift className="size-4" />
            Opening night: first 25 ladies get a free jerk dinner
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="relative rounded-xl border-2 border-gold bg-gold/10 p-5 text-center shadow-lg shadow-gold/20">
              <p className="eyebrow mb-1">Fri, Sept 25, 2026</p>
              <p className="font-display text-2xl font-extrabold text-gold">
                Ladies Free All Night
              </p>
            </div>
            <div className="rounded-xl border border-gold/30 bg-card p-5 text-center">
              <p className="eyebrow mb-1">Every Friday After</p>
              <p className="font-display text-2xl font-extrabold text-gold">
                Ladies Free Until Midnight
              </p>
              <p className="mt-1 text-xs text-muted-foreground">With a valid pass</p>
            </div>
            <div className="rounded-xl border border-gold/30 bg-card p-5 text-center">
              <p className="eyebrow mb-1">General Admission</p>
              <p className="font-display text-3xl font-extrabold text-gold">$20</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gold/30 bg-card px-6 py-8 text-center">
            <Ticket className="size-6 text-gold" />
            <p className="font-display font-semibold">Ticket outlet link coming soon</p>
            <p className="max-w-md text-sm text-muted-foreground">
              No pre-sale required to attend — walk-ins welcome, doors at 9 PM.
            </p>
          </div>
        </section>

        {/* Share */}
        <section className="rounded-xl border border-border bg-card p-6 text-center">
          <h3 className="eyebrow mb-4 flex items-center justify-center gap-1.5">
            <Share2 className="size-3.5" /> Share Dancehall Fridays
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
