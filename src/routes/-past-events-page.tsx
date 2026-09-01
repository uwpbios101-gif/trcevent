// Shared by src/routes/past-events.tsx. The "-" prefix excludes this file
// from route generation (TanStack Router convention) — see
// src/routes/README.md.
//
// Archive index for one-off events whose date has passed. These pages still
// exist and are still reachable directly (Charly Black keeps its street-team
// / comp / comp-admin tooling live at /charly-black/*), they're just no
// longer linked from the Navbar — see Navbar.tsx's EVENT_LINKS. Recurring
// series (Dancehall Fridays, Dinner in Jamaica, Dancehall 101, Sing Ova
// Sundays) don't belong here even once a given week's date passes, since the
// series itself is still live.
import { CalendarDays } from "lucide-react";
import { Link } from "@tanstack/react-router";
import charlyBlackFlyer from "@/assets/charly-black-flyer-buddyb.jpg";
import stCatherineFlyer from "@/assets/st-catherine-linkup-flyer.jpg";
import jamaicadayFlyer from "@/assets/jamaicaday-flyer.jpg";
import jamaica64Flyer from "@/assets/jamaica64-flyer.jpg";

const SITE_URL = "https://trcevent.com";

// Newest first.
const PAST_EVENTS = [
  {
    name: "Charly Black — Good Times",
    date: "Friday, August 28, 2026",
    to: "/charly-black",
    image: charlyBlackFlyer,
    description:
      "Charly Black live in Chicago for a Historic Chicago Night at Bombay Banquet Hall.",
  },
  {
    name: "Bad Like Di 90's — St. Catherine Link-Up",
    date: "Saturday, August 22, 2026",
    to: "/st-catherine-linkup",
    image: stCatherineFlyer,
    description: "One Parish, One Link, One Community — free at ILU Club of Chicago, Dolton, IL.",
  },
  {
    name: "Jamaica Independence Celebration",
    date: "Sunday, August 9, 2026",
    to: "/jamaicaday",
    image: jamaicadayFlyer,
    description:
      "Team Lenky's annual Jamaica Independence Celebration at The Prairie Lawn, Chicago.",
  },
  {
    name: "Jamaica64: United in Celebrating Resilience",
    date: "Sunday, August 2, 2026",
    to: "/jamaica64",
    image: jamaica64Flyer,
    description:
      "A day on the beach at Stiner Pavilion, Waukegan, IL, presented by One Love Music Festival.",
  },
];

export function pastEventsHead() {
  return {
    meta: [
      { title: "Past Events | TRC Events" },
      {
        name: "description",
        content: "A look back at past TRC Events shows and celebrations in Chicago.",
      },
      { property: "og:title", content: "Past Events | TRC Events" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/past-events` },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Past Events | TRC Events" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/past-events` }],
  };
}

export function PastEventsPage() {
  return (
    <div>
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="eyebrow mb-3">TRC Events</p>
          <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
            Past <span className="text-gradient-gold">Events</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            A look back at what's already gone down. Catch what's on now on{" "}
            <Link to="/" className="font-medium text-gold hover:underline">
              the homepage
            </Link>
            .
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {PAST_EVENTS.map((event) => (
            <a
              key={event.to}
              href={event.to}
              className="group flex gap-4 overflow-hidden rounded-xl border border-border bg-card p-4 transition-colors hover:border-gold/50"
            >
              <img
                src={event.image}
                alt={event.name}
                className="aspect-[3/4] w-24 shrink-0 rounded-lg object-cover"
              />
              <div>
                <h2 className="font-display text-lg font-semibold group-hover:text-gold">
                  {event.name}
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5 text-gold" /> {event.date}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
