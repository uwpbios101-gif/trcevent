// Shared by src/routes/jay-rebl_.riddim-vault.tsx. The "-" prefix excludes
// this file from route generation (TanStack Router convention) — see
// src/routes/README.md.
//
// A songwriting reference for Jay RebL: the "first 20" foundational
// dancehall riddims, tabulated so a writer can pick one and know its era,
// its iconic cuts, and how it fits the genre's timeline. Several of these
// are actually reggae/rocksteady riddims that were later absorbed into
// dancehall rather than being dancehall riddims from the start — keep that
// distinction (era + note per row) rather than flattening it back into "the
// first 20 dancehall riddims." The "Essential 10" curriculum subset and the
// Studio One → digital-dancehall progression are the user's own framing —
// don't add rows or reorder the progression without new source input.
// "Song status" starts at "Not started" for every row — don't invent
// progress or drafts that don't exist yet.
import { ArrowRight, Music2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SITE_URL = "https://trcevent.com";

const RIDDIMS = [
  {
    n: 1,
    name: "Real Rock",
    era: "1967–68",
    href: "https://riddim-id.com/riddims/17/real-rock",
    cuts: [
      "Sound Dimension — “Real Rock”",
      "Willie Williams — “Armagideon Time”",
      "Michigan & Smiley — “Nice Up the Dance”",
      "Dennis Brown — “Stop the Fussing and Fighting”",
      "Johnny Osbourne — “Lend Me the 16”",
      "Tenor Saw — “Ring the Alarm”",
      "Bounty Killer — “Roots, Reality & Culture”",
    ],
    note: "One of the most-versioned riddims in Jamaican music history — a rocksteady root endlessly recut into dancehall.",
    essential: true,
  },
  {
    n: 2,
    name: "Heavenless",
    era: "1968",
    href: "https://www.dancehallreggaeworld.com/heavenless-riddim.html",
    cuts: [
      "Johnny Osbourne — “Rock It Tonight”",
      "Cocoa Tea — “Crying Time”",
      "Pinchers — “For Your Eyes Only”",
      "Little Twitch — “Spanish Fly”",
      "Sizzla — “Big Up Di Girls Dem”",
      "Bounty Killer — “We Burn the Highest”",
    ],
    note: "A Studio One-era foundation still being recut generations later, straight through to Sizzla and Bounty Killer.",
    essential: true,
  },
  {
    n: 3,
    name: "Swing Easy",
    era: "1968",
    cuts: [
      "The Soul Brothers — “Swing Easy”",
      "Alton Ellis — “Girl I've Got a Date”",
      "Various Studio One deejay versions",
    ],
    note: "A Studio One foundation — more accurately a reggae/rocksteady ancestor of dancehall than a dancehall riddim itself.",
  },
  {
    n: 4,
    name: "Nanny Goat",
    era: "1968",
    cuts: [
      "Larry Marshall — “Nanny Goat”",
      "The Heptones — versions on the Studio One rhythm",
      "Later dancehall/deejay versions",
    ],
    note: "Another Studio One rhythm that became part of Jamaica's reusable riddim vocabulary.",
  },
  {
    n: 5,
    name: "Cuss Cuss",
    era: "1969",
    cuts: [
      "Lloyd Robinson — “Cuss Cuss”",
      "Horace Andy — “Cuss Cuss”",
      "Luciano — later versions",
      "Various roots and dancehall deejay versions",
    ],
    note: "The bass line became so recognizable it was repeatedly rebuilt across roots and dancehall alike.",
    essential: true,
  },
  {
    n: 6,
    name: "Drum Song",
    era: "1969",
    cuts: ["Jackie Mittoo — “Drum Song”", "Horace Andy — versions", "Various roots/dub versions"],
    note: "A major Jackie Mittoo/Studio One rhythm — a bridge between rocksteady, roots, and later dancehall.",
  },
  {
    n: 7,
    name: "Java",
    era: "1972",
    cuts: [
      "Augustus Pablo — “Java”",
      "Augustus Pablo — “Java Dub”",
      "Various roots/deejay versions",
    ],
    note: "Shows how a recognizable instrumental became a reusable riddim in the sound-system tradition.",
  },
  {
    n: 8,
    name: "Stalag",
    era: "1973",
    href: "https://jamaicanmusicatlas.com/entity/riddim/stalag",
    cuts: [
      "Sister Nancy — “Bam Bam”",
      "Tenor Saw — “Ring the Alarm”",
      "General Echo — “Arleen”",
      "Barrington Levy — “Sunday School”",
      "Sugar Minott — “Everybody Got to Know”",
      "Shabba Ranks — “Roots & Culture”",
    ],
    note: "Absolutely essential — “Bam Bam” and “Ring the Alarm” make this one of dancehall's defining riddims.",
    essential: true,
  },
  {
    n: 9,
    name: "Answer",
    era: "1970s",
    cuts: [
      "Lone Ranger — “The Answer”",
      "Various early deejay versions",
      "Early Channel One sound-system cuts",
    ],
    note: "Belongs more to the early rub-a-dub/deejay transition than the later digital dancehall era.",
  },
  {
    n: 10,
    name: "Taxi",
    era: "1975",
    cuts: [
      "Sly & Robbie — “Taxi”",
      "Black Uhuru — “Taxi”",
      "Peter Tosh — “Stepping Razor” (Taxi-associated production)",
      "Various Sly & Robbie productions",
    ],
    note: "Sly & Robbie's bass-and-drum production approach made this hugely influential.",
    essential: true,
  },
  {
    n: 11,
    name: "MPLA",
    era: "1976",
    cuts: [
      "The Revolutionaries — “MPLA”",
      "Early Channel One deejay versions",
      "Various roots/dancehall versions",
    ],
    note: "A major Channel One/Revolutionaries rhythm.",
  },
  {
    n: 12,
    name: "Full Up",
    era: "1968",
    href: "https://riddim-id.com/riddims/74/full-up",
    cuts: [
      "The Sound Dimension — “Full Up”",
      "The Mighty Diamonds — “Pass the Kouchie”",
      "Musical Youth — “Pass the Dutchie”",
      "Yellowman — “Couchie”",
      "Toyan — “Chalice”",
      "Barrington Levy — “Carol”",
      "Half Pint — “Political Fiction”",
    ],
    note: "So closely tied to “Pass the Kouchie” it's often just called the Pass the Kouchie riddim.",
    essential: true,
  },
  {
    n: 13,
    name: "General",
    era: "Late 1970s",
    cuts: ["Early Jamaican deejay versions", "Various Channel One/Volcano sound-system cuts"],
    note: "An early rub-a-dub foundation, not one of the universally recognized canonical riddims.",
  },
  {
    n: 14,
    name: "Death in the Arena",
    era: "Late 1970s",
    cuts: [
      "Johnny Osbourne",
      "Jackie Mittoo/Studio One-associated versions",
      "Early rub-a-dub/deejay versions",
    ],
    note: "Another bridge between roots reggae and the emerging dancehall sound-system culture.",
  },
  {
    n: 15,
    name: "Mad Mad / Diseases",
    era: "1967 → 1981",
    href: "https://en.wikipedia.org/wiki/Yellowman",
    cuts: [
      "Alton Ellis — “Mad, Mad, Mad”",
      "Michigan & Smiley — “Diseases”",
      "Yellowman — “Zungguzungguguzungguzeng”",
      "Various later dancehall versions",
    ],
    note: "Alton Ellis's 1967 original, revived as “Diseases” in 1981, then made globally famous by Yellowman.",
    essential: true,
  },
  {
    n: 16,
    name: "Baltimore",
    era: "Early 1980s",
    cuts: [
      "Early dancehall/deejay versions",
      "Ranking Joe",
      "Various early digital-transition productions",
    ],
    note: "Sits in the period immediately preceding the full digital revolution.",
  },
  {
    n: 17,
    name: "Revolution",
    era: "1983",
    cuts: [
      "Dennis Brown — “Revolution”",
      "Various Revolution riddim versions",
      "Early dancehall/deejay cuts",
    ],
    note: "Representative of the early-1980s transition from roots/rub-a-dub into modern dancehall.",
  },
  {
    n: 18,
    name: "Tempo",
    era: "1985",
    cuts: [
      "Anthony Red Rose — “Tempo”",
      "King Jammy's / Volcano-era versions",
      "Early digital dancehall cuts",
    ],
    note: "Right at the start of the computerized dancehall explosion.",
    essential: true,
  },
  {
    n: 19,
    name: "Sleng Teng",
    era: "1985",
    cuts: [
      "Wayne Smith — “Under Mi Sleng Teng”",
      "Tenor Saw — “Pumpkin Belly”",
      "Nitty Gritty — “Hog in a Minty”",
      "Johnny Osbourne — “Buddy Bye”",
      "Anthony Red Rose — “Tempo”",
      "King Jammy's — numerous digital versions",
    ],
    note: "The big one — computerized production replaced the live band and changed dancehall permanently.",
    essential: true,
    turningPoint: true,
  },
  {
    n: 20,
    name: "Punanny",
    era: "1986",
    href: "https://en.wikipedia.org/wiki/Greensleeves_Rhythm_Album_5:_Punanny",
    cuts: [
      "Admiral Bailey — “Punanny”",
      "Shabba Ranks — “Halla Fi Body”",
      "Shabba Ranks — “Needle Eye Pum Pum”",
      "Major Worries — “Babylon Boops”",
      "Johnny P — “Bike Rack”",
      "Ninjaman — “Border Clash”",
      "Tiger — “Carbon Copy”",
    ],
    note: "One of the defining digital dancehall riddims of the mid-1980s, spawning an enormous number of versions.",
    essential: true,
  },
] as const;

const PROGRESSION = [
  "Studio One",
  "Rocksteady",
  "Roots",
  "Dub",
  "Rub-a-Dub",
  "Early Dancehall",
  "Digital Dancehall",
];

const FOLLOWED_SLENG_TENG = [
  "Punanny",
  "Kuff",
  "Duck Dance",
  "Peanie Peanie",
  "Far East",
  "Cuss Cuss ’86",
];

const SOURCES = [
  { label: "Riddim-ID decade index", href: "https://riddim-id.com/" },
  {
    label: "Afropop on foundational riddims",
    href: "https://www.afropop.org/articles/4-dancehall-diddims-that-rocked",
  },
  {
    label: "Sleng Teng history (The Guardian)",
    href: "https://www.theguardian.com/music/2014/feb/20/wayne-smith-sleng-teng-revolutionised-dancehall-reggae",
  },
];

export function riddimVaultHead() {
  return {
    meta: [
      { title: "The Riddim Vault — Jay RebL's Songwriting Reference | TRC Events" },
      {
        name: "description",
        content:
          "The first 20 foundational dancehall riddims, chronologically tabulated with era, iconic cuts, and context — a working reference for writing new songs on top of them.",
      },
      { property: "og:title", content: "The Riddim Vault — Jay RebL's Songwriting Reference" },
      {
        property: "og:description",
        content:
          "Twenty foundational dancehall riddims, one table, written for songwriting — not history for its own sake.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE_URL}/jay-rebl/riddim-vault` },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "The Riddim Vault — Jay RebL's Songwriting Reference" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/jay-rebl/riddim-vault` }],
  };
}

export function RiddimVaultPage() {
  const essentialTen = RIDDIMS.filter((r) => r.essential);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="eyebrow mb-2">Songwriting Reference — Jay RebL</p>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
            The Riddim <span className="text-gradient-gold">Vault</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            The first 20 foundational dancehall riddims, in chronological order — a working table
            for picking a riddim and writing a new song to it, not just a history lesson.
          </p>
          <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Badge variant="outline" className="border-gold/40 text-gold">
              Reference — pick a row, start writing
            </Badge>
          </div>
          <div className="mt-7">
            <Button asChild variant="goldOutline" size="lg">
              <a href="/jay-rebl">
                <ArrowRight className="size-4 rotate-180" /> Back to Jay RebL
              </a>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-16 px-4 py-16 sm:px-6">
        {/* Framing */}
        <section>
          <p className="eyebrow mb-2">Read This First</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Foundational, Not Literally First
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
            Dancehall emerged in the late 1970s, but many of its foundational riddims were rebuilt
            from earlier reggae instrumentals — so this is better understood as the{" "}
            <strong className="text-foreground">first 20 foundational dancehall riddims</strong>,
            not literally the first 20 ever recorded. Some of these 20 are actually foundational
            reggae/rocksteady riddims that later became important to dancehall, rather than
            dancehall riddims from the start — that distinction is called out per row below, and it
            matters if you're building a historically accurate playlist. Jamaican riddims were also
            renamed, recut, and reused across different producers and decades, which is exactly what
            makes them worth writing on today.
          </p>
        </section>

        {/* Table */}
        <section>
          <p className="eyebrow mb-2">The First 20</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Foundation Riddims</h2>
          <div className="mt-6 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-border bg-card">
                  <th className="p-3 text-left font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    #
                  </th>
                  <th className="p-3 text-left font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    Riddim
                  </th>
                  <th className="p-3 text-left font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    Era
                  </th>
                  <th className="p-3 text-left font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    Iconic Cuts
                  </th>
                  <th className="p-3 text-left font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    Context
                  </th>
                  <th className="p-3 text-left font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    Song Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {RIDDIMS.map((r) => (
                  <tr
                    key={r.n}
                    className={
                      r.turningPoint
                        ? "border-b-2 border-gold bg-gold/10 align-top last:border-0"
                        : "border-b border-border align-top last:border-0"
                    }
                  >
                    <td className="p-3 font-mono text-xs tabular-nums text-muted-foreground">
                      {String(r.n).padStart(2, "0")}
                    </td>
                    <td className="p-3">
                      {r.href ? (
                        <a
                          href={r.href}
                          target="_blank"
                          rel="noreferrer"
                          className={
                            (r.turningPoint
                              ? "font-semibold text-gold"
                              : "font-medium text-foreground") +
                            " underline decoration-dotted underline-offset-2 hover:text-gold"
                          }
                        >
                          {r.name}
                        </a>
                      ) : (
                        <span
                          className={r.turningPoint ? "font-semibold text-gold" : "font-medium"}
                        >
                          {r.name}
                        </span>
                      )}
                      <div className="mt-1 flex flex-wrap gap-1">
                        {r.turningPoint && (
                          <Badge variant="outline" className="border-gold/40 text-[10px] text-gold">
                            Turning point
                          </Badge>
                        )}
                        {r.essential && (
                          <Badge variant="outline" className="border-gold/30 text-[10px] text-gold">
                            Essential 10
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-3 font-mono text-xs tabular-nums text-muted-foreground">
                      {r.era}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      <ul className="list-inside list-disc space-y-0.5">
                        {r.cuts.map((cut) => (
                          <li key={cut}>{cut}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-3 text-xs leading-relaxed text-muted-foreground">{r.note}</td>
                    <td className="p-3 text-xs text-muted-foreground">Not started</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Essential 10 */}
        <section>
          <p className="eyebrow mb-2">A Shorter Listening Curriculum</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">The Essential 10</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
            If the goal is teaching the history of dancehall rather than just listing 20 riddims,
            narrow the listening curriculum to these ten.
          </p>
          <ol className="mt-6 grid gap-2 sm:grid-cols-2">
            {essentialTen.map((r, i) => (
              <li
                key={r.n}
                className="flex items-baseline gap-2 rounded-lg border border-border bg-card px-4 py-2.5"
              >
                <span className="font-mono text-xs text-gold">{i + 1}.</span>
                <span className="text-sm font-medium">{r.name}</span>
              </li>
            ))}
          </ol>

          <p className="mt-8 max-w-3xl leading-relaxed text-muted-foreground">
            There's an important historical progression behind the list — Real Rock, Full Up,
            Stalag, and Mad Mad/Diseases are particularly good examples of how a single riddim
            survives for decades through successive generations of Jamaican music:
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-2">
            {PROGRESSION.map((step, i) => (
              <span key={step} className="flex items-center gap-1.5">
                <span className="rounded-full border border-gold/40 px-3 py-1 text-xs font-medium text-gold">
                  {step}
                </span>
                {i < PROGRESSION.length - 1 && (
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                )}
              </span>
            ))}
          </div>
        </section>

        {/* Sleng Teng turning point */}
        <section>
          <p className="eyebrow mb-2">Row 19 — Why It Matters</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">The Digital Turn</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Sleng Teng, 1985,</strong> is one of the first fully
            computerized riddims and the record that launched digital dancehall into a new era. It's
            followed quickly by:
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {FOLLOWED_SLENG_TENG.map((name) => (
              <Badge key={name} variant="outline" className="border-gold/30 text-gold">
                {name}
              </Badge>
            ))}
          </div>
        </section>

        {/* Sources */}
        <section>
          <p className="eyebrow mb-2">Further Reading</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Sources</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {SOURCES.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground transition-colors hover:border-gold hover:text-gold"
              >
                {s.label}
              </a>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-8 text-center">
          <Music2 className="mx-auto size-6 text-gold" />
          <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
            Pick a Riddim, Write to It
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Once a riddim's picked, run the resulting song through the same distribution playbook.
          </p>
          <Button asChild variant="goldOutline" size="sm" className="mt-4">
            <a href="/jay-rebl/song-factory">
              See the Song Factory Strategy <ArrowRight className="size-3.5" />
            </a>
          </Button>
        </section>
      </div>
    </div>
  );
}
