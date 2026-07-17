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
  Music2,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Globe,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { TikTokIcon } from "@/components/site/BrandIcons";
import { SOCIAL_LINKS } from "@/lib/social";
import heroImg from "@/assets/charly-black-2.jpg";
import portraitImg from "@/assets/charly-black-1.jpg";
import galleryImg from "@/assets/charly-black-3.jpg";
import flyerImgHoist from "@/assets/charly-black-flyer-hoist.jpg";
import flyerImgPartyAnimal from "@/assets/charly-black-flyer-partyanimal.jpg";
import flyerImgBuddyB from "@/assets/charly-black-flyer-buddyb.jpg";
import heroVideo from "@/assets/charly-black-hero.mp4";
import heroPoster from "@/assets/charly-black-hero-poster.jpg";
import krabbitImg from "@/assets/opening-act-krabbit.jpg";
import honeztyImg from "@/assets/opening-act-honezty.jpg";
import jayReblImg from "@/assets/opening-act-jayrebl.jpg";
import negoHeightsImg from "@/assets/opening-act-nego-heights.jpg";
import solidShaneImg from "@/assets/opening-act-solid-shane.jpg";

// Only add a `social` entry once a link is actually confirmed -- acts
// without one yet (Krabbit, Solid Shane) just show no icon row at all.
const OPENING_ACTS = [
  { name: "Krabbit", img: krabbitImg, social: [] },
  {
    name: "Honezty",
    img: honeztyImg,
    social: [
      { platform: "TikTok", icon: TikTokIcon, href: "https://www.tiktok.com/@officialhonezty" },
      { platform: "YouTube", icon: Youtube, href: "https://www.youtube.com/@mbhonesty" },
      {
        platform: "Spotify",
        icon: Music2,
        href: "https://open.spotify.com/album/0oHSlmXvnRdz6llLyDIShj",
      },
    ],
  },
  {
    name: "Jay Rebl",
    img: jayReblImg,
    social: [
      { platform: "TikTok", icon: TikTokIcon, href: "https://www.tiktok.com/@jayrebl" },
      { platform: "SoundCloud", icon: Music2, href: "https://soundcloud.com/m-f-c-muzic" },
      { platform: "Instagram", icon: Instagram, href: "https://www.instagram.com/jayreblmusic" },
    ],
  },
  {
    name: "Nego Hights",
    img: negoHeightsImg,
    social: [
      { platform: "TikTok", icon: TikTokIcon, href: "https://www.tiktok.com/@negohights" },
      { platform: "YouTube", icon: Youtube, href: "https://youtube.com/@negohights" },
      { platform: "Instagram", icon: Instagram, href: "https://www.instagram.com/negohights" },
      { platform: "Facebook", icon: Facebook, href: "https://www.facebook.com/share/1EPrrZEyBE/" },
      { platform: "Website", icon: Globe, href: "https://www.negohightsmusic.com/" },
    ],
  },
  { name: "Solid Shane", img: solidShaneImg, social: [] },
];

const GALLERY_IMAGES = [portraitImg, heroImg, galleryImg];

// Only the 3 designs confirmed correct for the Aug 28 date (2026-07-13) — the
// rest (bikeback, girlfriend, pa, wk, the old sellout) were dropped because
// they either still showed the old Aug 16 date or had no updated version at
// all. A new sellout-style flyer (with ticket tiers baked in) is expected but
// not yet saved anywhere — add it back in and restore it to the front of this
// array once it exists (it's the highest-priority design for the marketing
// plan). All 3 current designs also still show the old 8PM/9PM doors/showtime
// rather than the corrected 9PM/10PM — kept anyway per Stephen's call, since a
// stale time on a flyer beats no rotation at all.
const FLYERS = [flyerImgBuddyB, flyerImgHoist, flyerImgPartyAnimal];
const FLYER_DISPLAY_MS = 5000;
const FLYER_FLIP_MS = 700;

const SITE_URL = "https://trcevent.com";
const VENUE_NAME = "Bombay Banquet Hall";
const VENUE_ADDRESS = "2448 W. Devon Ave., Chicago, IL 60659";
// Doors 9 PM CDT — parsed as local time like the rest of the app's date helpers.
const EVENT_DATE = new Date("2026-08-28T21:00:00");

// Ticket Tailor and Eventbrite are live as of 2026-07-14; Humanitix is still
// intentionally unlinked until Stephen provides that live URL.
const TICKET_OUTLETS = [
  {
    name: "Eventbrite",
    href: "https://www.eventbrite.com/e/charly-black-live-in-concert-tickets-1993889106993?aff=oddtdtcreator",
  },
  { name: "Ticket Tailor", href: "https://www.tickettailor.com/events/rastafariinc/2311433" },
  { name: "Humanitix", href: null },
];
// `active` marks whichever tier is currently on sale — move it forward (and
// flip the previous tier to false) once Early Bird sells out and Regular
// becomes the live price.
const TICKET_TIERS = [
  { tier: "Early Bird", price: "$20", active: true },
  { tier: "Regular", price: "$30", active: false },
  { tier: "Door", price: "$40", active: false },
];

