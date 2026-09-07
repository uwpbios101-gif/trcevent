// Shared by src/routes/jay-rebl_.nap-idea-submission.tsx. The "-" prefix
// excludes this file from route generation (TanStack Router convention) —
// see src/routes/README.md.
//
// The actual DCASE Neighborhood Access Program (NAP) Idea Submission
// content -- distinct from -jay-rebl-reggae-day-proposal-page.tsx (the
// narrative case written primarily for Night Out in the Parks, since NAP's
// Oct-Dec grant period doesn't cover a July 1 date) and
// -jay-rebl-reggae-day-production-page.tsx (the tech rider/run of show for
// the live performance itself). This page exists so that IF Ras Tafari Inc
// pursues the separate NAP track that page flagged (workshops + a fall
// showcase, inside NAP's real Oct 1-Dec 31 window), the actual Idea
// Submission -- the 4 required questions, in DCASE's own wording, plus a
// recording script -- is already drafted.
//
// Every quoted rule/date below is pulled verbatim from DCASE's official
// 2026 NAP guidelines PDF (napguidelines26.pdf, "How to Apply" /
// "Eligibility Criteria" / "Project Requirements" sections) -- see
// source_url. That 2026 cycle is CLOSED (deadline was July 1, 2026); no
// 2027 guidelines exist yet, so this is prepared ahead of that portal
// opening, same approach as the DCASE grants instrument on
// selassiefest.com.
//
// Real, unresolved eligibility problem, surfaced rather than hidden: NAP
// requires the project to take place in the same neighborhood as the LEAD
// APPLICANT's own residence/address. Ras Tafari Inc (South Holland, not
// Chicago) and Jay RebL himself (Evanston/Skokie, per his verified bio on
// -jay-rebl-page.tsx -- also not Chicago) both fail that test as lead
// applicant. NAP's own guidelines explicitly allow an outside org/artist to
// apply as a PARTNER alongside an eligible neighborhood-resident lead --
// that's the structure this page recommends, not a workaround, an actual
// rule in the source PDF. No specific Chicago neighborhood is invented
// anywhere below -- every occurrence is a bracketed [NEIGHBORHOOD]
// placeholder until a real lead applicant is identified.
import { ArrowRight, AlertTriangle, CheckCircle2, Circle, Mic, FileAudio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JayReblSubNav } from "@/components/site/JayReblSubNav";

const SITE_URL = "https://trcevent.com";
const NAP_SOURCE_URL =
  "https://www.chicago.gov/content/dam/city/depts/dca/Grants/nap/napguidelines26.pdf";

const ELIGIBILITY_ROWS = [
  {
    rule: "Lead applicant must reside/be located in the city of Chicago with a valid street address (no P.O. boxes).",
    status: "fail",
    note: "Ras Tafari Inc: South Holland, IL — not Chicago. Jay RebL: Evanston/Skokie area — also not Chicago.",
  },
  {
    rule: "Lead applicant must reside/be located in the neighborhood where the project will take place.",
    status: "pending",
    note: "Depends entirely on who the lead applicant ends up being — see Recommended Structure below.",
  },
  {
    rule: "Must demonstrate at least a one-year history of creating, curating, or producing relevant community/creative work.",
    status: "pass",
    note: "Jay RebL has performed professionally since 2006; SelassieFest (Ras Tafari Inc) ran its first full cycle in 2026.",
  },
  {
    rule: "Project must take place in the same neighborhood as the lead applicant's current primary residence/address.",
    status: "pending",
    note: "Same dependency as above — this is the one rule that actually decides who can be lead.",
  },
  {
    rule: '"Organizations and individuals located outside of the neighborhood... are welcome to apply as a partner with an eligible individual or organization."',
    status: "pass",
    note: "This is the path forward — quoted directly from the guidelines. Ras Tafari Inc + Jay RebL as partners, not lead.",
  },
];

