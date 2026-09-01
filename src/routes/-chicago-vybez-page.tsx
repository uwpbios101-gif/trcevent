// Shared by both src/routes/index.tsx and src/routes/chicago-vybez.tsx, same
// pattern as -charly-black-page.tsx before it: the whole real site is
// rendered at both "/" and "/chicago-vybez" (no runtime redirect, since the
// static-exported build has no server to redirect at request time). The "-"
// prefix excludes this file from route generation (TanStack Router
// convention) — see src/routes/README.md.
//
// Chicago Vybez succeeds Charly Black as the front page event (2026-08-31,
// three days after Charly Black's Aug 28 date passed) — see -past-events-page.tsx
// for where Charly Black and the other now-past one-off events live now.
// Free admission, no ticket outlets, and the venue is genuinely secret until
// attendees text in — don't add a real address anywhere on this page.
import { useEffect, useState } from "react";
import {
  CalendarDays,
  MapPin,
  MessageCircle,
  Phone,
  Music,
  Scissors,
  UtensilsCrossed,
  Instagram,
  Facebook,
  Twitter,
  Share2,
  PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SOCIAL_LINKS } from "@/lib/social";
import heroImg from "@/assets/chicago-vybez-hero.jpg";
import flyer1 from "@/assets/chicago-vybez-flyer-1.jpg";
import flyer2 from "@/assets/chicago-vybez-flyer-2.jpg";
import flyer3 from "@/assets/chicago-vybez-flyer-3.jpg";
import flyerBarber from "@/assets/chicago-vybez-flyer-barber.jpg";
import flyerSound from "@/assets/chicago-vybez-flyer-sound.jpg";
import flyerLineup from "@/assets/chicago-vybez-flyer-lineup.jpg";
import flyerSoiree from "@/assets/chicago-vybez-flyer-soiree.jpg";

const SITE_URL = "https://trcevent.com";
const CONTACT_PHONE_DISPLAY = "414-909-3279";
const CONTACT_TEL = "tel:+14149093279";
const CONTACT_SMS = "sms:+14149093279";

// Labor Day Weekend 2026: Friday through Labor Day itself.
const EVENT_START = new Date("2026-09-04T00:00:00");
const EVENT_DAYS = [
  { day: "Friday", date: "Sept 4" },
  { day: "Saturday", date: "Sept 5" },
  { day: "Sunday", date: "Sept 6" },
  { day: "Monday", date: "Sept 7", holiday: "Labor Day" },
];

// Chicago sound systems called up on the "String Up In The Park" flyer.
const SOUND_SYSTEMS = [
  "Prestige",
  "Q-Ality",
  "One Blood",
  "King Lion",
  "Class One",
  "Rockstone",
  "Stylez International",
  "Tallas",
  "Innovation",
];

// Selectas billed on the "Dancehall Nice Again" flyer, under headline Drifter Sound.
const SELECTAS = [
  "DJ Ringo",
  "Bad Chargie",
  "Dedo High Grade",
  "Boyzie Killa",
  "Tin Man",
  "Matches",
  "Buju",
  "Rye Bread",
  "DJ Poyo",
  "Monatana (Female)",
  "Savvy Lo (Haitian Female)",
  "Nice It Up",
];

const FOOD_VENDORS = ["Jerk Goodness", "Belly Up", "Zeek", "Colin", "Otto"];

const GALLERY_IMAGES = [
  { src: flyer3, alt: "Chicago Vybez — Labor Day Weekend 2026 flyer" },
  { src: flyer1, alt: "Chicago Vybez — Labor Day Weekend 2026 flyer" },
  { src: flyer2, alt: "Chicago Vybez — Labor Day Weekend 2026 flyer" },
  { src: flyerLineup, alt: "Dancehall Nice Again Chicago — Prestige In The Park lineup flyer" },
  { src: flyerSound, alt: "String Up In The Park Chicago — Chicago sound systems flyer" },
  {
    src: flyerBarber,
    alt: "Trim Up In The Park Chicago — Kemar the Barber mobile barbershop flyer",
  },
  { src: flyerSoiree, alt: "End Of Summer Chicago — Labor Day Weekend Soiree flyer" },
];

