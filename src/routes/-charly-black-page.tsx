// Shared by both src/routes/index.tsx and src/routes/charly-black.tsx — the whole real
// site is currently this one event page, rendered at both "/" and "/charly-black" (no
// runtime redirect, since the static-exported build has no server to redirect at request
// time). The "-" prefix excludes this file from route generation (TanStack Router convention).
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  Ticket,
  Phone,
  UtensilsCrossed,
  Music,
  Instagram,
  Facebook,
  Twitter,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SOCIAL_LINKS } from "@/lib/social";
import heroImg from "@/assets/charly-black-2.jpg";
import portraitImg from "@/assets/charly-black-1.jpg";
import galleryImg from "@/assets/charly-black-3.jpg";
import flyerImgSellout from "@/assets/charly-black-flyer-4-sellout.jpg";
import flyerImgBikeBack from "@/assets/charly-black-flyer-bikeback.jpg";
import flyerImgGirlfriend from "@/assets/charly-black-flyer-girlfriend.jpg";
import flyerImgHoist from "@/assets/charly-black-flyer-hoist.jpg";
import flyerImgPa from "@/assets/charly-black-flyer-pa.jpg";
import flyerImgPartyAnimal from "@/assets/charly-black-flyer-partyanimal.jpg";
import flyerImgWk from "@/assets/charly-black-flyer-wk.jpg";
import flyerImgBuddyB from "@/assets/charly-black-flyer-buddyb.jpg";
import heroVideo from "@/assets/charly-black-hero.mp4";
import heroPoster from "@/assets/charly-black-hero-poster.jpg";

const GALLERY_IMAGES = [portraitImg, heroImg, galleryImg];

// Sellout messaging leads the rotation — it's the most important flyer for the
// marketing plan (limited capacity / urgency), so it's what visitors see first.
const FLYERS = [
  flyerImgSellout,
  flyerImgBikeBack,
  flyerImgGirlfriend,
  flyerImgHoist,
  flyerImgPa,
  flyerImgPartyAnimal,
  flyerImgWk,
  flyerImgBuddyB,
];
const FLYER_DISPLAY_MS = 5000;
const FLYER_FLIP_MS = 700;

const VENUE_NAME = "Bombay Banquet Hall";
const VENUE_ADDRESS = "2448 W. Devon Ave., Chicago, IL 60659";
// Doors 9 PM CDT — parsed as local time like the rest of the app's date helpers.
const EVENT_DATE = new Date("2026-08-28T21:00:00");

// No real listings exist yet for any of the 3 outlets — these are intentionally
// unlinked until Stephen provides the live URLs.
const TICKET_OUTLETS = ["Eventbrite", "Ticket Tailor", "Humanitix"];
const TICKET_TIERS = [
  { tier: "Early Bird", price: "$20" },
  { tier: "Regular", price: "$30" },
  { tier: "Door", price: "$40" },
];