const STATUS_ICON: Record<string, typeof CheckCircle2> = {
  pass: CheckCircle2,
  fail: AlertTriangle,
  pending: Circle,
};
const STATUS_COLOR: Record<string, string> = {
  pass: "text-green-500",
  fail: "text-red-500",
  pending: "text-gold",
};

const FOUR_QUESTIONS = [
  {
    q: "Why you want to do this project",
    a: "Jay RebL already runs an unfunded, informal version of this: turning a stranger's one word or one sentence into a melody on the spot (his \"On the Street\" format). This project turns that into a structured, funded community program — free songwriting workshops that put a neighborhood's own stories into its own songs, followed by a free public showcase that performs the results.",
  },
  {
    q: "What you hope to accomplish",
    a: "A series of community songwriting workshops where [NEIGHBORHOOD] residents work directly with Jay RebL to turn a personal or neighborhood story into a real song hook — followed by one free, all-ages neighborhood showcase presenting those songs alongside Jay RebL's own catalog, staged as an acoustic-to-electric set (see the companion Technical Rider & Run of Show).",
  },
  {
    q: "Who will be involved",
    a: "Jay RebL — lead artist and workshop facilitator. Ras Tafari Inc (runs SelassieFest, Chicago) — producing partner, not lead applicant. [LEAD APPLICANT — TBD]: an individual artist, block club, or community organization actually based in [NEIGHBORHOOD], who applies as lead per NAP's residency rule. Neighborhood residents — as workshop participants and showcase audience.",
  },
  {
    q: "When and where it might take place",
    a: "[NEIGHBORHOOD], Chicago — exact site TBD, ideally a space the neighborhood already gathers in (a field house, park space, or community center). Workshops would run over several weeks, closing with one showcase timed inside NAP's grant performance window.",
  },
];

const NARRATION_SCRIPT = `Hey — I'm Jay RebL. I make music that moves between R&B, hip-hop, reggae, and dancehall, and I've been doing that professionally since 2006. I was born in Spanish Town, Jamaica, and these days I'm based on Chicago's North Shore. Right now I'm the opening act for Charly Black on TRC Events' lineup here in the city.

But this idea isn't about my show. It's about something I already do for free, most weeks, that I want to turn into an actual program. I call it "On the Street" — I stop a stranger, ask for one word, one sentence, one story, and I turn it into a melody right there on the spot. It works because people already have the story. I'm just the one who knows what to do with it musically. I want to bring that into [NEIGHBORHOOD], not as a clip for content, but as something real that stays with the block after I leave.

Here's what I want to build. First, a series of free community songwriting workshops — residents of [NEIGHBORHOOD] sit down with me, and we turn a story they already have — about the block, about their family, about the neighborhood's own history — into a real song hook. Not something I write about them. Something we write together, in the room.

Then we close it out with one free neighborhood showcase. A live concert, open to everybody, no ticket required, where we perform the songs that came out of those workshops, side by side with my own catalog. I want to build that set the way the roots reggae shows I grew up on used to run — strip it all the way down to just guitar and hand drum first, so people actually hear the words, then bring in the full band and the sound system for the back half, so the night ends the way a dancehall night is supposed to end: loud, and together.

Who's involved: this is a partnership, not a solo project. Ras Tafari Inc — the Chicago nonprofit that runs SelassieFest — is backing this as the producing organization; they've got a real track record running community reggae programming in this city. I'm the lead artist and the one running the workshops. And the actual lead applicant on this grant is going to be someone who actually lives in [NEIGHBORHOOD] — because that's who this program is really for, and that's whose name belongs on the paperwork, not mine or the organization's.

As for when and where — we're proposing this for [NEIGHBORHOOD], on Chicago's [South/West] Side. The workshops would run over several weeks, and the free showcase would close it out as one event, timed to land inside the grant's performance window. Nothing about this needs a venue that doesn't already exist in the neighborhood — a field house, a park space, wherever people there already gather is exactly where this belongs.

That's the idea. A story a resident already has, turned into a song, performed for the whole block, for free.`;

