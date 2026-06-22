import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { DJCard } from "@/components/site/DJCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { djs, GENRES, NEIGHBORHOODS, type Genre } from "@/data/trc";

export const Route = createFileRoute("/djs")({
  head: () => ({
    meta: [
      { title: "Find the Right Selector — TRC Events DJ Directory" },
      {
        name: "description",
        content: "Browse Chicago's finest reggae DJs and selectors. Filter by genre, neighborhood, and more.",
      },
      { property: "og:title", content: "Find the Right Selector — TRC Events" },
      { property: "og:description", content: "Browse Chicago's finest reggae DJs and selectors." },
    ],
  }),
  component: DJDirectory,
});

function DJDirectory() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<Genre | "All">("All");
  const [hood, setHood] = useState<string>("All");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const filtered = djs
    .filter((d) => (genre === "All" ? true : d.genres.includes(genre)))
    .filter((d) => (hood === "All" ? true : d.neighborhood === hood))
    .filter((d) => (featuredOnly ? d.featured : true))
    .filter((d) =>
      query ? d.artistName.toLowerCase().includes(query.toLowerCase()) : true,
    )
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="eyebrow mb-3">The Directory</p>
      <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
        Find the Right Selector
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Chicago's deepest roster of reggae DJs and selectors. Browse, filter, and book the
        right sound for your night.
      </p>

      {/* Filters */}
      <div className="mt-8 space-y-4 rounded-xl border border-border bg-card p-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search selectors by name…"
            className="pl-9"
          />
        </div>
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
        <FilterRow label="Featured">
          <Chip active={!featuredOnly} onClick={() => setFeaturedOnly(false)}>All</Chip>
          <Chip active={featuredOnly} onClick={() => setFeaturedOnly(true)}>Featured only</Chip>
        </FilterRow>
      </div>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((dj) => (
            <DJCard key={dj.slug} dj={dj} />
          ))}
        </div>
      )}
    </div>
  );
}

export function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="w-28 shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-gold bg-gold text-gold-foreground"
          : "border-border text-muted-foreground hover:border-gold/50 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function EmptyState() {
  return (
    <div className="mt-12 rounded-xl border border-dashed border-border py-20 text-center">
      <Badge variant="outline" className="border-gold/40 text-gold">No matches</Badge>
      <p className="mt-4 font-display text-lg">No matches found.</p>
      <p className="mt-1 text-sm text-muted-foreground">
        The reggae connection is out there — try broader filters.
      </p>
    </div>
  );
}