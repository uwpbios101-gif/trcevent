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
//
// The list lives in Supabase (public.trc_past_events, see
// supabase/sql/trc_past_events_and_irie_jerk_rename.sql). To archive an event,
// insert a row there and add <ArchivedEventBanner /> to its page. FALLBACK_EVENTS
// below is what gets prerendered and what shows if Supabase can't be reached;
// keep it roughly in step with the table.
import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import charlyBlackFlyer from "@/assets/charly-black-flyer-buddyb.jpg";
import chicagoVybezFlyer from "@/assets/chicago-vybez-flyer-3.jpg";
import stCatherineFlyer from "@/assets/st-catherine-linkup-flyer.jpg";
import jamaicadayFlyer from "@/assets/jamaicaday-flyer.jpg";
import jamaica64Flyer from "@/assets/jamaica64-flyer.jpg";

const SITE_URL = "https://trcevent.com";

// Flyers bundled with the site, referenced by trc_past_events.image_key.
const BUNDLED_FLYERS: Record<string, string> = {
  "chicago-vybez": chicagoVybezFlyer,
  "charly-black": charlyBlackFlyer,
  "st-catherine-linkup": stCatherineFlyer,
  jamaicaday: jamaicadayFlyer,
  jamaica64: jamaica64Flyer,
};

type PastEvent = {
  slug: string;
  name: string;
  date: string;
  to: string;
  image: string | null;
  description: string;
};

// Newest first.
const FALLBACK_EVENTS: PastEvent[] = [
  {
    slug: "chicago-vybez",
    name: "Chicago Vybez — Prestige In The Park",
    date: "Labor Day Weekend, September 4–7, 2026",
    to: "/chicago-vybez",
    image: chicagoVybezFlyer,
    description:
      "Four days of sound systems, food and fresh cuts in the park, free all Labor Day weekend.",
  },
  {
    slug: "charly-black",
    name: "Charly Black — Good Times",
    date: "Friday, August 28, 2026",
    to: "/charly-black",
    image: charlyBlackFlyer,
    description:
      "Charly Black live in Chicago for a Historic Chicago Night at Bombay Banquet Hall.",
  },
  {
    slug: "st-catherine-linkup",
    name: "Bad Like Di 90's — St. Catherine Link-Up",
    date: "Saturday, August 22, 2026",
    to: "/st-catherine-linkup",
    image: stCatherineFlyer,
    description: "One Parish, One Link, One Community — free at ILU Club of Chicago, Dolton, IL.",
  },
  {
    slug: "jamaicaday",
    name: "Jamaica Independence Celebration",
    date: "Sunday, August 9, 2026",
    to: "/jamaicaday",
    image: jamaicadayFlyer,
    description:
      "Team Lenky's annual Jamaica Independence Celebration at The Prairie Lawn, Chicago.",
  },
  {
    slug: "jamaica64",
    name: "Jamaica64: United in Celebrating Resilience",
    date: "Sunday, August 2, 2026",
    to: "/jamaica64",
    image: jamaica64Flyer,
    description:
      "A day on the beach at Stiner Pavilion, Waukegan, IL, presented by One Love Music Festival.",
  },
];

type PastEventRow = {
  slug: string;
  name: string;
  date_label: string;
  path: string;
  image_key: string | null;
  image_url: string | null;
  description: string;
};

async function fetchPastEvents(): Promise<PastEvent[]> {
  const { data, error } = await supabase
    .from("trc_past_events")
    .select("slug, name, date_label, path, image_key, image_url, description")
    .order("event_date", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as PastEventRow[]).map((row) => ({
    slug: row.slug,
    name: row.name,
    date: row.date_label,
    to: row.path,
    image: (row.image_key && BUNDLED_FLYERS[row.image_key]) || row.image_url || null,
    description: row.description,
  }));
}

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
  const [events, setEvents] = useState<PastEvent[]>(FALLBACK_EVENTS);

  useEffect(() => {
    let cancelled = false;
    fetchPastEvents()
      .then((rows) => {
        if (!cancelled && rows.length > 0) setEvents(rows);
      })
      .catch((err) => {
        // Keep showing the bundled list.
        console.error("Failed to load past events:", err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
          {events.map((event) => (
            <a
              key={event.slug}
              href={event.to}
              className="group flex gap-4 overflow-hidden rounded-xl border border-border bg-card p-4 transition-colors hover:border-gold/50"
            >
              {event.image && (
                <img
                  src={event.image}
                  alt={event.name}
                  className="aspect-[3/4] w-24 shrink-0 rounded-lg object-cover"
                />
              )}
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
