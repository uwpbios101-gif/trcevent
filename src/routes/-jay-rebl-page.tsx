// Shared by src/routes/jay-rebl.tsx. The "-" prefix excludes this file from
// route generation (TanStack Router convention) — see src/routes/README.md.
//
// Jay Rebl's own artist bio page. He's one of the opening acts on the Charly
// Black lineup (see OPENING_ACTS in -charly-black-page.tsx, slug "jay-rebl"
// in -get-started-page.tsx's ACTS) — this is the first opening act to get a
// full page of his own rather than just a roster tile + social row. Bio
// details (hometown, genres, the "music is what I was going to be doing"
// quote) are pulled from his real SoundCloud profile (soundcloud.com/m-f-c-muzic,
// user id 46287578) — don't invent tour dates, releases, or bios beyond what's
// actually on his profiles.
import {
  Instagram,
  Facebook,
  Twitter,
  Music2,
  Guitar,
  Mic2,
  Sliders,
  BookOpen,
  Radio,
  Footprints,
  Flame,
  Mic,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TikTokIcon } from "@/components/site/BrandIcons";
import jayReblImg from "@/assets/opening-act-jayrebl.jpg";

const SITE_URL = "https://trcevent.com";

// Official SoundCloud oEmbed widget for the full track stream (user id
// 46287578) — no per-track slugs to keep in sync, and it stays current as he
// uploads.
const SOUNDCLOUD_WIDGET_SRC =
  "https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Fusers%2F46287578&show_artwork=true";

const SOCIALS = [
  { platform: "Instagram", icon: Instagram, href: "https://www.instagram.com/jayreblmusic" },
  { platform: "TikTok", icon: TikTokIcon, href: "https://www.tiktok.com/@jayrebl" },
  { platform: "X (Twitter)", icon: Twitter, href: "https://x.com/NftsNyoo" },
  {
    platform: "Facebook",
    icon: Facebook,
    href: "https://www.facebook.com/profile.php?id=100093370884541",
  },
  { platform: "SoundCloud", icon: Music2, href: "https://soundcloud.com/m-f-c-muzic" },
];

const GENRES = ["R&B", "Hip Hop", "Reggae", "Soul", "Dancehall", "Christian", "Blues"];

const ROLES = [
  { icon: Mic2, label: "Vocalist" },
  { icon: Guitar, label: "Guitarist" },
  { icon: Sliders, label: "Producer" },
];

// The recurring series concept behind "The Jay RebL Universe" positioning —
// character/world first, songs as the payoff rather than the pitch. None of
// these are live yet, hence "In development" on each card; don't relabel
// them as active or invent episode counts/view numbers until real content
// exists to back that up.
const SERIES = [
  {
    icon: BookOpen,
    title: "Jay RebL Stories",
    description:
      "The real story behind a song, told before you ever hear it — the song is the payoff, not the pitch.",
  },
  {
    icon: Radio,
    title: "Jay RebL Sessions",
    description:
      "Stripped-down, one-take performances — acoustic, studio, and live versions of the same song side by side.",
  },
  {
    icon: Footprints,
    title: "Jay RebL On the Street",
    description:
      "Strangers give one word, one sentence, or one story — Jay turns it into a melody on the spot.",
  },
  {
    icon: Flame,
    title: "Jay RebL Challenges",
    description:
      "The audience finishes the verse, votes on the hook, or helps decide what gets released next.",
  },
  {
    icon: Mic,
    title: "Jay RebL Freestyles",
    description: "No script, no safety net — a beat, a word, and whatever comes out.",
  },
  {
    icon: HelpCircle,
    title: "Jay RebL Asks",
    description:
      "One uncomfortable, funny, or emotional question per episode — some of the answers become songs.",
  },
];

const SELECTED_TRACKS = [
  { title: "Ride or Die", genre: "R&B & Soul", length: "2:42" },
  { title: "Jay Rebl_Cover Me", genre: "Dancehall", length: "3:47" },
  { title: "Need You To Love", genre: "Reggae", length: "4:39" },
  { title: "Jay Rebl Love", genre: "R&B & Soul", length: "2:15" },
  { title: "Jay RebL All-nighter", genre: "Hip-Hop & Rap", length: "3:48" },
  { title: "Jay Rebl_Nobody But You", genre: "R&B & Soul", length: "3:58" },
];

