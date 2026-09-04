// Shared by src/routes/jay-rebl_.song-factory.tsx. The "-" prefix excludes
// this file from route generation (TanStack Router convention) — see
// src/routes/README.md.
//
// The TikTok-first content strategy for Jay RebL's next song cycle —
// originally drafted as a private planning memo for Jay and management,
// published here at Stephen's explicit call to make it public rather than
// unlisted. "Nuff We Face" lyric quotes are pulled from Jay's real
// SoundCloud track of the same name — don't alter them, and don't relabel
// the recommended pilot song or the "In development" framing as if any of
// this campaign is already running.
import {
  ArrowRight,
  BookOpen,
  Radio,
  Footprints,
  Flame,
  Mic,
  HelpCircle,
  Music2,
  Users2,
  Shuffle,
  MessageSquareQuote,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SITE_URL = "https://trcevent.com";

const PIPELINE = [
  { n: "01", t: "Input", d: "One song" },
  { n: "02", t: "Deconstruct", d: "Hook, lyric, story, beat, controversy" },
  { n: "03", t: "Produce", d: "20–50 short assets" },
  { n: "04", t: "Test", d: "Post on TikTok" },
  { n: "05", t: "Measure", d: "Views, shares, sound-uses" },
  { n: "06", t: "Winner", d: "One clip breaks out" },
  { n: "07", t: "Scale", d: "20 variations of it" },
];

const PLATFORM_ROLES = [
  {
    platform: "TikTok",
    role: "Discovery + viral testing",
    desc: "The laboratory — post aggressively, find the pattern, let the sound page do the distribution.",
    lead: true,
  },
  {
    platform: "IG Reels",
    role: "Brand-building",
    desc: "Take the TikTok concepts that already proved out and post a more polished version.",
  },
  {
    platform: "FB Reels",
    role: "Mass distribution",
    desc: "Especially for emotional, nostalgic, or culturally-rooted clips.",
  },
  {
    platform: "YouTube Shorts",
    role: "Discovery + search",
    desc: "A durable, searchable home for winning clips.",
  },
  {
    platform: "X",
    role: "Conversation, not distribution",
    desc: "Opinions, lyric lines, commentary — personality, not the pitch.",
  },
  {
    platform: "SoundCloud",
    role: "Listening destination",
    desc: "Where the full catalog lives — not where the audience gets built.",
  },
];

const TEN_ANGLES = [
  {
    icon: Mic,
    title: "Performance",
    desc: "Jay performs the hook, straight — no framing, just the moment.",
    quote:
      "“A nuff we face, a nuff we face, every day — it's like a different case, a different case, every day.”",
    shot: "Sing the hook once, full-frame, no talking before or after. Cut on the last word.",
  },
  {
    icon: BookOpen,
    title: "Story",
    desc: "“I wrote this after …” — the song plays as the ending, not the pitch.",
    quote:
      "“Daddy hardly have education, so job quickly get delete … them not know what we even go a bed, but them not know we even eat.”",
    shot: "Tell the story behind that verse first, in Jay's own words — then let the lyric land as the punchline, straight into the hook.",
  },
  {
    icon: MessageSquareQuote,
    title: "Question",
    desc: "“What does this line mean to you?” — the comment section becomes the content.",
    quote: "“Rather walk away than take them and lose the way.”",
    shot: "Post the line on its own with the question in the caption. The debate in the comments is the second video.",
  },
  {
    icon: Footprints,
    title: "Street Experiment",
    desc: "Jay asks a stranger a question, then plays the line it inspired.",
    quote: "“The more you start to overcome, the more you start seeing.”",
    shot: "Ask a stranger “what's something you overcame that people don't see?” — then play this line right after their answer.",
  },
  {
    icon: Users2,
    title: "Emotional Reaction",
    desc: "Someone hearing the lyric for the first time, unscripted.",
    quote: "“Oh Father, please make a way. Help us overcome these trials we face, day by day.”",
    shot: "Play just the prayer bridge for someone, camera on their face, no warning what's coming.",
  },
  {
    icon: Flame,
    title: "Challenge",
    desc: "“Finish this line …” — the audience writes the next verse.",
    quote:
      "“Big up all the youths who overcome the struggles in the streets. SIP to all the one them where the …”",
    shot: "Cut right before “the system did defeat” and ask people to guess or finish it in the comments.",
  },
  {
    icon: Radio,
    title: "Behind the Song",
    desc: "Jay explains the line people keep misreading.",
    quote: "“SIP to all the one them where the system did defeat.”",
    shot: "Explain “SIP” is R.I.P. — this is a line for people the system took, not a lyric about a place.",
  },
  {
    icon: Music2,
    title: "Fan Version",
    desc: "Someone else performs it, credited back to the original.",
    quote: "“A nuff we face, a nuff we face, every day …”",
    shot: "Hand the hook to another vocalist over the same riddim — duet it against Jay's original for the side-by-side.",
  },
  {
    icon: Shuffle,
    title: "Remix",
    desc: "Another artist adds a verse, a genre flip, a new arrangement.",
    quote: "“Big up all the youths who overcome the struggles in the streets …”",
    shot: "Invite another artist to answer that line with a verse of their own struggle, same riddim, new voice.",
  },
  {
    icon: HelpCircle,
    title: "Controversy",
    desc: "“People keep telling me this lyric is wrong …” — and why it isn't.",
    quote: "“Yow me born come see nothing, dawg, me barely change me ways.”",
    shot: "Address people who hear this as giving up — and explain it's naming the starting line, not accepting it.",
  },
];

const CANDIDATES = [
  {
    track: "Jay Rebl_Cover Me",
    genre: "Dancehall",
    plays: 101,
    engagement: "4 likes · 1 repost",
    pick: true,
  },
  { track: "Need You To Love", genre: "Reggae", plays: 49, engagement: "2 likes · 2 comments" },
  {
    track: "Jay RebL All-nighter",
    genre: "Hip-Hop & Rap",
    plays: 47,
    engagement: "1 like · 2 comments",
  },
  { track: "Jay Rebl Love", genre: "R&B & Soul", plays: 66, engagement: "3 likes · 1 comment" },
  { track: "Ride or Die", genre: "R&B & Soul", plays: 28, engagement: "2 likes" },
];

const WEEKS = [
  {
    label: "Week 1",
    tag: "Discovery",
    title: "Post 1–2x/day, testing the field",
    body: "Run through as many of the ten angles as we can shoot: performance, story, question, behind-the-song, and controversy first — they need the least production.",
    bullets: [
      "No follower targets. We're only looking for content-market fit.",
      "Every post gets logged: angle, hook, hold rate, shares.",
    ],
  },
  {
    label: "Week 2",
    tag: "Widen the Field",
    title: "Add the harder-to-shoot angles",
    body: "Street experiment, challenge, fan version, remix. By day 14 we should have a real read on which 2–3 angles are pulling.",
    bullets: ["Cut nothing yet — we don't have enough data until this point."],
  },
  {
    label: "Week 3",
    tag: "Double Down",
    title: "Kill the bottom performers, scale the top",
    body: "Take the top 2–3 angles by shares-per-1,000-views and shoot 3–5 variations of each. If one clip is clearly outperforming, that becomes the week's whole focus.",
    bullets: [],
  },
  {
    label: "Week 4",
    tag: "Scale & Debrief",
    title: "Push the winning format, write the playbook",
    body: 'Full production behind whatever\'s working. If a participatory format (finish-the-line, fan remix) is gaining, this is when we manufacture the bigger version of it — a "we need 1,000 people to help finish this" moment.',
    bullets: [
      "Close the cycle with a short written debrief: what worked, what we'd never repeat, and which song runs next.",
    ],
  },
];

const METRICS = [
  { k: "1-second hold", v: "did the hook stop the scroll" },
  { k: "3-second hold", v: "did curiosity survive the hook" },
  { k: "Completion rate", v: "did they reach the payoff" },
  { k: "Rewatches", v: "strongest replay signal" },
  { k: "Comments", v: "did it start a conversation" },
  { k: "Saves", v: "intent to return to it" },
  { k: "Sound uses", v: "via TikTok for Artists' sound page" },
  { k: "Profile visits & follows/video", v: "is the clip converting to audience" },
  { k: "SoundCloud click-throughs", v: "is the payoff landing" },
];

const DECISIONS = [
  {
    title: "Confirm the pilot song",
    desc: "“Cover Me,” or a different pick — Jay knows the catalog and the story behind each track better than any play count does.",
  },
  {
    title: "Claim TikTok for Artists",
    desc: "Verify Jay's catalog on TikTok's own artist platform — it's the source for sound-level data (views, posts using the song, creator engagement) this whole plan depends on.",
  },
  {
    title: "Set the posting cadence",
    desc: "2–4 short videos a day for 30 days is the target above — confirm what's realistic given who's shooting and editing.",
  },
  {
    title: "Assign the roles",
    desc: "Who directs concepts, who shoots/edits, who handles comments and outreach — even if it's Jay wearing two of those hats to start.",
  },
  {
    title: "Agree the north-star metric",
    desc: "Shares per 1,000 views, tracked per post from day one — so week 3's cuts are based on data, not gut feeling.",
  },
  {
    title: "Pick the start date",
    desc: "Day 1 of the 30-day cycle — everything above is dated from whenever we actually start filming.",
  },
];

export function songFactoryHead() {
  return {
    meta: [
      { title: "The Song Factory — Jay RebL's Content Strategy | TRC Events" },
      {
        name: "description",
        content:
          "A TikTok-first plan for turning one Jay RebL song into a 30-day, ~50-video campaign — the sound-reuse flywheel, the ten deconstruction angles applied to a real song, and the metrics that decide what scales.",
      },
      { property: "og:title", content: "The Song Factory — Jay RebL's Content Strategy" },
      {
        property: "og:description",
        content:
          "One song, ten angles, fifty videos, one flywheel. The plan behind Jay RebL's next cycle.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE_URL}/jay-rebl/song-factory` },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "The Song Factory — Jay RebL's Content Strategy" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/jay-rebl/song-factory` }],
  };
}

export function SongFactoryPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="eyebrow mb-2">Strategy — Jay RebL</p>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
            The Song <span className="text-gradient-gold">Factory</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            A TikTok-first plan for turning one song into fifty pieces of content — built to find
            the fifteen seconds the internet refuses to scroll past, then attack it from every
            angle.
          </p>
          <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Badge variant="outline" className="border-gold/40 text-gold">
              For discussion, not yet in motion
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

      <div className="mx-auto max-w-5xl space-y-20 px-4 py-16 sm:px-6">
        {/* Core Shift */}
        <section>
          <p className="eyebrow mb-2">01 — The Core Shift</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Build It Around the Song</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Jay is the creator.{" "}
            <strong className="text-foreground">The song is the content engine.</strong> Every video
            is one more reason for someone to encounter the same piece of music — not a new ask for
            attention every time.
          </p>
          <div className="mt-6 rounded-xl border-l-4 border-gold bg-card p-5 italic">
            <p className="text-sm text-muted-foreground line-through">
              "How do we get Jay RebL's music more views?"
            </p>
            <p className="mt-2 text-lg">
              "How do we make people stop scrolling because they need to know what happens next —
              and let the song be the payoff?"
            </p>
          </div>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            TikTok is the primary machine here, not just another place to post. TikTok for Artists
            gives song-level data — views, the number of posts using a song, creator engagement —
            and TikTok's own 2025 Music Impact Report found that{" "}
            <strong className="text-foreground">
              84% of the songs that entered the Billboard Global 200 in 2024 had gone viral on
              TikTok first.
            </strong>{" "}
            Instagram Reels is the second layer: same clips, more polish, built for brand rather
            than discovery.
          </p>
        </section>

        {/* Pipeline */}
        <section>
          <p className="eyebrow mb-2">02 — The Operating Model</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">The Song Content Factory</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Not "post something today." One song runs through the same seven-step line every cycle —
            and when a piece wins, we don't move to the next idea, we make twenty variations of what
            just worked.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {PIPELINE.map((step) => (
              <div key={step.n} className="rounded-xl border border-border bg-card p-4 text-center">
                <p className="font-mono text-xs text-gold">{step.n}</p>
                <p className="mt-1 font-display text-sm font-semibold uppercase tracking-wide">
                  {step.t}
                </p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">{step.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Flywheel */}
        <section>
          <p className="eyebrow mb-2">03 — Why TikTok Specifically</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">The Sound-Reuse Flywheel</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            On most platforms, a video's reach ends with its own viewer. TikTok's sound page breaks
            that: a viewer can tap the sound, see everyone else using it, and post their own video
            with it — carrying the song to an audience Jay never posted to directly.
          </p>
          <figure className="mt-6 text-foreground">
            <svg
              viewBox="0 0 1140 300"
              role="img"
              aria-label="A six-step loop: Jay posts a video, a viewer watches, taps the sound, makes their own video with it, reaches new followers, and more videos use the sound — which feeds back into the loop starting again."
              className="mx-auto block h-auto w-full max-w-3xl"
            >
              <defs>
                <marker
                  id="sf-arrow"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
                </marker>
              </defs>

              <g fontFamily="inherit" fontSize="13" textAnchor="middle">
                <rect
                  x="40"
                  y="40"
                  width="130"
                  height="70"
                  rx="3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <text x="105" y="80" fill="currentColor">
                  Jay Posts
                </text>

                <rect
                  x="220"
                  y="40"
                  width="130"
                  height="70"
                  rx="3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <text x="285" y="80" fill="currentColor">
                  Viewer Watches
                </text>

                <rect
                  x="400"
                  y="40"
                  width="130"
                  height="70"
                  rx="3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <text x="465" y="80" fill="currentColor">
                  Taps the Sound
                </text>

                <rect
                  x="580"
                  y="40"
                  width="130"
                  height="70"
                  rx="3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <text x="645" y="80" fill="currentColor">
                  Makes Own Video
                </text>

                <rect
                  x="760"
                  y="40"
                  width="130"
                  height="70"
                  rx="3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <text x="825" y="80" fill="currentColor">
                  Reaches New Fans
                </text>

                <rect
                  x="940"
                  y="40"
                  width="130"
                  height="70"
                  rx="3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <text x="1005" y="80" fill="currentColor">
                  Sound Spreads
                </text>
              </g>

              <g stroke="currentColor" strokeWidth="1.5" markerEnd="url(#sf-arrow)">
                <line x1="178" y1="75" x2="212" y2="75" />
                <line x1="358" y1="75" x2="392" y2="75" />
                <line x1="538" y1="75" x2="572" y2="75" />
                <line x1="718" y1="75" x2="752" y2="75" />
                <line x1="898" y1="75" x2="932" y2="75" />
              </g>

              <path
                d="M 1005 110 C 1005 230, 105 230, 105 110"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="5 4"
                markerEnd="url(#sf-arrow)"
              />
              <text x="565" y="255" textAnchor="middle" fontSize="12" fill="currentColor">
                repeats — every video restarts the loop
              </text>
            </svg>
            <figcaption className="mx-auto mt-4 max-w-xl text-center text-sm text-muted-foreground">
              Each cycle through the loop reaches an audience Jay never posted to directly — that
              compounding is the actual mechanism behind million-view outcomes, not any single video
              going viral on its own.
            </figcaption>
          </figure>
        </section>

        {/* Platform roles */}
        <section>
          <p className="eyebrow mb-2">04 — Who Does What</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Platform Roles</h2>
          <p className="mt-4 text-muted-foreground">
            Not treated identically. Each platform gets one job.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {PLATFORM_ROLES.map((p) => (
              <div
                key={p.platform}
                className={
                  p.lead
                    ? "rounded-xl border-2 border-gold bg-gold/10 p-5"
                    : "rounded-xl border border-border bg-card p-5"
                }
              >
                <h3 className="eyebrow mb-1">{p.platform}</h3>
                <p className="font-display text-lg font-semibold">{p.role}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Ten Angles */}
        <section>
          <p className="eyebrow mb-2">05 — The Deconstruction</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Ten Angles, One Song</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Every song gets attacked from all ten before we decide what's working. Same song, ten
            different reasons to watch.
          </p>
          <div className="mt-4 rounded-xl border-l-4 border-gold bg-card p-4 text-sm text-muted-foreground">
            <strong className="text-foreground">Worked example:</strong> "Nuff We Face" — real
            lyrics, one line pulled per angle below — so this reads as ten actual shot ideas instead
            of ten abstract categories.
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEN_ANGLES.map(({ icon: Icon, title, desc, quote, shot }, i) => (
              <div key={title} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2">
                  <Icon className="size-4 text-gold" />
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                <div className="mt-3 border-t border-border pt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gold">
                    Applied to "Nuff We Face"
                  </p>
                  <p className="mt-1.5 text-sm italic leading-relaxed">{quote}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{shot}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Song candidates */}
        <section>
          <p className="eyebrow mb-2">06 — Which Song Goes First</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Reading the Current Signal
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Pulled from Jay's SoundCloud catalog as it stands today. These play counts are small —
            nowhere near predictive on their own — but they're the only real signal before TikTok
            testing starts, so this is where deconstruction begins first.
          </p>
          <div className="mt-6 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-border bg-card">
                  <th className="p-3 text-left font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    Track
                  </th>
                  <th className="p-3 text-left font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    Genre
                  </th>
                  <th className="p-3 text-left font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    Plays
                  </th>
                  <th className="p-3 text-left font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    Engagement
                  </th>
                </tr>
              </thead>
              <tbody>
                {CANDIDATES.map((c) => (
                  <tr key={c.track} className="border-b border-border last:border-0">
                    <td className="p-3">
                      <span className={c.pick ? "font-semibold text-gold" : "font-medium"}>
                        {c.track}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">{c.genre}</td>
                    <td className="p-3 font-mono tabular-nums">{c.plays}</td>
                    <td className="p-3 font-mono text-xs tabular-nums text-muted-foreground">
                      {c.engagement}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 rounded-xl border-2 border-gold bg-gold/10 p-5">
            <p className="eyebrow mb-1">Recommended pilot</p>
            <p className="text-sm leading-relaxed">
              <strong className="font-display text-lg">"Cover Me"</strong> has both the highest play
              count and the only repost in the catalog — the one signal so far that a listener found
              it worth handing to someone else, which is the exact behavior this whole plan is
              trying to trigger at scale. It's also Dancehall, which reads well against Jay's
              Jamaica-to-Chicago story for the "Behind the Song" and street-experiment angles.
              Backup: "Need You To Love," which has the most comments relative to its plays.
            </p>
          </div>
        </section>

        {/* 30 days */}
        <section>
          <p className="eyebrow mb-2">07 — Applied to "Cover Me"</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">The First 30 Days</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            One song, four weeks, roughly fifty posts. We're not committing to this being the song
            forever — we're committing to running the full process on one song, once, so the next
            cycle runs faster.
          </p>
          <div className="mt-6 grid gap-4">
            {WEEKS.map((w) => (
              <div
                key={w.label}
                className="grid gap-0 overflow-hidden rounded-xl border border-border sm:grid-cols-[140px_1fr]"
              >
                <div className="flex flex-col justify-center gap-1 bg-card p-4">
                  <p className="font-display text-lg font-bold">{w.label}</p>
                  <p className="font-mono text-xs text-muted-foreground">{w.tag}</p>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-base font-semibold">{w.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
                  {w.bullets.length > 0 && (
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                      {w.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Metrics */}
        <section>
          <p className="eyebrow mb-2">08 — What We're Actually Watching</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">The Dashboard</h2>
          <div className="mt-6 flex flex-wrap items-baseline gap-3 rounded-xl border-2 border-gold bg-card p-5">
            <span className="eyebrow">North star</span>
            <span className="font-display text-xl font-bold">Shares per 1,000 views</span>
            <span className="text-sm text-muted-foreground">
              — a share means someone said "you need to see this," which is worth more than a
              passive like.
            </span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {METRICS.map((m) => (
              <div key={m.k} className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm font-semibold">{m.k}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{m.v}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Decisions */}
        <section>
          <p className="eyebrow mb-2">09 — For This Session</p>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Decisions to Leave With</h2>
          <div className="mt-6 grid gap-3">
            {DECISIONS.map((d) => (
              <div key={d.title} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                <div className="mt-1 size-4 shrink-0 rounded border-2 border-muted-foreground" />
                <div>
                  <p className="text-sm font-semibold">{d.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