export function charlyBlackHead() {
  const imageUrl = `${SITE_URL}${flyerImgBuddyB}`;
  return {
    meta: [
      { title: "Charly Black — Good Times | TRC Events" },
      {
        name: "description",
        content:
          "Charly Black live in Chicago, one night only. Historic Chicago Night, presented by TRC Events — Friday, Aug 28, 2026 at Bombay Banquet Hall. Tickets from $20.",
      },
      { property: "og:title", content: "Charly Black — Good Times | TRC Events" },
      {
        property: "og:description",
        content:
          "One night only. Historic Chicago Night, presented by TRC Events. Tickets from $20.",
      },
      { property: "og:type", content: "article" },
      { property: "og:image", content: imageUrl },
      { property: "og:url", content: `${SITE_URL}/` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Charly Black — Good Times | TRC Events" },
      {
        name: "twitter:description",
        content:
          "One night only. Historic Chicago Night, presented by TRC Events. Tickets from $20.",
      },
      { name: "twitter:image", content: imageUrl },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
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

// Own lightbox state, same pattern as Gallery above but separate -- these
// are promo flyers to browse, not photos to page through together.
function OpeningActs() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {OPENING_ACTS.map((act) => (
          <div
            key={act.name}
            className="overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-gold/50"
          >
            <button
              type="button"
              onClick={() => act.img && setLightbox(act.img)}
              disabled={!act.img}
              className="group block w-full text-left disabled:cursor-default"
            >
              <div className="aspect-[4/5] w-full overflow-hidden bg-muted">
                {act.img ? (
                  <img
                    src={act.img}
                    alt={`${act.name} — Charly Black opening act flyer`}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-3 text-center text-xs text-muted-foreground">
                    Flyer coming soon
                  </div>
                )}
              </div>
            </button>
            <div className="p-2 text-center">
              <p className="text-sm font-medium">{act.name}</p>
              {act.social.length > 0 && (
                <div className="mt-1.5 flex items-center justify-center gap-2">
                  {act.social.map(({ platform, icon: Icon, href }) => (
                    <a
                      key={platform}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${act.name} on ${platform}`}
                      className="text-muted-foreground transition-colors hover:text-gold"
                    >
                      <Icon className="size-3.5" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={lightbox !== null} onOpenChange={(open) => !open && setLightbox(null)}>
        <DialogContent className="max-w-2xl border-gold/30 bg-background p-2">
          <DialogTitle className="sr-only">Opening act flyer</DialogTitle>
          {lightbox && (
            <img
              src={lightbox}
              alt="Opening act flyer"
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
    image: [`${SITE_URL}${flyerImgBuddyB}`],
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
      url: SITE_URL,
    },
    offers: {
      "@type": "AggregateOffer",
      url: `${SITE_URL}/charly-black#tickets`,
      priceCurrency: "USD",
      lowPrice: "20",
      highPrice: "40",
      offerCount: "3",
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
            <Badge className="bg-gold text-gold-foreground hover:bg-gold">
              Historic Chicago Night
            </Badge>
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
                <li>Solid Shane</li>
                <li>Nego Hights</li>
                <li>Krabbit</li>
                <li>Honezty</li>
                <li>Jay Rebl</li>
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

        {/* Opening Acts */}
        <section>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Opening Acts</h2>
          <div className="mt-6">
            <OpeningActs />
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
            {TICKET_TIERS.map(({ tier, price, active }) => (
              <div
                key={tier}
                className={
                  active
                    ? "relative rounded-xl border-2 border-gold bg-gold/10 p-5 text-center shadow-lg shadow-gold/20"
                    : "rounded-xl border border-gold/30 bg-card p-5 text-center"
                }
              >
                {active && (
                  <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-gold-foreground">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold-foreground/60" />
                      <span className="relative inline-flex size-2 rounded-full bg-gold-foreground" />
                    </span>
                    On Sale Now
                  </span>
                )}
                <p className="eyebrow mb-1">{tier}</p>
                <p className="font-display text-3xl font-extrabold text-gold">{price}</p>
                {active && (
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    Lowest price — grab it before it's gone
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {TICKET_OUTLETS.map(({ name, href }) =>
              href ? (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gold/40 bg-card px-6 py-6 text-center transition-colors hover:border-gold hover:bg-gold/5"
                >
                  <Ticket className="size-5 text-gold" />
                  <span className="font-display font-semibold">{name}</span>
                  <span className="text-xs font-medium text-gold">Buy Tickets →</span>
                </a>
              ) : (
                <div
                  key={name}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gold/30 bg-card px-6 py-6 text-center"
                >
                  <Ticket className="size-5 text-gold" />
                  <span className="font-display font-semibold">{name}</span>
                  <span className="text-xs text-muted-foreground">Link coming soon</span>
                </div>
              ),
            )}
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
