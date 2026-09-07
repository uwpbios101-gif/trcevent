// Shared by src/routes/bob-marley-live-forever.tsx. The "-" prefix excludes
// this file from route generation (TanStack Router convention) — see
// src/routes/README.md.
//
// Tribute page for The Wild Hare's "Bob Marley: Live Forever — The Final
// Concert, Recreated Live" (Feb 2027, Jay RebL performing the Sept 23,
// 1980 Stanley Theatre setlist, backed by Indika Reggae Band -- the flyer
// itself bills the backing band as "The Wailers Experience," but the real
// band is Indika, a real Chicago reggae institution since the mid-1990s
// with its own page at selassiefest.com/main-stage/indika-reggae-band.html
// -- they've previously played The Wild Hare and backed reggae legends
// including Gregory Isaacs, Luciano, Richie Spice, and Calypso Rose, per
// that page). Two real historical artifacts are used as photos: a Stanley
// Theatre backstage pass (that actual night) and a Crystal Palace Bowl
// ticket stub (June 7, 1980, same Uprising tour, his last-ever London
// show).
//
// Every historical claim below was verified against real sources before
// writing, not recalled from memory alone -- notably: Marley collapsed
// jogging in Central Park on Sept 21, 1980 (two days BEFORE Pittsburgh, not
// after) after playing Madison Square Garden; doctors found the 1977
// melanoma had metastasized and told him to cancel the tour; he flew to
// Pittsburgh anyway. Sept 23, 1980 at the Stanley Theatre was his last-ever
// live performance, closing on "Get Up, Stand Up." The 20-song setlist on
// the flyer matches the real posthumous live album "Live Forever:
// September 23, 1980 • Stanley Theatre • Pittsburgh, PA" (released Feb
// 2011) almost exactly (the album additionally opens with a ~30-second
// spoken "Greetings" intro the flyer omits). He died May 11, 1981, in
// Miami. The flyer gives the show's date as Saturday, February 6, 2027 --
// Bob Marley's actual birthday (Feb 6, 1945, verified earlier). Feb 6,
// 2027 does fall on a Saturday, confirmed independently by date
// arithmetic, not just trusted from the image. No exact showtime is
// given, so that stays marked TBD rather than invented.
import { CalendarDays, MapPin, Ticket, Share2, Instagram, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JayReblSubNav } from "@/components/site/JayReblSubNav";
import { SOCIAL_LINKS } from "@/lib/social";
import flyerImg from "@/assets/bob-marley-live-forever-flyer.jpg";
import backstagePassImg from "@/assets/bob-marley-stanley-theatre-backstage-pass.jpg";
import crystalPalaceTicketImg from "@/assets/bob-marley-crystal-palace-ticket-1980.jpg";

const SITE_URL = "https://trcevent.com";
const VENUE_NAME = "The Wild Hare";
const VENUE_ADDRESS = "2157 W North Ave, Chicago, IL";

const SETLIST = [
  "Natural Mystic",
  "Positive Vibration",
  "Burnin' and Lootin'",
  "Them Belly Full",
  "The Heathen",
  "Running Away",
  "Crazy Baldhead",
  "War / No More Trouble",
  "Zimbabwe",
  "Zion Train",
  "No Woman, No Cry",
  "Jamming",
  "Exodus",
];

const ENCORES = [
  "Redemption Song",
  "Coming in from the Cold",
  "Could You Be Loved",
  "Is This Love",
  "Work",
  "Get Up, Stand Up",
];

// The real 11-piece configuration onstage Sept 23, 1980: Marley, 7 members of
// The Wailers, and the 3 I Threes vocalists. Jay RebL is confirmed for the
// Marley role; the other ten chairs go to Indika Reggae Band, with specific
// member-to-role assignments still TBD.
const LINEUP = [
  {
    section: "Frontman",
    role: "Lead Vocals & Rhythm Guitar",
    original: "Bob Marley",
    cast: "Jay RebL",
    confirmed: true,
  },
  {
    section: "The Wailers",
    role: "Bass Guitar",
    original: 'Aston "Family Man" Barrett',
    cast: "Indika Reggae Band",
    confirmed: false,
  },
  {
    section: "The Wailers",
    role: "Drums",
    original: 'Carlton "Carly" Barrett',
    cast: "Indika Reggae Band",
    confirmed: false,
  },
  {
    section: "The Wailers",
    role: "Percussion",
    original: 'Alvin "Seeco" Patterson',
    cast: "Indika Reggae Band",
    confirmed: false,
  },
  {
    section: "The Wailers",
    role: "Lead Guitar / Backing Vocals",
    original: "Junior Marvin",
    cast: "Indika Reggae Band",
    confirmed: false,
  },
  {
    section: "The Wailers",
    role: "Lead Guitar",
    original: "Al Anderson",
    cast: "Indika Reggae Band",
    confirmed: false,
  },
  {
    section: "The Wailers",
    role: "Keyboards / Piano / Backing Vocals",
    original: "Tyrone Downie",
    cast: "Indika Reggae Band",
    confirmed: false,
  },
  {
    section: "The Wailers",
    role: "Keyboards / Organ",
    original: 'Earl "Wya" Lindo',
    cast: "Indika Reggae Band",
    confirmed: false,
  },
  {
    section: "The I Threes",
    role: "Backing Vocals",
    original: "Rita Marley",
    cast: "Indika Reggae Band",
    confirmed: false,
  },
  {
    section: "The I Threes",
    role: "Backing Vocals",
    original: "Judy Mowatt",
    cast: "Indika Reggae Band",
    confirmed: false,
  },
  {
    section: "The I Threes",
    role: "Backing Vocals",
    original: "Marcia Griffiths",
    cast: "Indika Reggae Band",
    confirmed: false,
  },
] as const;

