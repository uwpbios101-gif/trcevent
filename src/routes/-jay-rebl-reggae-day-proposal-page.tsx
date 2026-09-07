// Shared by src/routes/jay-rebl_.reggae-day-proposal.tsx. The "-" prefix
// excludes this file from route generation (TanStack Router convention) —
// see src/routes/README.md.
//
// Grant proposal narrative for a Jay RebL park showcase themed around
// International Reggae Day (July 1). Positioned primarily against Chicago
// Park District's Night Out in the Parks (NOITP) rather than DCASE's
// Neighborhood Access Program (NAP) -- NOITP's May-Sept performance season
// lines up with a July 1 date, NAP's Oct 1-Dec 31 grant period does not.
// See the Positioning Note section for that reasoning and for a figure
// (a $100k NAP tier) that this draft's source brief asserted but that
// DCASE's official 2026 NAP guidelines (see the DCASE grants instrument at
// selassiefest.com/organization/grants/dcase-cityarts-nap.html) do not
// confirm -- flagged rather than repeated as fact. Bio facts about Jay RebL
// reuse only what's verified on -jay-rebl-page.tsx; nothing about a
// specific park, date, or budget total is invented here -- those are
// marked TBD pending the Immediate Next Steps section.
import { ArrowRight, MapPin, Calendar, DollarSign, Users2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SITE_URL = "https://trcevent.com";

const SNAPSHOT = [
  {
    icon: Calendar,
    label: "Target date",
    value: "Around July 1 (International Reggae Day) — exact date pending park/site confirmation",
  },
  {
    icon: MapPin,
    label: "Target area",
    value: "South Side Chicago neighborhood (site TBD — see Immediate Next Steps)",
  },
  {
    icon: Users2,
    label: "Lead applicant",
    value: "Ras Tafari Inc, presenting Jay RebL as featured artist & workshop leader",
  },
  {
    icon: DollarSign,
    label: "Primary funding target",
    value: "Night Out in the Parks (Chicago Park District)",
  },
];

const WORKSHOP_STEPS = [
  {
    n: "01",
    title: "Community Music Workshops",
    body: 'Public songwriting sessions open to neighborhood residents. Participants share a personal or neighborhood story; Jay RebL works with them live to convert it into a melody and song hook — the same "turn a stranger\'s word into a melody on the spot" format behind his On the Street and Jay RebL Stories series, applied here as a facilitated community exercise rather than a solo street clip.',
  },
  {
    n: "02",
    title: "Free Neighborhood Showcase",
    body: "A live concert open to the public, presenting the songs and hooks that came out of the workshops alongside Jay RebL's own catalog — staged as an acoustic-to-electric set moving from stripped-down roots arrangements into full Dancehall and Reggae performance (see the companion Technical Rider & Run of Show for the full production plan).",
  },
];

const IMPACT_POINTS = [
  "Direct, hands-on community participation in the creative process, not just an audience seat — residents' own stories become the material.",
  "A free, all-ages public program with no cost barrier to attend.",
  "A cross-genre artist (R&B, Reggae, Dancehall, Hip-Hop) whose own migration story — Spanish Town, Jamaica to Chicago's North Shore — mirrors the diasporic Caribbean and reggae heritage the International Reggae Day framing celebrates.",
  "A repeatable model: the workshop-to-showcase structure can run again in a different neighborhood each cycle rather than being a one-off booking.",
];

const NEXT_STEPS = [
  {
    title: "Formalize a venue/park commitment",
    desc: "Establish a relationship with a specific park supervisor (e.g. Washington Park or South Shore Cultural Center) so a real, named location can go into the application rather than a placeholder.",
  },
  {
    title: "Assemble the EPK",
    desc: "Compile Jay RebL's SoundCloud catalog, live acoustic clips, and past performance footage with TRC Events/Charly Black into a 1-page press kit funders and park staff can review quickly.",
  },
  {
    title: "Draft fiscal/budget alignment",
    desc: "Detail artist fees, production costs (sound system/audio gear), and community workshop supplies in whatever budget template the chosen program (NOITP or NAP) actually requires.",
  },
  {
    title: "Decide: one program or both",
    desc: "Confirm with Ras Tafari Inc whether this stays a single NOITP application for the July showcase, or whether a second, separate NAP application (workshops + a fall showcase inside NAP's Oct 1-Dec 31 window) is also worth pursuing in parallel — see the Positioning Note below.",
  },
];

export function reggaeDayProposalHead() {
  return {
    meta: [
      { title: "International Reggae Day: Roots to Modern Sound — Grant Proposal | TRC Events" },
      {
        name: "description",
        content:
          "Draft grant proposal narrative for a Jay RebL community songwriting workshop and free neighborhood showcase themed around International Reggae Day, positioned for Chicago Park District's Night Out in the Parks.",
      },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/jay-rebl/reggae-day-proposal` }],
  };
}

export function ReggaeDayProposalPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="eyebrow mb-2">Grant Proposal Narrative — Jay RebL × TRC Events</p>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            International Reggae Day:{" "}
            <span className="text-gradient-gold">Roots to Modern Sound</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            A community songwriting program and free neighborhood showcase built around Jay RebL,
            timed to International Reggae Day (July 1) — drafted for Chicago Park District's Night
            Out in the Parks program.
          </p>
          <div className="mt-6 flex justify-center">
            <Badge variant="outline" className="border-gold/40 text-gold">
              Draft — not yet submitted
            </Badge>
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild variant="goldOutline" size="lg">
              <a href="/jay-rebl">
                <ArrowRight className="size-4 rotate-180" /> Back to Jay RebL
              </a>
            </Button>
            <Button asChild variant="goldOutline" size="lg">
              <a href="/jay-rebl/reggae-day-production">
                Technical Rider &amp; Run of Show <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button asChild variant="gold" size="lg">
              <a href="/jay-rebl/nap-idea-submission">
                NAP Idea Submission <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-16 px-4 py-16 sm:px-6">
        {/* Snapshot */}
        <section>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SNAPSHOT.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl border border-border bg-card p-4">
                <Icon className="size-4 text-gold" />
                <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                  {label}
                </p>
                <p className="mt-1 text-sm leading-snug">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Positioning note */}
        <section className="rounded-xl border-2 border-gold bg-gold/10 p-6">
          <p className="eyebrow mb-2">Positioning Note</p>
          <h2 className="font-display text-xl font-bold">Why Night Out in the Parks, not NAP</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            DCASE's Neighborhood Access Program funds a project performance period of{" "}
            <strong className="text-foreground">October 1 – December 31</strong> the year after
            applying — a July 1 date doesn't fall inside that window. Chicago Park District's{" "}
            <strong className="text-foreground">Night Out in the Parks</strong> season runs{" "}
            <strong className="text-foreground">May–September</strong>, which does line up, doesn't
            require 501(c)(3) status, and lets Ras Tafari Inc or Jay RebL apply directly. This
            narrative is written against NOITP for that reason. A separate NAP application — the
            same workshop concept culminating in a showcase that actually falls inside NAP's Oct–Dec
            window — is a real option worth pursuing in parallel, not instead (see Immediate Next
            Steps), just not as the same application.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            One more thing to confirm before this goes out: the source brief for this proposal cited
            NAP awards up to <strong className="text-foreground">$100,000</strong> for large
            place-based projects. DCASE's official 2026 NAP guidelines (see the DCASE grants
            instrument on selassiefest.com) confirm a{" "}
            <strong className="text-foreground">$5,000–$50,000</strong> range and don't mention a
            $100,000 tier — that figure should be re-verified against the current guidelines before
            it's cited to anyone.
          </p>
        </section>

        {/* Program design */}
        <section>
          <p className="eyebrow mb-2">01 — Program Design</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            From Community Story to Community Stage
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Two connected parts, not a single booking: a hands-on workshop phase that puts
            neighborhood residents' own stories into the songs, followed by a free public showcase
            that performs the results.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {WORKSHOP_STEPS.map((s) => (
              <div key={s.n} className="rounded-xl border border-border bg-card p-5">
                <p className="font-mono text-xs text-gold">{s.n}</p>
                <h3 className="mt-2 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The artist */}
        <section>
          <p className="eyebrow mb-2">02 — The Artist</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Jay RebL</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            R&amp;B, Hip-Hop, Reggae, and Dancehall artist, guitarist, and producer from Spanish
            Town, Jamaica, now based in the Evanston/Skokie area. Making music professionally since
            2006, moving between genres rather than staying in one lane. Currently the opening act
            for TRC Events' Charly Black lineup. His catalog spans R&amp;B/soul ("Ride or Die,"
            "Cover Me"), reggae, and hip-hop ("All-nighter"), and his content work already runs on
            the same formats this program borrows from — live sessions, street freestyles, audience
            challenges, and storytelling.
          </p>
          <div className="mt-4">
            <Button asChild variant="goldOutline" size="sm">
              <a href="/jay-rebl">
                Full artist page &amp; catalog <ArrowRight className="size-3.5" />
              </a>
            </Button>
          </div>
        </section>

        {/* Impact */}
        <section>
          <p className="eyebrow mb-2">03 — Community &amp; Public Benefit</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Why This, Why Now</h2>
          <ul className="mt-4 space-y-3">
            {IMPACT_POINTS.map((p) => (
              <li key={p} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                <div className="mt-1 size-2 shrink-0 rounded-full bg-gold" />
                <p className="text-sm leading-relaxed text-muted-foreground">{p}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Timeline */}
        <section>
          <p className="eyebrow mb-2">04 — Timeline</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Application Windows</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Both programs' windows below are drawn from the source planning brief for this proposal
            and have not been independently re-verified against Chicago Park District's current
            NOITP guidelines the way the NAP figures above were — confirm exact dates before relying
            on them.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-display text-lg font-semibold">Night Out in the Parks</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <strong className="text-foreground">Early Nov – early Dec:</strong> Call for
                  proposals open
                </li>
                <li>
                  <strong className="text-foreground">Early March:</strong> Acceptance notifications
                </li>
                <li>
                  <strong className="text-foreground">Mid-March:</strong> Confirmed park dates
                  finalized
                </li>
                <li>
                  <strong className="text-foreground">May–Sept:</strong> Performance season
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-display text-lg font-semibold">NAP (if pursued separately)</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <strong className="text-foreground">Early June:</strong> Idea Submission opens
                </li>
                <li>
                  <strong className="text-foreground">Early July:</strong> Idea Submission due
                </li>
                <li>
                  <strong className="text-foreground">September:</strong> Finalists notified
                </li>
                <li>
                  <strong className="text-foreground">Early October:</strong> Full proposal due
                </li>
                <li>
                  <strong className="text-foreground">Oct 1 – Dec 31 (following year):</strong>{" "}
                  Grant performance period
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Next steps */}
        <section>
          <p className="eyebrow mb-2">05 — Immediate Next Steps</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Before This Goes Out</h2>
          <div className="mt-6 grid gap-3">
            {NEXT_STEPS.map((s) => (
              <div key={s.title} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                <div className="mt-1 size-4 shrink-0 rounded border-2 border-muted-foreground" />
                <div>
                  <p className="text-sm font-semibold">{s.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
