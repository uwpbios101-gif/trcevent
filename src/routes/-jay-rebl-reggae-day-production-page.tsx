// Shared by src/routes/jay-rebl_.reggae-day-production.tsx. The "-" prefix
// excludes this file from route generation (TanStack Router convention) —
// see src/routes/README.md.
//
// Technical rider + run of show for the "International Reggae Day: Roots to
// Modern Sound" park showcase (companion to -jay-rebl-reggae-day-proposal-page.tsx).
// No venue, date, or exact gear list is confirmed yet, so every technical
// spec below is a professional-standard DRAFT starting point for a small
// acoustic-to-electric reggae/dancehall ensemble -- not a claim about
// equipment that has actually been booked. Confirm every line with the
// venue's own production contact and Jay RebL's monitor/FOH engineer
// before a show date is set. Times in the run of show are relative
// (T+minutes) with an illustrative clock-time column assuming a 5:00 PM
// start -- shift the whole column once a real start time is confirmed.
import { ArrowRight, Zap, Mic2, Users2, CloudRain, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JayReblSubNav } from "@/components/site/JayReblSubNav";

const SITE_URL = "https://trcevent.com";

const PERSONNEL = [
  {
    role: "Jay RebL",
    detail: "Lead vocals, acoustic & electric guitar, host/MC for the sound-system transition",
  },
  {
    role: "Backing musicians (2-3)",
    detail:
      "Bass, percussion/Nyabinghi drums, second guitar or keys — headcount to be finalized with the band",
  },
  {
    role: "Sound system selector(s) (1-2)",
    detail: "Foundational riddim juggling for Act II and bed tracks under Act III",
  },
  {
    role: "FOH sound engineer",
    detail:
      "One dedicated engineer for the full 2.5-hour set — not shared with another act's changeover",
  },
  {
    role: "Stage manager / production lead",
    detail:
      "Runs the show clock, cues transitions between acts, is the single point of contact for the venue",
  },
];

const INPUT_LIST = [
  { ch: "1", source: "Vocal — Jay RebL", type: "Handheld condenser (SM58 or equivalent)" },
  { ch: "2", source: "Acoustic guitar (Act I)", type: "DI (pickup) + optional mic" },
  { ch: "3", source: "Electric guitar (Act III)", type: "DI or mic'd amp" },
  { ch: "4", source: "Bass", type: "DI" },
  { ch: "5-6", source: "Percussion / Nyabinghi drums", type: "2x condenser or dynamic, overhead" },
  { ch: "7", source: "Backing vocal (if applicable)", type: "Handheld or headset condenser" },
  { ch: "8", source: "Selector / sound-system line feed", type: "Stereo line in (2x TRS/XLR)" },
  { ch: "9", source: "MC/host mic", type: "Handheld dynamic" },
];

const BACKLINE_BRINGS = [
  "Acoustic guitar with pickup, tuner",
  "Electric guitar + pedalboard",
  "Selector's own controller/mixer and music library",
  "Hand percussion (if the percussionist supplies their own)",
];

const BACKLINE_NEEDS = [
  "Bass amp or DI-friendly bass rig",
  "Drum kit or Nyabinghi drum set (if not traveling with the percussionist)",
  "3-4 vocal mic stands, 2 instrument stands",
  "Monitor wedges x3-4 (or in-ear pack if the budget supports it)",
];

const HOSPITALITY = [
  "Shaded green room or tent area near the stage for the full call time",
  "Bottled water for 6-8 people through the full program",
  "Reserved parking for 2 vehicles (band + gear load-in)",
  "Load-in window of at least 90 minutes before doors",
];