export function chicagoVybezHead() {
  const imageUrl = `${SITE_URL}${flyer3}`;
  return {
    meta: [
      { title: "Chicago Vybez — Prestige In The Park | TRC Events" },
      {
        name: "description",
        content:
          "Chicago Vybez: Prestige In The Park. Labor Day Weekend 2026, Friday through Monday — free admission, sound systems, good food, fresh cuts. Text 414-909-3279 for the secret location.",
      },
      { property: "og:title", content: "Chicago Vybez — Prestige In The Park | TRC Events" },
      {
        property: "og:description",
        content:
          "Labor Day Weekend 2026, Fri–Mon. Free admission. If yuh know, yuh know — text for the secret location.",
      },
      { property: "og:type", content: "article" },
      { property: "og:image", content: imageUrl },
      { property: "og:url", content: `${SITE_URL}/` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Chicago Vybez — Prestige In The Park | TRC Events" },
      {
        name: "twitter:description",
        content: "Labor Day Weekend 2026, Fri–Mon. Free admission. Text for the secret location.",
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

function Gallery() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {GALLERY_IMAGES.map(({ src, alt }, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setLightbox(src)}
            className="overflow-hidden rounded-xl border border-border transition-colors hover:border-gold/50"
          >
            <img src={src} alt={alt} className="aspect-[2/3] w-full object-cover" />
          </button>
        ))}
      </div>

      <Dialog open={lightbox !== null} onOpenChange={(open) => !open && setLightbox(null)}>
        <DialogContent className="max-w-2xl border-gold/30 bg-background p-2">
          <DialogTitle className="sr-only">Chicago Vybez flyer</DialogTitle>
          {lightbox && (
            <img
              src={lightbox}
              alt="Chicago Vybez"
              className="max-h-[80vh] w-full rounded-lg object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function ChicagoVybezPage() {
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Chicago Vybez — Prestige In The Park",
    startDate: "2026-09-04T00:00:00-05:00",
    endDate: "2026-09-07T23:59:00-05:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    isAccessibleForFree: true,
    image: [`${SITE_URL}${flyer3}`],
    location: {
      "@type": "Place",
      name: "Secret park location — released via text",
      address: "Chicago, IL",
    },
    organizer: {
      "@type": "Organization",
      name: "Prestige Promotion, presented by TRC Events",
      url: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/chicago-vybez#location`,
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
        <img
          src={heroImg}
          alt="Chicago Vybez — Caribbean flags flying over a Labor Day Weekend cookout with the Chicago skyline behind"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="relative mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-16">
          <p className="eyebrow mb-2">Prestige Promotion presents</p>
          <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
            Chicago Vybez
          </h1>
          <p className="mt-1 font-display text-2xl italic text-gradient-gold sm:text-3xl">
            Prestige In The Park
          </p>

          <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4 text-gold" /> Labor Day Weekend · Sept 4–7, 2026
            </span>
            <span className="inline-flex items-center gap-1.5">
              <PartyPopper className="size-4 text-gold" /> Free Admission
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 text-gold" /> Secret location, in the park
            </span>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild variant="gold" size="xl">
              <a href="#location">
                <MessageCircle className="size-4" /> Get the Location
              </a>
            </Button>
            <Button asChild variant="goldOutline" size="xl">
              <a href="#lineup">Who's Playing</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Countdown */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-10 text-center sm:px-6">
          <p className="eyebrow mb-6">Kickoff In</p>
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
        {/* About */}
        <section>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">If Yuh Know, Yuh Know</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Chicago Vybez brings the whole Caribbean diaspora out to the park for four straight days
            of Labor Day Weekend — Jamaica, Haiti, Trinidad &amp; Tobago, Barbados, Belize, the
            Bahamas, Cuba, the Dominican Republic, Guyana, Suriname, Antigua &amp; Barbuda, St.
            Kitts &amp; Nevis, St. Lucia, St. Vincent &amp; the Grenadines, Grenada, Dominica,
            Puerto Rico, and the U.S. and British Virgin Islands, all flying flags side by side.
            Presented by Prestige Promotion, it's free admission every day: sound systems, good
            food, and fresh cuts, all in one spot.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            The catch: the location stays secret until you text in. That's the vybez — real ones
            already know how this works.
          </p>
        </section>

        {/* Sound & Selectas */}
        <section id="lineup" className="scroll-mt-20">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Sound Systems &amp; Selectas
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Headlined by <span className="font-medium text-foreground">Drifter Sound</span>, with
            Chicago's own sound systems stringing up in the park all weekend.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="eyebrow mb-3 flex items-center gap-1.5">
                <Music className="size-3.5 text-gold" /> Sound Systems
              </h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                {SOUND_SYSTEMS.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="eyebrow mb-3 flex items-center gap-1.5">
                <Music className="size-3.5 text-gold" /> Selectas
              </h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                {SELECTAS.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Fresh Cuts */}
        <section>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Fresh Cuts</h2>
          <div className="mt-6 grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="flex items-center gap-2 font-display text-xl font-semibold">
                <Scissors className="size-5 text-gold" /> Kemar the Barber — Mobile Barbershop
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Fresh cut. Clean fade. Ready fi di dance. Kemar's mobile barbershop bus rolls
                through the park all weekend for touch-ups between sets.
              </p>
            </div>
            <img
              src={flyerBarber}
              alt="Kemar the Barber — mobile barbershop bus"
              className="aspect-[2/3] w-full rounded-xl border border-gold/30 object-cover"
            />
          </div>
        </section>

        {/* Food */}
        <section>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Good Food</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
            {FOOD_VENDORS.map((name) => (
              <div
                key={name}
                className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-5 text-center"
              >
                <UtensilsCrossed className="size-5 text-gold" />
                <span className="text-sm font-medium">{name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Location */}
        <section id="location" className="scroll-mt-20">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Get the Location</h2>
          <div className="mt-6 rounded-xl border border-gold/40 bg-card p-8 text-center">
            <MapPin className="mx-auto size-8 text-gold" />
            <p className="mt-4 text-lg font-medium">
              The spot is secret — released to your phone, not posted online.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Text or call {CONTACT_PHONE_DISPLAY} and we'll send it over.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild variant="gold" size="xl">
                <a href={CONTACT_SMS}>
                  <MessageCircle className="size-4" /> Text {CONTACT_PHONE_DISPLAY}
                </a>
              </Button>
              <Button asChild variant="goldOutline" size="xl">
                <a href={CONTACT_TEL}>
                  <Phone className="size-4" /> Call
                </a>
              </Button>
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

        {/* Share */}
        <section className="rounded-xl border border-border bg-card p-6 text-center">
          <h3 className="eyebrow mb-4 flex items-center justify-center gap-1.5">
            <Share2 className="size-3.5" /> Share Chicago Vybez
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
