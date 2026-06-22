import { Link } from "@tanstack/react-router";
import { CalendarDays, MapPin } from "lucide-react";
import { type TRCEvent, getVenue, formatDate } from "@/data/trc";
import { Badge } from "@/components/ui/badge";

export function EventCard({ event }: { event: TRCEvent }) {
  const venue = getVenue(event.venueSlug);
  return (
    <Link
      to="/event/$slug"
      params={{ slug: event.slug }}
      className="card-hover group flex flex-col overflow-hidden rounded-xl border border-border bg-card"
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-col items-center rounded-lg bg-background/85 px-3 py-1.5 text-center backdrop-blur-sm">
          <span className="text-lg font-bold leading-none text-gold">
            {new Date(event.date + "T00:00:00").getDate()}
          </span>
          <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">
            {new Date(event.date + "T00:00:00").toLocaleDateString("en-US", { month: "short" })}
          </span>
        </div>
        {event.featured && (
          <span className="absolute right-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-gold-foreground">
            Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <Badge variant="outline" className="mb-2 w-fit border-gold/40 text-gold">
          {event.genre}
        </Badge>
        <h3 className="font-display text-lg font-bold leading-tight transition-colors group-hover:text-gold">
          {event.title}
        </h3>
        <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5 text-gold" /> {formatDate(event.date)} · {event.startTime}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5 text-gold" /> {venue?.name}, {venue?.neighborhood}
          </span>
        </div>
      </div>
    </Link>
  );
}