const RUN_OF_SHOW = [
  {
    t: "T+0:00",
    clock: "5:00 PM",
    segment: "Doors / Welcome",
    detail: "House music (selector), crowd settles, community info tables open.",
  },
  {
    t: "T+0:05",
    clock: "5:05 PM",
    segment: "Host Intro",
    detail:
      "Jay RebL welcomes the crowd, frames the show as an International Reggae Day celebration and names the community workshop participants.",
  },
  {
    t: "T+0:10",
    clock: "5:10 PM",
    segment: "Act I — Roots to Modern Sound Tribute (part of Roots & Rhythm)",
    detail:
      'Short acoustic medley drawing on Bob Marley\'s songwriting (e.g. "Redemption Song," "Natural Mystic") into an original transition — framing device for the day, not a full Marley set.',
  },
  {
    t: "T+0:20",
    clock: "5:20 PM",
    segment: "Act I — Roots & Rhythm (cont.)",
    detail:
      "Acoustic guitar + traditional Nyabinghi drumming/percussion. Storytelling, vocal harmonies, classic roots reggae arrangements, plus 1-2 songs built from the community workshop sessions.",
  },
  {
    t: "T+0:55",
    clock: "5:55 PM",
    segment: "Act II — Sound System Transition",
    detail:
      "Selector(s) take the stack, juggling foundational riddims. Jay RebL hosts and freestyles live over the transition, working the crowd.",
  },
  {
    t: "T+1:25",
    clock: "6:25 PM",
    segment: "Act III — Electric Dancehall & Live Band",
    detail:
      "Full backing band. High-energy dancehall/crossover catalog, live riddim transitions between songs.",
  },
  {
    t: "T+2:20",
    clock: "7:20 PM",
    segment: "Closing / Community Shoutouts",
    detail:
      "Thank workshop participants and park staff by name, reprise one workshop-written hook, call-to-action for the next community session, close on an original.",
  },
  { t: "T+2:30", clock: "7:30 PM", segment: "End / Load-out begins", detail: "" },
];

