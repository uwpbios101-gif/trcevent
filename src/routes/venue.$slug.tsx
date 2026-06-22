import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { MapPin, Users, Maximize, ArrowLeft, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/site/StarRating";
import { EventCard } from "@/components/site/EventCard";
import { DetailNotFound, DetailError } from "./dj.$slug";
import { getVenue, eventsAtVenue } from "@/data/trc";

export const Route = createFileRoute("/venue/$slug")({
  loader: ({ params }) => {
    const venue = getVenue(params.slug);
    if (!venue) throw notFound();
    return { venue };
  },
  head: ({ loaderData }) => {
    const v = loaderData?.venue;
    if (!v) return {};
    const title = `${v.name} — ${v.neighborhood} Venue | TRC Events`;
    const desc = `${v.name} in ${v.neighborhood}, Chicago. Capacity ${v.capacity}. ${v.techRider}`.slice(0, 155);
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:image", content: v.image },
        { name: "twitter:image", content: v.image },
      ],
    };
  },
  component: VenueProfile,
  notFoundComponent: () => <DetailNotFound label="venue" to="/venues" />,
  errorComponent: DetailError,
});

function VenueProfile() {
  const { venue } = Route.useLoaderData();
  const events = eventsAtVenue(venue.slug);
  const mapsSrc = `https://www.google.com/maps?q=${encodeURIComponent(venue.address)}&output=embed`;

  return (
    <div>
      <div className="relative h-64 sm:h-80">
        <img src={venue.image} alt={venue.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="mx-auto max-w-5xl px-4 pb-6 sm:px-6">
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{venue.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><MapPin className="size-4 text-gold" />{venue.neighborhood}</span>
              <span className="inline-flex items-center gap-1.5"><Users className="size-4 text-gold" />{venue.capacity} capacity</span>
              <StarRating rating={venue.rating} count={venue.reviewCount} />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Link to="/venues" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold">
          <ArrowLeft className="size-4" /> All venues
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            <section className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Stat icon={Users} label="Capacity" value={`${venue.capacity}`} />
              <Stat icon={Maximize} label="Stage" value={venue.stageSize} />
              <Stat icon={MapPin} label="Neighborhood" value={venue.neighborhood} />
            </section>

            <section>
              <h2 className="font-display text-xl font-bold">Tech Rider</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{venue.techRider}</p>
              <p className="mt-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Sound restrictions: </span>
                {venue.soundRestrictions}
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold">Location</h2>
              <p className="mt-2 text-sm text-muted-foreground">{venue.address}</p>
              <div className="mt-4 overflow-hidden rounded-xl border border-border">
                <iframe
                  className="aspect-video w-full"
                  src={mapsSrc}
                  title={`Map of ${venue.name}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </section>

            {events.length > 0 && (
              <section>
                <h2 className="font-display text-xl font-bold">Upcoming at this venue</h2>
                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  {events.map((e) => (
                    <EventCard key={e.slug} event={e} />
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border border-gold/30 bg-card p-5 text-center">
              <p className="font-display text-lg font-bold">Host your night here</p>
              <p className="mt-1 text-sm text-muted-foreground">Reach out to check availability.</p>
              <Button variant="gold" className="mt-4 w-full">Inquire About This Venue</Button>
              <a
                href={venue.website}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-gold"
              >
                <Globe className="size-4" /> Visit website
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <Icon className="size-5 text-gold" />
      <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  );
}