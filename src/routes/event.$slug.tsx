import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { CalendarDays, Clock, MapPin, Ticket, ArrowLeft, Share2, Instagram, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InitialsAvatar } from "@/components/site/Avatar";
import { DetailNotFound, DetailError } from "./dj.$slug";
import type { LineupSlot } from "@/data/trc";
import { getEvent, getVenue, getDJ, formatDate } from "@/data/trc";

export const Route = createFileRoute("/event/$slug")({
  loader: ({ params }) => {
    const event = getEvent(params.slug);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData }) => {
    const e = loaderData?.event;
    if (!e) return {};
    const title = `${e.title} | TRC Events`;
    const desc = e.description.slice(0, 155);
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:image", content: e.image },
        { name: "twitter:image", content: e.image },
      ],
    };
  },
  component: EventPage,
  notFoundComponent: () => <DetailNotFound label="event" to="/events" />,
  errorComponent: DetailError,
});

function EventPage() {
  const { event } = Route.useLoaderData();
  const venue = getVenue(event.venueSlug);
  const mapsSrc = venue
    ? `https://www.google.com/maps?q=${encodeURIComponent(venue.address)}&output=embed`
    : "";

  return (
    <div>
      <div className="relative h-72 sm:h-96">
        <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="mx-auto max-w-5xl px-4 pb-7 sm:px-6">
            <Badge variant="outline" className="mb-3 border-gold/40 text-gold">{event.genre}</Badge>
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">{event.title}</h1>
            <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-4 text-gold" />{formatDate(event.date)}</span>
              <span className="inline-flex items-center gap-1.5"><Clock className="size-4 text-gold" />{event.startTime}–{event.endTime}</span>
              {venue && <span className="inline-flex items-center gap-1.5"><MapPin className="size-4 text-gold" />{venue.name}</span>}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Link to="/events" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold">
          <ArrowLeft className="size-4" /> All events
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            <section>
              <h2 className="font-display text-xl font-bold">About this event</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{event.description}</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Presented by <span className="font-medium text-foreground">{event.promoter}</span>
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold">Lineup</h2>
              <div className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
                {event.lineup.map((slot: LineupSlot) => {
                  const dj = getDJ(slot.djSlug);
                  if (!dj) return null;
                  return (
                    <Link
                      key={slot.djSlug}
                      to="/dj/$slug"
                      params={{ slug: dj.slug }}
                      className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-accent/40"
                    >
                      <span className="w-14 text-sm font-semibold text-gold">{slot.setTime}</span>
                      <InitialsAvatar name={dj.artistName} accent={dj.accent} className="size-10 shrink-0 rounded-full text-xs" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium transition-colors group-hover:text-gold">{dj.artistName}</p>
                        <p className="truncate text-xs text-muted-foreground">{dj.genres.join(" · ")}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {venue && (
              <section>
                <h2 className="font-display text-xl font-bold">Venue</h2>
                <Link
                  to="/venue/$slug"
                  params={{ slug: venue.slug }}
                  className="mt-2 inline-block font-medium text-gold hover:underline"
                >
                  {venue.name}
                </Link>
                <p className="text-sm text-muted-foreground">{venue.address}</p>
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
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border border-gold/30 bg-card p-5 text-center">
              <p className="font-display text-2xl font-extrabold">
                {new Date(event.date + "T00:00:00").getDate()}
              </p>
              <p className="text-sm text-muted-foreground">{formatDate(event.date)}</p>
              <Button asChild variant="gold" className="mt-4 w-full">
                <a href={event.ticketUrl} target="_blank" rel="noreferrer">
                  <Ticket className="size-4" /> Get Tickets
                </a>
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">Powered by Ticket Tailor</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="eyebrow mb-3 flex items-center gap-1.5"><Share2 className="size-3.5" /> Share this event</h3>
              <div className="flex gap-2">
                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex flex-1 items-center justify-center rounded-lg border border-border py-2.5 text-muted-foreground transition-colors hover:border-gold hover:text-gold"
                    aria-label="Share"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}