export function bobMarleyLiveForeverHead() {
  const imageUrl = `${SITE_URL}${flyerImg}`;
  return {
    meta: [
      { title: "Bob Marley: Live Forever — The Final Concert, Recreated Live | TRC Events" },
      {
        name: "description",
        content:
          "The Wild Hare presents Bob Marley: Live Forever — Jay RebL, backed by Chicago's Indika Reggae Band, performs the complete 20-song setlist from Bob Marley's actual final concert, September 23, 1980, Stanley Theatre, Pittsburgh. February 2027, Chicago.",
      },
      {
        property: "og:title",
        content: "Bob Marley: Live Forever — The Final Concert, Recreated Live",
      },
      {
        property: "og:description",
        content:
          "The complete 1980 Stanley Theatre setlist, performed live by Jay RebL and Indika Reggae Band at The Wild Hare, Chicago. February 2027.",
      },
      { property: "og:type", content: "article" },
      { property: "og:image", content: imageUrl },
      { property: "og:url", content: `${SITE_URL}/bob-marley-live-forever` },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Bob Marley: Live Forever — The Final Concert, Recreated Live",
      },
      { name: "twitter:image", content: imageUrl },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/bob-marley-live-forever` }],
  };
}

export function BobMarleyLiveForeverPage() {
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: "Bob Marley: Live Forever — The Final Concert, Recreated Live",
    startDate: "2027-02-06",
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
      name: "The Wild Hare",
    },
    performer: [
      { "@type": "MusicGroup", name: "Jay RebL" },
      { "@type": "MusicGroup", name: "Indika Reggae Band" },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      <JayReblSubNav />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <p className="eyebrow mb-2">The Wild Hare — Chicago's Reggae Capital, presents</p>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
            Bob Marley: <span className="text-gradient-gold">Live Forever</span>
          </h1>
          <p className="mt-2 font-display text-xl italic text-gradient-gold sm:text-2xl">
            The Final Concert — Recreated Live
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            The complete 20-song setlist from Bob Marley's actual final concert — September 23,
            1980, the Stanley Theatre, Pittsburgh — performed live, start to finish, by Jay RebL,
            backed by Indika Reggae Band.
          </p>

          <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4 text-gold" /> Saturday, February 6, 2027
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 text-gold" /> {VENUE_NAME}, Chicago
            </span>
          </div>
          <div className="mt-3 flex justify-center">
            <Badge variant="outline" className="border-gold/40 text-xs text-gold">
              Bob Marley's Birthday Celebration — showtime TBD, check thewildhare.com
            </Badge>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild variant="gold" size="xl">
              <a href="#story">Read the Story</a>
            </Button>
            <Button asChild variant="goldOutline" size="xl">
              <a href="#setlist">See the Setlist</a>
            </Button>
            <Button asChild variant="goldOutline" size="xl">
              <a href="#lineup">See the Lineup</a>
            </Button>
          </div>

          <img
            src={flyerImg}
            alt="Bob Marley: Live Forever — The Final Concert, Recreated Live. The Wild Hare Chicago presents Jay RebL & The Wailers Experience performing the complete 1980 Pittsburgh concert setlist. Saturday, February 6, 2027, Bob Marley's Birthday Celebration."
            className="mx-auto mt-10 w-full max-w-sm rounded-2xl border border-gold/30 shadow-[0_0_60px_-15px_var(--color-gold)]"
          />
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-20 px-4 py-16 sm:px-6">
        {/* The Story */}
        <section id="story" className="scroll-mt-20">
          <p className="eyebrow mb-2">What Actually Happened</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            The Last Night He Ever Played
          </h2>

          <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Two nights before Pittsburgh, Bob Marley collapsed while jogging through Central Park.
              He'd just played Madison Square Garden, co-headlining with the Commodores, finishing
              the U.S. leg of his <em>Uprising</em> tour. Doctors found what a 1977 diagnosis had
              already warned was possible: the melanoma had metastasized throughout his body. They
              told him to cancel the tour immediately.
            </p>
            <p>He flew to Pittsburgh anyway.</p>
            <p>
              On September 23, 1980, at the Stanley Theatre, Bob Marley walked onstage one more
              time. Nobody in that room knew it, but they were watching the last full concert he
              would ever play — twenty songs, closing on{" "}
              <strong className="text-foreground">"Get Up, Stand Up."</strong> He never performed
              live again. He died eight months later, on May 11, 1981, in Miami, at 36.
            </p>
          </div>

          <figure className="mt-8">
            <div className="mx-auto max-w-xs overflow-hidden rounded-2xl border-2 border-gold/40 bg-card p-3 shadow-[0_0_40px_-12px_var(--color-gold)]">
              <img
                src={backstagePassImg}
                alt="A real backstage pass from the Stanley Theatre, hand-stamped SEP 23 '80 — the night of Bob Marley's final concert"
                className="w-full rounded-lg"
              />
            </div>
            <figcaption className="mx-auto mt-3 max-w-sm text-center text-xs text-muted-foreground">
              A real backstage pass from that night — Stanley Theatre, hand-stamped{" "}
              <span className="font-mono">SEP 23 '80</span>.
            </figcaption>
          </figure>

          <p className="mt-8 leading-relaxed text-muted-foreground">
            The setlist below is real — the same set the Marley estate released in 2011 as the live
            album <em>Live Forever: September 23, 1980 • Stanley Theatre • Pittsburgh, PA</em>,
            recorded at that actual show. This isn't a set someone imagined he might have played.
            This is the set he played.
          </p>
        </section>

        {/* Setlist */}
        <section id="setlist" className="scroll-mt-20">
          <p className="eyebrow mb-2">September 23, 1980 — Stanley Theatre</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">The Setlist</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold">
                The Set
              </h3>
              <ol className="space-y-2">
                {SETLIST.map((song, i) => (
                  <li key={song} className="flex gap-3 text-sm">
                    <span className="font-mono text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{song}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold">
                Encores
              </h3>
              <ol className="space-y-2">
                {ENCORES.map((song, i) => {
                  const isLast = i === ENCORES.length - 1;
                  return (
                    <li
                      key={song}
                      className={
                        isLast
                          ? "flex gap-3 rounded-lg border border-gold/40 bg-gold/10 p-2 text-sm font-semibold"
                          : "flex gap-3 text-sm"
                      }
                    >
                      <span className="font-mono text-muted-foreground">
                        {String(i + SETLIST.length + 1).padStart(2, "0")}
                      </span>
                      <span>{song}</span>
                    </li>
                  );
                })}
              </ol>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                "Get Up, Stand Up" was the last song Bob Marley ever performed live.
              </p>
            </div>
          </div>
        </section>

        {/* Same tour */}
        <section>
          <p className="eyebrow mb-2">Earlier That Same Tour</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">One Last London Night</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Three and a half months earlier, on June 7, 1980, Bob Marley and The Wailers played
            Crystal Palace Bowl in London to a reported crowd of around 30,000 — the largest a
            reggae concert had ever drawn in the UK, and the last time Bob Marley ever performed in
            London. Same tour, same year — a different ending waiting on the other side of the
            summer.
          </p>
          <figure className="mt-8">
            <div className="mx-auto max-w-xs overflow-hidden rounded-2xl border border-border bg-card p-3">
              <img
                src={crystalPalaceTicketImg}
                alt="A real ticket stub from Bob Marley and The Wailers at Crystal Palace Bowl, London, Saturday 7th June 1980"
                className="w-full rounded-lg"
              />
            </div>
            <figcaption className="mx-auto mt-3 max-w-sm text-center text-xs text-muted-foreground">
              A real ticket stub — Crystal Palace Bowl, London, Saturday 7th June 1980.
            </figcaption>
          </figure>
        </section>

        {/* The Lineup */}
        <section id="lineup" className="scroll-mt-20">
          <p className="eyebrow mb-2">Eleven Musicians, Then and Now</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">The Lineup</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            It wasn't a solo turn. Eleven musicians shared that Stanley Theatre stage: Marley
            himself, seven members of The Wailers, and the three vocalists of The I Threes. The
            Chicago recreation is built to match that same eleven-piece configuration, role for
            role.
          </p>

          {/* Mobile: stacked cards (avoids horizontal-scrolling the cast column out of view) */}
          <div className="mt-6 space-y-3 sm:hidden">
            {LINEUP.map((row, i) => {
              const isNewSection = i === 0 || LINEUP[i - 1].section !== row.section;
              return (
                <div key={row.role + row.original}>
                  {isNewSection && (
                    <p className="mb-2 mt-5 text-[10px] font-semibold uppercase tracking-wider text-gold first:mt-0">
                      {row.section}
                    </p>
                  )}
                  <div className="rounded-xl border border-border bg-card p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {row.role}
                    </p>
                    <p className="mt-2 text-sm">
                      <span className="text-muted-foreground">1980: </span>
                      <span className="font-medium">{row.original}</span>
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-sm">
                      <span className="text-muted-foreground">2027: </span>
                      {row.confirmed ? (
                        <span className="font-semibold text-gold">{row.cast}</span>
                      ) : (
                        <>
                          <span>{row.cast}</span>
                          <Badge variant="outline" className="border-gold/40 text-[10px] text-gold">
                            Member TBD
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop/tablet: full comparison table */}
          <div className="mt-6 hidden sm:block">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 pr-4 font-semibold">Role</th>
                  <th className="py-2 pr-4 font-semibold">Sept 23, 1980 — Stanley Theatre</th>
                  <th className="py-2 font-semibold">Feb 6, 2027 — The Wild Hare</th>
                </tr>
              </thead>
              <tbody>
                {LINEUP.map((row, i) => {
                  const isNewSection = i === 0 || LINEUP[i - 1].section !== row.section;
                  return (
                    <tr
                      key={row.role + row.original}
                      className="border-b border-border/50 align-top"
                    >
                      <td className="py-3 pr-4">
                        {isNewSection && (
                          <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-gold">
                            {row.section}
                          </span>
                        )}
                        <span className="text-muted-foreground">{row.role}</span>
                      </td>
                      <td className="py-3 pr-4 font-medium">{row.original}</td>
                      <td className="py-3">
                        {row.confirmed ? (
                          <span className="font-semibold text-gold">{row.cast}</span>
                        ) : (
                          <div className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
                            {row.cast}
                            <Badge
                              variant="outline"
                              className="border-gold/40 text-[10px] text-gold"
                            >
                              Member TBD
                            </Badge>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Jay RebL takes the Bob Marley role — confirmed. The other ten chairs, covering Wailers
            instrumentation and I Threes harmonies, are filled by Indika Reggae Band; which member
            plays which part is still being finalized and will be announced closer to the date.
          </p>
        </section>

        {/* The Recreation */}
        <section className="rounded-2xl border border-gold/30 bg-card p-6 sm:p-8">
          <p className="eyebrow mb-2">Forty-Seven Years Later</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            The Recreation — Chicago, Feb 6, 2027
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            The Wild Hare — Chicago's reggae capital — is bringing that final set back to the stage.
            Jay RebL, backed by Chicago's own Indika Reggae Band (billed on the flyer as "The
            Wailers Experience"), performs the complete 20-song Stanley Theatre setlist start to
            finish, as part of the Wild Hare's Bob Marley Birthday Celebration — timed to Bob
            Marley's actual birthday.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Indika is no stranger to this stage or this material: a Chicago reggae institution since
            the mid-1990s, they've played The Wild Hare before and have served as backing band for
            reggae legends including Gregory Isaacs, Luciano, Richie Spice, and Calypso Rose.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
              <MapPin className="mt-0.5 size-5 shrink-0 text-gold" />
              <div>
                <p className="font-semibold">{VENUE_NAME}</p>
                <p className="text-sm text-muted-foreground">{VENUE_ADDRESS}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
              <Ticket className="mt-0.5 size-5 shrink-0 text-gold" />
              <div>
                <p className="font-semibold">Tickets</p>
                <p className="text-sm text-muted-foreground">
                  Per the flyer: on sale now at thewildhare.com. Exact showtime not yet posted —
                  check the venue directly before making plans.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="goldOutline" size="lg">
              <a href="/jay-rebl">Meet Jay RebL</a>
            </Button>
            <Button asChild variant="goldOutline" size="lg">
              <a
                href="https://selassiefest.com/main-stage/indika-reggae-band.html"
                target="_blank"
                rel="noreferrer"
              >
                Meet Indika Reggae Band
              </a>
            </Button>
          </div>

          <p className="mt-6 font-display italic text-gradient-gold">
            One Love. One Heart. One People.
          </p>
        </section>

        {/* Share */}
        <section className="rounded-xl border border-border bg-card p-6 text-center">
          <h3 className="eyebrow mb-4 flex items-center justify-center gap-1.5">
            <Share2 className="size-3.5" /> Share This
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
