import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { EventCard } from "@/components/site/EventCard";
import { FilterRow, Chip, EmptyState } from "./djs";
import { publishedEvents, GENRES, NEIGHBORHOODS, getVenue, type Genre } from "@/data/trc";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Find the Right Night — TRC Events" },
      {
        name: "description",
        content: "Browse upcoming reggae events across Chicago. Filter by genre and neighborhood.",
      },
      { property: "og:title", content: "Find the Right Night — TRC Events" },
      { property: "og:description", content: "Browse upcoming reggae events across Chicago." },
    ],
  }),
  component: EventsListing,
});

function EventsListing() {
  const [genre, setGenre] = useState<Genre | "All">("All");
  const [hood, setHood] = useState("All");

  const filtered = publishedEvents()
    .filter((e) => (genre === "All" ? true : e.genre === genre))
    .filter((e) => (hood === "All" ? true : getVenue(e.venueSlug)?.neighborhood === hood))
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.date.localeCompare(b.date));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="eyebrow mb-3">What's Connecting</p>
      <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
        Find the Right Night
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Every reggae night in the city, in one place. Roots to dancehall, Sunday sessions to
        sound clashes.
      </p>

      <div className="mt-8 space-y-4 rounded-xl border border-border bg-card p-5">
        <FilterRow label="Genre">
          <Chip active={genre === "All"} onClick={() => setGenre("All")}>All</Chip>
          {GENRES.map((g) => (
            <Chip key={g} active={genre === g} onClick={() => setGenre(g)}>{g}</Chip>
          ))}
        </FilterRow>
        <FilterRow label="Neighborhood">
          <Chip active={hood === "All"} onClick={() => setHood("All")}>All</Chip>
          {NEIGHBORHOODS.map((n) => (
            <Chip key={n} active={hood === n} onClick={() => setHood(n)}>{n}</Chip>
          ))}
        </FilterRow>
      </div>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <EventCard key={e.slug} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}