export function reggaeDayProductionHead() {
  return {
    meta: [
      {
        title:
          "International Reggae Day: Roots to Modern Sound — Tech Rider & Run of Show | TRC Events",
      },
      {
        name: "description",
        content:
          "Draft technical rider and run of show for the Jay RebL International Reggae Day park showcase — personnel, input list, backline, hospitality, and a minute-by-minute show schedule.",
      },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/jay-rebl/reggae-day-production` }],
  };
}

export function ReggaeDayProductionPage() {
  return (
    <div>
      <JayReblSubNav />
      {/* Hero */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="eyebrow mb-2">Production Packet — Jay RebL × TRC Events</p>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Technical Rider &amp; <span className="text-gradient-gold">Run of Show</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            "International Reggae Day: Roots to Modern Sound" — a 2.5-hour acoustic-to-electric park
            showcase. Draft specs below are a professional starting point, not confirmed equipment —
            finalize every line with the venue and Jay RebL's sound engineer once a date and site
            are locked.
          </p>
          <div className="mt-6 flex justify-center">
            <Badge variant="outline" className="border-gold/40 text-gold">
              Draft — pending confirmed venue &amp; date
            </Badge>
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild variant="goldOutline" size="lg">
              <a href="/jay-rebl/reggae-day-proposal">
                <ArrowRight className="size-4 rotate-180" /> Grant Proposal Narrative
              </a>
            </Button>
            <Button asChild variant="gold" size="lg">
              <a href="/jay-rebl/nap-idea-submission">
                NAP Idea Submission <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button asChild variant="goldOutline" size="lg">
              <a href="/jay-rebl">Back to Jay RebL</a>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-16 px-4 py-16 sm:px-6">
        {/* Personnel */}
        <section>
          <p className="eyebrow mb-2">01 — Personnel &amp; Roles</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">On Site</h2>
          <div className="mt-6 grid gap-3">
            {PERSONNEL.map((p) => (
              <div key={p.role} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                <Users2 className="mt-0.5 size-4 shrink-0 text-gold" />
                <div>
                  <p className="text-sm font-semibold">{p.role}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stage & power */}
        <section>
          <p className="eyebrow mb-2">02 — Stage, Space &amp; Power</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Site Requirements</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <Volume2 className="size-5 text-gold" />
              <h3 className="mt-3 font-display text-lg font-semibold">Dual-Stage Layout</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                A park shell or open lawn with room for two zones: a small acoustic circle at ground
                level (Act I) surrounded by audience seating, leading into the main amplified stage
                (Acts II-III). A shell or covered stage is preferred but not required if weather
                contingency (Section 05) is in place.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <Zap className="size-5 text-gold" />
              <h3 className="mt-3 font-display text-lg font-semibold">Power</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Two dedicated 20A circuits minimum — one for backline/stage power, one for the FOH
                sound system — plus generator backup if the site has no house power. Exact draw
                depends on the final PA size; confirm with whichever sound vendor the venue or NOITP
                assigns.
              </p>
            </div>
          </div>
        </section>

        {/* Input list */}
        <section>
          <p className="eyebrow mb-2">03 — Input List (Draft)</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">FOH Channel Plan</h2>
          <div className="mt-6 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-border bg-card">
                  <th className="p-3 text-left font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    Ch.
                  </th>
                  <th className="p-3 text-left font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    Source
                  </th>
                  <th className="p-3 text-left font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    Mic / DI
                  </th>
                </tr>
              </thead>
              <tbody>
                {INPUT_LIST.map((row) => (
                  <tr key={row.ch} className="border-b border-border last:border-0">
                    <td className="p-3 font-mono tabular-nums">{row.ch}</td>
                    <td className="p-3 font-medium">{row.source}</td>
                    <td className="p-3 text-muted-foreground">{row.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Monitors: 3-4 wedge mixes minimum (vocal, band, selector) — confirm in-ear availability
            separately if the budget supports it.
          </p>
        </section>

        {/* Backline */}
        <section>
          <p className="eyebrow mb-2">04 — Backline</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Who Brings What</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="eyebrow mb-2">Jay RebL / band brings</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {BACKLINE_BRINGS.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" /> {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="eyebrow mb-2">Needed from venue/promoter</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {BACKLINE_NEEDS.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Hospitality */}
        <section>
          <p className="eyebrow mb-2">05 — Hospitality &amp; Logistics</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Standard Asks</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {HOSPITALITY.map((h) => (
              <li key={h} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                <Mic2 className="mt-0.5 size-4 shrink-0 text-gold" />
                <p className="text-sm text-muted-foreground">{h}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Run of show */}
        <section>
          <p className="eyebrow mb-2">06 — Run of Show</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">2.5-Hour Program</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Clock times assume a 5:00 PM start — shift the whole column once a real start time is
            confirmed. Relative times (T+) are what actually matter for the stage manager's cues.
          </p>
          <div className="mt-6 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border bg-card">
                  <th className="p-3 text-left font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    T+
                  </th>
                  <th className="p-3 text-left font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    Clock (draft)
                  </th>
                  <th className="p-3 text-left font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    Segment
                  </th>
                  <th className="p-3 text-left font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    Detail
                  </th>
                </tr>
              </thead>
              <tbody>
                {RUN_OF_SHOW.map((row) => (
                  <tr key={row.t} className="border-b border-border last:border-0 align-top">
                    <td className="p-3 font-mono tabular-nums text-gold">{row.t}</td>
                    <td className="p-3 font-mono tabular-nums text-muted-foreground">
                      {row.clock}
                    </td>
                    <td className="p-3 font-medium">{row.segment}</td>
                    <td className="p-3 text-muted-foreground">{row.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Contingency */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-start gap-3">
            <CloudRain className="mt-0.5 size-5 shrink-0 text-gold" />
            <div>
              <p className="eyebrow mb-1">07 — Weather &amp; Contingency</p>
              <h2 className="font-display text-lg font-bold">Outdoor Show, Standard Precautions</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Confirm the host park's rain-date or covered-shell policy before the date is set —
                NOITP sites vary on this. Backline and FOH gear need weather covers on hand
                regardless of forecast. Reconfirm the site's amplified-sound curfew (city noise
                ordinances vary by park) before finalizing the Act III end time.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