const PROJECT_REQUIREMENTS = [
  "Must involve arts or cultural activities.",
  "Must have a primary goal to serve residents of a specific neighborhood or community (not citywide or Chicago in general).",
  "Must take place in the same neighborhood where lead applicant's current primary residence/address is located.",
  "Projects must engage neighborhood residents as participants or audiences within the grant's performance window.",
];

const REVIEW_CRITERIA = [
  {
    title: "Strength of proposed project",
    body: "Artistic merit paired with meaningful resident engagement, and feasibility based on applicant experience. Jay RebL's own touring/recording history plus Ras Tafari Inc's 2026 SelassieFest track record both speak directly to feasibility.",
  },
  {
    title: "Increasing Access",
    body: "The project should take place within a priority neighborhood and/or support a historically disinvested community — which depends entirely on which neighborhood the eventual lead applicant is based in.",
  },
  {
    title: "Benefit to communities",
    body: "A free, all-ages public showcase plus hands-on workshop participation — both a wide-reach event and a deep, personal creative experience for workshop participants.",
  },
  {
    title: "Community experience",
    body: "This is the criterion the eventual neighborhood-resident lead applicant needs to speak to directly — DCASE wants to see the lead's own relationships and track record in that specific neighborhood, not just the partners'.",
  },
];

