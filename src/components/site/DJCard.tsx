import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import type { DJ } from "@/data/trc";
import { InitialsAvatar } from "./Avatar";
import { StarRating } from "./StarRating";
import { Badge } from "@/components/ui/badge";

export function DJCard({ dj }: { dj: DJ }) {
  return (
    <Link
      to="/dj/$slug"
      params={{ slug: dj.slug }}
      className="card-hover group flex flex-col overflow-hidden rounded-xl border border-border bg-card"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <InitialsAvatar
          name={dj.artistName}
          accent={dj.accent}
          className="h-full w-full text-5xl"
        />
        {dj.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-gold-foreground">
            <Sparkles className="size-3" /> Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg font-bold leading-tight transition-colors group-hover:text-gold">
          {dj.artistName}
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{dj.neighborhood}, Chicago</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {dj.genres.slice(0, 2).map((g) => (
            <Badge key={g} variant="outline" className="border-border text-muted-foreground">
              {g}
            </Badge>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <StarRating rating={dj.rating} count={dj.reviewCount} />
          <span className="text-xs font-medium text-gold">View profile</span>
        </div>
      </div>
    </Link>
  );
}