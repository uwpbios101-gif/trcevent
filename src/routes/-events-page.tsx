// Shared by src/routes/events.tsx. The "-" prefix excludes this file from
// route generation (TanStack Router convention) — see src/routes/README.md.
//
// A dedicated landing page for the nav's "Events" link: just the full Jerky
// Jerk weekly lineup grid (see JerkyJerkLineupGrid), without Dinner in
// Jamaica's dinner-specific narrative/hero/notify-me signup. That page still
// carries its own hook and Culture Card story around Sunday's food; this one
// is the plain "what's on, every day" index.
import { CalendarDays, UtensilsCrossed } from "lucide-react";
import { JerkyJerkLineupGrid } from "@/components/site/JerkyJerkLineupGrid";

const SITE_URL = "https://trcevent.com";

export function eventsHead() {
  return {
    meta: [
      { title: "Events at Jerky Jerk | TRC Events" },
      {
        name: "description",
        content:
          "Every event at Jerky Jerk, day by day — a different vibe every night, 100% alcohol-free. Presented by TRC Events.",
      },
      { property: "og:title", content: "Events at Jerky Jerk | TRC Events" },
      {
        property: "og:description",
        content: "Every event at Jerky Jerk, day by day — a different vibe every night.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/events` },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Events at Jerky Jerk | TRC Events" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/events` }],
  };
}

export function EventsPage() {
  return (
    <div>
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="eyebrow mb-3">Presented by TRC Events</p>
          <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
            Events at <span className="text-gradient-gold">Jerky Jerk</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            A different vibe every day and night — 100% alcohol-free.
          </p>
          <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4 text-gold" /> 7 days a week
            </span>
            <span className="inline-flex items-center gap-1.5">
              <UtensilsCrossed className="size-4 text-gold" /> Jerky Jerk, Chicago
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <JerkyJerkLineupGrid />

        <p className="mt-14 text-center text-sm text-muted-foreground">
          Curious about the story behind Sunday's food?{" "}
          <a href="/dinner-in-jamaica" className="font-medium text-gold hover:underline">
            Read about the Dinner Riddim
          </a>
          . Presented by TRC Events, at{" "}
          <a
            href="https://www.jerkyjerk.info/"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground hover:text-gold hover:underline"
          >
            Jerky Jerk
          </a>
          .
        </p>
      </div>
    </div>
  );
}