export function charlyBlackHead() {
  return {
    meta: [
      { title: "Charly Black — Good Times | TRC Events" },
      {
        name: "description",
        content:
          "Charly Black's first-ever Chicago performance. Historic Chicago Night, presented by TRC Events — Friday, Aug 28, 2026 at Bombay Banquet Hall.",
      },
      { property: "og:title", content: "Charly Black — Good Times | TRC Events" },
      {
        property: "og:description",
        content: "First-ever Chicago performance. Historic Chicago Night, presented by TRC Events.",
      },
      { property: "og:type", content: "article" },
      { property: "og:image", content: flyerImgSellout },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: flyerImgSellout },
    ],
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
  const remainingMs = useCountdown(EVENT_DATE);
  const totalSeconds = remainingMs == null ? null : Math.floor(remainingMs / 1000);

  const units = [
    { label: "Days", value: totalSeconds == null ? null : Math.floor(totalSeconds / 86400) },
    { label: "Hours", value: totalSeconds == null ? null : Math.floor((totalSeconds % 86400) / 3600) },
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

// Flips through all designed flyers like a card — swaps the image at the
// edge-on midpoint of the rotation so the swap itself is never visible.
function FlyerFlipper() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");

  useEffect(() => {
    const id = setInterval(() => setPhase("out"), FLYER_DISPLAY_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (phase !== "out") return;
    const t = setTimeout(() => {
      setIndex((i) => (i + 1) % FLYERS.length);
      setPhase("in");
    }, FLYER_FLIP_MS / 2);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "in") return;
    const t = setTimeout(() => setPhase("idle"), FLYER_FLIP_MS / 2);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <a
      href={FLYERS[index]}
      target="_blank"
      rel="noreferrer"
      className="block"
      style={{ perspective: "1400px" }}
    >
      <img
        src={FLYERS[index]}
        alt="Charly Black — Good Times official flyer"
        className="aspect-[3/4] w-full rounded-xl border border-gold/30 bg-card object-contain transition-transform ease-in-out"
        style={{
          transform: phase === "out" ? "rotateY(90deg)" : "rotateY(0deg)",
          transitionDuration: `${FLYER_FLIP_MS / 2}ms`,
        }}
      />
    </a>
  );
}

// The 3 stacked photos must match the flyer's rendered height exactly, with zero JS
// (no ResizeObserver/measurement — that was fragile across hydration/prerendering and
// kept regressing). Solved with pure CSS instead, via a fixed aspect-ratio derived
// algebraically from the two things that determine the flyer's height:
//   - the grid gives the flyer column 1.6x the width of the photo column
//     (sm:grid-cols-[1fr_1.6fr]), a ratio that holds at any container width
//   - the flyer itself is a fixed aspect-[3/4] (width:height), so its height is
//     always (flyer column width) * 4/3
// So: photoColumnWidth : flyerHeight = 1 : (1.6 * 4/3) = 1 : 32/15 = 15:32.
// Giving the photo-stack container that exact aspect-ratio makes its height match
// the flyer's height at every breakpoint, with no measurement and no timing
// dependency. (If the column ratio or the flyer's aspect ratio ever changes, this
// 15/32 must be recalculated to match — see the derivation above.)
function Gallery() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-[1fr_1.6fr]">
        <div className="col-span-3 grid grid-cols-3 gap-3 sm:col-span-1 sm:aspect-[15/32] sm:grid-cols-1 sm:grid-rows-3">
          {GALLERY_IMAGES.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setLightbox(src)}
              className="overflow-hidden rounded-xl border border-border transition-colors hover:border-gold/50"
            >
              <img
                src={src}
                alt="Charly Black"
                className="aspect-[4/5] w-full object-cover sm:aspect-auto sm:h-full"
              />
            </button>
          ))}
        </div>
        <div className="col-span-3 sm:col-span-1">
          <FlyerFlipper />
        </div>
      </div>

      <Dialog open={lightbox !== null} onOpenChange={(open) => !open && setLightbox(null)}>
        <DialogContent className="max-w-2xl border-gold/30 bg-background p-2">
          <DialogTitle className="sr-only">Charly Black photo</DialogTitle>
          {lightbox && (
            <img
              src={lightbox}
              alt="Charly Black"
              className="max-h-[80vh] w-full rounded-lg object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function CharlyBlackPage() {
  const mapsSrc = `https://www.google.com/maps?q=${encodeURIComponent(VENUE_ADDRESS)}&output=embed`;

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Charly Black — Good Times",
    startDate: "2026-08-28T21:00:00-05:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: VENUE_NAME,
      address: VENUE_ADDRESS,
    },
    performer: {
      "@type": "MusicGroup",
      name: "Charly Black",
    },
    organizer: {
      "@type": "Organization",
      name: "TRC Events",
      url: "https://trcevent.com",
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
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={heroPoster}
          className="absolute inset-0 h-full w-full object-cover object-top"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="relative mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-16">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            <Badge className="bg-gold text-gold-foreground hover:bg-gold">Historic Chicago Night</Badge>
            <Badge variant="outline" className="border-gold/40 text-gold">
              One Night Only
            </Badge>
            <Badge variant="destructive">Tickets From $20 · Price Rises With Demand</Badge>
          </div>
          <p className="eyebrow mb-2">Presented by TRC Events</p>
          <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
            Charly Black
          </h1>
          <p className="mt-1 font-display text-2xl italic text-gradient-gold sm:text-3xl">
            Good Times
          </p>

          <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4 text-gold" /> Friday, Aug 28, 2026
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4 text-gold" /> Doors 9 PM · Show 10 PM
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 text-gold" /> {VENUE_NAME}
            </span>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild variant="gold" size="xl">
              <a href="#tickets">
                <Ticket className="size-4" /> Get Tickets
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
          <p className="eyebrow mb-6">Doors Open In</p>
          <CountdownStrip />
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-20 px-4 py-16 sm:px-6">
        {/* About */}
        <section className="grid items-center gap-10 md:grid-cols-[1fr_320px]">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">About This Night</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              TRC Events brings dancehall royalty to Chicago for the very first time. Charly Black —
              the voice behind the global anthem "Gyal You A Party Animal" and one of Jamaica's most
              infectious hitmakers — headlines an Historic Chicago Night built for the culture.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Expect his biggest hits live: "Gyal You A Party Animal," "Whine & Kotch," and
              "Girlfriend," with official DJ Bad Chargie holding down the music all night.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Good Times is a celebration: real dancehall energy, a room built for the occasion, and
              a kitchen powered by Jerky Jerk keeping the night fed from doors to last call.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <UtensilsCrossed className="size-4 text-gold" />
              Kitchen powered by{" "}
              <a
                href="https://www.jerkyjerk.net/"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-foreground hover:text-gold hover:underline"
              >
                Jerky Jerk
              </a>
            </div>
          </div>
          <img
            src={portraitImg}
            alt="Charly Black"
            className="mx-auto aspect-[4/5] w-full max-w-[280px] rounded-2xl border border-gold/30 object-cover"
          />
        </section>

        {/* Lineup */}
        <section>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Full Lineup</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="eyebrow mb-3 flex items-center gap-1.5">
                <Music className="size-3.5 text-gold" /> Jamaican Dancehall Selectas
              </h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">DJ Bad Chargie</span>{" "}
                  <span className="text-xs">— official DJ</span>
                </li>
                <li>Matches</li>
                <li>DJ Poyo</li>
                <li>Ghetto Story Sound</li>
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="eyebrow mb-3">Chicago Support</h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>Solid Chain</li>
                <li>Nego Heights</li>
                <li>Krabbit</li>
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="eyebrow mb-3">Sound</h3>
              <p className="text-sm text-muted-foreground">
                Production by <span className="font-medium text-foreground">Q-Ality</span>
              </p>
            </div>
          </div>
        </section>

        {/* Venue */}
        <section id="venue" className="scroll-mt-20">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Venue & Details</h2>
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
                <p className="text-sm">Friday, August 28, 2026</p>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-gold" />
                <p className="text-sm">Doors 9:00 PM · Showtime 10:00 PM</p>
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

        {/* Gallery */}
        <section>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Gallery</h2>
          <div className="mt-6">
            <Gallery />
          </div>
        </section>

        {/* Tickets */}
        <section id="tickets" className="scroll-mt-20">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Get Tickets</h2>
          <div className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive">
            <Ticket className="size-4" />
            Price rises with demand — secure yours at the earliest tier still available.
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {TICKET_TIERS.map(({ tier, price }) => (
              <div key={tier} className="rounded-xl border border-gold/30 bg-card p-5 text-center">
                <p className="eyebrow mb-1">{tier}</p>
                <p className="font-display text-3xl font-extrabold text-gold">{price}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Tickets will be available soon across all three outlets below.
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            {TICKET_OUTLETS.map((outlet) => (
              <div
                key={outlet}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gold/30 bg-card px-6 py-6 text-center"
              >
                <Ticket className="size-5 text-gold" />
                <span className="font-display font-semibold">{outlet}</span>
                <span className="text-xs text-muted-foreground">Link coming soon</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Questions in the meantime?{" "}
            <a href="tel:+14149093279" className="font-medium text-gold hover:underline">
              Call or text 414-909-3279
            </a>
            .
          </p>
        </section>

        {/* Share */}
        <section className="rounded-xl border border-border bg-card p-6 text-center">
          <h3 className="eyebrow mb-4 flex items-center justify-center gap-1.5">
            <Share2 className="size-3.5" /> Share This Historic Night
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