export function napIdeaSubmissionHead() {
  return {
    meta: [
      { title: "NAP Idea Submission — Jay RebL | TRC Events" },
      {
        name: "description",
        content:
          "Draft DCASE Neighborhood Access Program Idea Submission for a Jay RebL community songwriting workshop and free neighborhood showcase — the 4 required questions, review-criteria alignment, and a full recording script.",
      },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/jay-rebl/nap-idea-submission` }],
  };
}

export function NapIdeaSubmissionPage() {
  return (
    <div>
      <JayReblSubNav />
      {/* Hero */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="eyebrow mb-2">DCASE Neighborhood Access Program — Idea Submission</p>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Jay RebL <span className="text-gradient-gold">× A Neighborhood</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            The actual Idea Submission content — DCASE's 4 required questions, answered, plus a full
            recording script — ready the moment a neighborhood-resident lead applicant is confirmed
            and the 2027 portal opens.
          </p>
          <div className="mt-6 flex justify-center">
            <Badge variant="outline" className="border-gold/40 text-gold">
              Draft — lead applicant not yet identified
            </Badge>
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild variant="goldOutline" size="lg">
              <a href="/jay-rebl/reggae-day-proposal">
                <ArrowRight className="size-4 rotate-180" /> Grant Proposal Narrative
              </a>
            </Button>
            <Button asChild variant="goldOutline" size="lg">
              <a href="/jay-rebl/reggae-day-production">Technical Rider &amp; Run of Show</a>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-16 px-4 py-16 sm:px-6">
        {/* Eligibility */}
        <section>
          <p className="eyebrow mb-2">01 — Eligibility, Checked Against the Actual Rule</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Who Can Be Lead Applicant</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Quoted directly from DCASE's 2026 NAP guidelines (Eligibility Criteria, p.7): the lead
            applicant "must reside/be located in the city of Chicago with a valid street address"
            and "must reside/be located in the neighborhood where the project will take place."
            Checked against what's actually known about this project's people:
          </p>
          <div className="mt-6 grid gap-3">
            {ELIGIBILITY_ROWS.map((row, i) => {
              const Icon = STATUS_ICON[row.status];
              return (
                <div key={i} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                  <Icon className={`mt-0.5 size-4 shrink-0 ${STATUS_COLOR[row.status]}`} />
                  <div>
                    <p className="text-sm font-medium">{row.rule}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{row.note}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-xl border-2 border-gold bg-gold/10 p-6">
            <p className="eyebrow mb-2">Recommended Structure</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Guidelines, quoted verbatim: "Organizations and individuals located outside of the
              neighborhood where their project will take place are welcome to apply{" "}
              <strong className="text-foreground">as a partner</strong> with an eligible individual
              or organization." Neither Ras Tafari Inc nor Jay RebL can be lead applicant as things
              stand — but both can be named partners under an eligible Chicago neighborhood resident
              (an individual artist, a block club, or a community organization actually based in the
              target neighborhood). Finding that lead applicant is the single most important open
              item before this can be submitted — every [NEIGHBORHOOD] placeholder below resolves
              the moment that person or org is identified.
            </p>
          </div>
        </section>

        {/* Project requirements */}
        <section>
          <p className="eyebrow mb-2">02 — Project Requirements</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">What DCASE Requires</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {PROJECT_REQUIREMENTS.map((r) => (
              <li key={r} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                <div className="mt-1 size-2 shrink-0 rounded-full bg-gold" />
                <p className="text-sm text-muted-foreground">{r}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* The 4 questions */}
        <section>
          <p className="eyebrow mb-2">03 — The Idea Submission</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            DCASE's 4 Required Questions
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Quoted verbatim from "How to Apply" (p.16-17). Choose ONE submission format for all four
            — narrative, a recording, or a slide deck, not a mix. This draft answers all four in
            writing here, and separately as a spoken recording script in Section 04.
          </p>
          <div className="mt-6 grid gap-4">
            {FOUR_QUESTIONS.map((item) => (
              <div key={item.q} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-display text-lg font-semibold">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MP3 recording */}
        <section>
          <p className="eyebrow mb-2">04 — Recording Option</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Audio Idea Submission</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            NAP's file-type rules explicitly allow mp3 as a direct upload (jpeg/jpg/png/tif/tiff,
            pdf, and mp3 are the only allowed direct uploads — video must be submitted as a link,
            not a file). A voice recording of Jay RebL reading the script below, kept to 5 minutes,
            satisfies the "Recording" submission option on its own — no narrative or slide deck
            needed alongside it.
          </p>

          <div className="mt-6 flex items-center gap-4 rounded-xl border-2 border-dashed border-gold/40 bg-card p-6">
            <FileAudio className="size-8 shrink-0 text-gold" />
            <div className="flex-1">
              <p className="text-sm font-semibold">Recording — pending</p>
              <p className="mt-1 text-sm text-muted-foreground">
                No audio file uploaded yet. Record the script below (aim for 5 minutes or under),
                export as .mp3, and it goes here.
              </p>
            </div>
            <Badge variant="outline" className="border-gold/40 text-gold">
              Placeholder
            </Badge>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <Mic className="size-4 text-gold" />
              <h3 className="eyebrow">Full Narration Script</h3>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">
              Written to run close to 5 minutes at a natural speaking pace. Every{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">[NEIGHBORHOOD]</code> and{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">[South/West]</code> is a
              placeholder — fill those in once a lead applicant is confirmed, then read it straight
              through and record.
            </p>
            <div className="whitespace-pre-line rounded-lg bg-muted/40 p-5 text-sm leading-relaxed">
              {NARRATION_SCRIPT}
            </div>
          </div>
        </section>

        {/* Review criteria */}
        <section>
          <p className="eyebrow mb-2">05 — Review Criteria Alignment</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">How This Gets Scored</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {REVIEW_CRITERIA.map((c) => (
              <div key={c.title} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-display text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline note */}
        <section className="rounded-xl border border-border bg-card p-6">
          <p className="eyebrow mb-2">06 — Timing</p>
          <h2 className="font-display text-lg font-bold">2026 Cycle Is Closed</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            The dates quoted throughout this page (Idea Submission portal opened June 2026, deadline
            July 1, 2026 at noon CT, finalists notified Sept 15, 2026, grant period Oct 1, 2026 –
            Dec 31, 2027) are DCASE's 2026 cycle — already closed. 2027 guidelines aren't published
            yet. This page exists so the moment they are, only the lead applicant and the
            neighborhood name need to be filled in before submitting.
          </p>
        </section>
      </div>
    </div>
  );
}
