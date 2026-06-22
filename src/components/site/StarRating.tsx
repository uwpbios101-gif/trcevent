import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  count,
  size = "sm",
}: {
  rating: number;
  count?: number;
  size?: "sm" | "md";
}) {
  const dim = size === "md" ? "size-4" : "size-3.5";
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(
              dim,
              i <= Math.round(rating) ? "fill-gold text-gold" : "text-border",
            )}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-foreground">{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </div>
  );
}