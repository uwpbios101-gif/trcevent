import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { VenueCard } from "@/components/site/VenueCard";
import { FilterRow, Chip, EmptyState } from "./djs";
import { venues, NEIGHBORHOODS } from "@/data/trc";

export const Route = createFileRoute("/venues")({
  head: () => ({
    meta: [
      { title: "Find the Right Room — TRC Events Venue Directory" },
      {
        name: "description",
        content: "Discover Chicago venues built for reggae. Filter by neighborhood and capacity.",
      },
      { property: "og:title", content: "Find the Right Room — TRC Events" },
      { property: "og:description", content: "Discover Chicago venues built for reggae." },
    ],
  }),
  component: VenueDirectory,
});

const CAPACITIES = [
  { label: "All", min: 0 },
  { label: "Under 250", min: 0, max: 250 },
  { label: "250–500", min: 250, max: 500 },
  { label: "500+", min: 500 },
];

function VenueDirectory() {
  const [hood, setHood] = useState("All");
  const [cap, setCap] = useState(0);
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const filtered = venues
    .filter((v) => (hood === "All" ? true : v.neighborhood === hood))
    .filter((v) => {
      const c = CAPACITIES[cap];
      return v.capacity >= (c.min ?? 0) && (c.max ? v.capacity < c.max : true);
    })
    .filter((v) => (featuredOnly ? v.featured : true))
    .sort((a, b) => Number(b.featured) - Number(a.featured));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="eyebrow mb-3">The Directory</p>
      <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
        Find the Right Room
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        From intimate Hyde Park rooms to Bronzeville sound halls — find the venue that fits
        your sound.
      </p>

      <div className="mt-8 space-y-4 rounded-xl border border-border bg-card p-5">
        <FilterRow label="Neighborhood">
          <Chip active={hood === "All"} onClick={() => setHood("All")}>All</Chip>
          {NEIGHBORHOODS.map((n) => (
            <Chip key={n} active={hood === n} onClick={() => setHood(n)}>{n}</Chip>
          ))}
        </FilterRow>
        <FilterRow label="Capacity">
          {CAPACITIES.map((c, i) => (
            <Chip key={c.label} active={cap === i} onClick={() => setCap(i)}>{c.label}</Chip>
          ))}
        </FilterRow>
        <FilterRow label="Featured">
          <Chip active={!featuredOnly} onClick={() => setFeaturedOnly(false)}>All</Chip>
          <Chip active={featuredOnly} onClick={() => setFeaturedOnly(true)}>Featured only</Chip>
        </FilterRow>
      </div>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => (
            <VenueCard key={v.slug} venue={v} />
          ))}
        </div>
      )}
    </div>
  );
}