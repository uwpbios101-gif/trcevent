import { Link } from "@tanstack/react-router";
import { MapPin, Users } from "lucide-react";
import type { Venue } from "@/data/trc";
import { StarRating } from "./StarRating";

export function VenueCard({ venue }: { venue: Venue }) {
  return (
    <Link
      to="/venue/$slug"
      params={{ slug: venue.slug }}
      className="card-hover group flex flex-col overflow-hidden rounded-xl border border-border bg-card"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={venue.image}
          alt={venue.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
        {venue.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-gold-foreground">
            Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg font-bold leading-tight transition-colors group-hover:text-gold">
          {venue.name}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5 text-gold" /> {venue.neighborhood}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="size-3.5 text-gold" /> {venue.capacity} cap
          </span>
        </div>
        <div className="mt-4 border-t border-border pt-3">
          <StarRating rating={venue.rating} count={venue.reviewCount} />
        </div>
      </div>
    </Link>
  );
}