export function jayReblHead() {
  const imageUrl = `${SITE_URL}${jayReblImg}`;
  return {
    meta: [
      { title: "Jay RebL | TRC Events" },
      {
        name: "description",
        content:
          "Jay RebL — R&B/Hip-Hop/Reggae artist, guitarist, and producer from Spanish Town, Jamaica, now based in Evanston/Skokie, Illinois. Stories, sessions, and street sessions, with the music as the payoff. Listen on SoundCloud, follow on Instagram, TikTok, X, and Facebook.",
      },
      { property: "og:title", content: "Jay RebL | TRC Events" },
      {
        property: "og:description",
        content: "Not just an artist — a running story. The music is always where it lands.",
      },
      { property: "og:type", content: "profile" },
      { property: "og:image", content: imageUrl },
      { property: "og:url", content: `${SITE_URL}/jay-rebl` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Jay RebL | TRC Events" },
      { name: "twitter:image", content: imageUrl },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/jay-rebl` }],
  };
}

export function JayReblPage() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "Jay RebL",
    genre: GENRES,
    image: `${SITE_URL}${jayReblImg}`,
    url: `${SITE_URL}/jay-rebl`,
    sameAs: SOCIALS.map((s) => s.href),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      {/* Hero */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-[280px_1fr]">
          <img
            src={jayReblImg}
            alt="Jay RebL"
            className="mx-auto aspect-[4/5] w-full max-w-[280px] rounded-2xl border border-gold/30 object-cover"
          />
          <div className="text-center md:text-left">
            <p className="eyebrow mb-2">Opening act, Charly Black — Good Times</p>
            <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
              Jay <span className="text-gradient-gold">RebL</span>
            </h1>
            <p className="mt-1 font-display text-xl italic text-gradient-gold">
              Not Just an Artist — a Running Story
            </p>
            <p className="mt-3 max-w-lg text-muted-foreground">
              R&amp;B / Hip-Hop / Reggae artist, guitarist, and producer from Spanish Town, Jamaica
              — now based in the Evanston/Skokie area, Illinois. The music is always where the story
              lands, never the opening line.
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
              {ROLES.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                >
                  <Icon className="size-3.5 text-gold" /> {label}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
              <Button asChild variant="gold" size="xl">
                <a href="#listen">
                  <Music2 className="size-4" /> Listen Now
                </a>
              </Button>
              <Button asChild variant="goldOutline" size="xl">
                <a href="#universe">Follow the Story</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-20 px-4 py-16 sm:px-6">
        {/* Universe */}
        <section id="universe" className="scroll-mt-20">
          <p className="eyebrow mb-2">Not "listen to my new song." A running story.</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">The Jay RebL Universe</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            The plan isn't one song, one video. It's a handful of recurring series built around one
            idea: give people a reason to check in on Jay RebL, not just a track to stream. The
            music is always where each story lands — never the opening line.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERIES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-xl border border-border bg-card p-5">
                <Icon className="size-5 text-gold" />
                <h3 className="mt-3 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                <Badge variant="outline" className="mt-4 border-gold/30 text-xs text-gold">
                  In development
                </Badge>
              </div>
            ))}
          </div>
        </section>

        {/* Bio */}
        <section>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">The Story</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Jay RebL has been making music professionally since 2006, moving between R&amp;B, hip
            hop, reggae, soul, dancehall, and gospel without settling into just one lane. In his own
            words: "Can't say exactly when it happened but I just knew music is what I was going to
            be doing for the rest of my life."
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <Badge key={g} variant="outline" className="border-gold/30 text-gold">
                {g}
              </Badge>
            ))}
          </div>
        </section>

        {/* Listen */}
        <section id="listen" className="scroll-mt-20">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Listen</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Full catalog, streaming live from SoundCloud.
          </p>
          <div className="mt-6 overflow-hidden rounded-xl border border-border">
            <iframe
              title="Jay RebL on SoundCloud"
              width="100%"
              height="450"
              scrolling="no"
              frameBorder="no"
              allow="autoplay; encrypted-media"
              src={SOUNDCLOUD_WIDGET_SRC}
            />
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SELECTED_TRACKS.map((track) => (
              <div
                key={track.title}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{track.title}</p>
                  <p className="text-xs text-muted-foreground">{track.genre}</p>
                </div>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {track.length}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button asChild variant="goldOutline" size="lg">
              <a href="https://soundcloud.com/m-f-c-muzic" target="_blank" rel="noreferrer">
                See Full Catalog on SoundCloud
              </a>
            </Button>
          </div>
        </section>

        {/* Connect */}
        <section
          id="connect"
          className="scroll-mt-20 rounded-xl border border-border bg-card p-8 text-center"
        >
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Connect</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Follow along as the series rolls out, and reach out directly on Instagram or Facebook
            for bookings.
          </p>
          <div className="mx-auto mt-6 flex max-w-sm flex-wrap justify-center gap-2">
            {SOCIALS.map(({ platform, icon: Icon, href }) => (
              <a
                key={platform}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={platform}
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-gold hover:text-gold"
              >
                <Icon className="size-4" /> {platform}
              </a>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Currently appearing with{" "}
            <a href="/charly-black" className="font-medium text-gold hover:underline">
              TRC Events' Charly Black lineup
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
