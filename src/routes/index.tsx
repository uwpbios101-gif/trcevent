import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import heroBg from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/site/SectionHeader";
import { DJCard } from "@/components/site/DJCard";
import { VenueCard } from "@/components/site/VenueCard";
import { EventCard } from "@/components/site/EventCard";
import { InitialsAvatar } from "@/components/site/Avatar";
import { StarRating } from "@/components/site/StarRating";
import {
  featuredDJs,
  topDJs,
  featuredVenues,
  featuredSponsors,
  upcomingEvents,
  sponsorOrder,
  NEIGHBORHOODS,
  djs,
} from "@/data/trc";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TRC Events — Where Chicago Makes The Right Connection" },
      {
        name: "description",
        content:
          "Discover Chicago's reggae scene with TRC Events. Find DJs, venues, and events — and make the right connection.",
      },
      { property: "og:title", content: "TRC Events — Where Chicago Makes The Right Connection" },
      {
        property: "og:description",
        content: "Chicago's home for reggae DJs, promoters, venues, and community.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const spotlight = djs.find((d) => d.slug === "sister-nyah")!;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={heroBg}
          alt=""
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
        <div className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 sm:py-36 lg:py-44">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4">The Right Connection · The Reggae Connection</p>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Where Chicago Makes <span className="text-gradient-gold">The Right Connection.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              TRC Events — the platform connecting Chicago's reggae DJs, promoters,
              venues, and community.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild variant="gold" size="xl">
                <Link to="/events">Find Events</Link>
              </Button>
              <Button asChild variant="goldOutline" size="xl">
                <Link to="/djs">Make Your Connection</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-24 px-4 py-20 sm:px-6">
        {/* Featured DJs */}
        <section>
          <SectionHeader
            eyebrow="The Right Selectors"
            title="Featured DJs"
            to="/djs"
            linkLabel="All selectors"
          />
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {featuredDJs().slice(0, 4).map((dj) => (
              <DJCard key={dj.slug} dj={dj} />
            ))}
          </div>
        </section>

        {/* Upcoming Events */}
        <section>
          <SectionHeader
            eyebrow="What's Connecting This Week"
            title="Upcoming Events"
            to="/events"
            linkLabel="All events"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents().slice(0, 3).map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        </section>

        {/* Explore by Neighborhood */}
        <section>
          <SectionHeader eyebrow="Chicago by Sound" title="Explore by Neighborhood" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {NEIGHBORHOODS.map((n) => (
              <Link
                key={n}
                to="/events"
                className="card-hover group flex items-center justify-between rounded-xl border border-border bg-card px-4 py-5"
              >
                <span className="font-display font-semibold transition-colors group-hover:text-gold">
                  {n}
                </span>
                <MapPin className="size-4 text-gold opacity-60 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Venues */}
        <section>
          <SectionHeader
            eyebrow="The Right Rooms"
            title="Featured Venues"
            to="/venues"
            linkLabel="All venues"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredVenues().map((venue) => (
              <VenueCard key={venue.slug} venue={venue} />
            ))}
          </div>
        </section>

        {/* Community Spotlight */}
        <section className="overflow-hidden rounded-2xl border border-gold/30 bg-card">
          <div className="grid items-center gap-8 p-8 sm:p-12 md:grid-cols-[auto_1fr]">
            <InitialsAvatar
              name={spotlight.artistName}
              accent={spotlight.accent}
              className="mx-auto size-32 rounded-2xl text-4xl md:size-40 md:text-5xl"
            />
            <div>
              <p className="eyebrow mb-3">Community Spotlight</p>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">{spotlight.artistName}</h2>
              <div className="mt-2">
                <StarRating rating={spotlight.rating} count={spotlight.reviewCount} size="md" />
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {spotlight.bio}
              </p>
              <Button asChild variant="gold" size="sm" className="mt-6">
                <Link to="/dj/$slug" params={{ slug: spotlight.slug }}>
                  View Profile <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Top DJs */}
        <section>
          <SectionHeader eyebrow="Trending Now" title="Top DJs in Chicago" to="/djs" linkLabel="All selectors" />
          <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {topDJs().map((dj, i) => (
              <Link
                key={dj.slug}
                to="/dj/$slug"
                params={{ slug: dj.slug }}
                className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-accent/40"
              >
                <span className="w-6 font-display text-xl font-bold text-gold">{i + 1}</span>
                <InitialsAvatar
                  name={dj.artistName}
                  accent={dj.accent}
                  className="size-11 shrink-0 rounded-full text-sm"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold transition-colors group-hover:text-gold">
                    {dj.artistName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {dj.genres.join(" · ")}
                  </p>
                </div>
                <StarRating rating={dj.rating} />
              </Link>
            ))}
          </div>
        </section>

        {/* Sponsors */}
        <section>
          <SectionHeader eyebrow="Powered By" title="Our Sponsors" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {[...featuredSponsors()]
              .sort((a, b) => sponsorOrder.indexOf(a.level) - sponsorOrder.indexOf(b.level))
              .map((s) => (
                <a
                  key={s.slug}
                  href={s.website}
                  target="_blank"
                  rel="noreferrer"
                  className="card-hover flex flex-col items-center justify-center rounded-xl border border-border bg-card p-6 text-center"
                >
                  <span className="font-display text-lg font-bold">{s.name}</span>
                  <span className="mt-2 rounded-full border border-gold/40 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-gold">
                    {s.level}
                  </span>
                </a>
              ))}
          </div>
        </section>
      </div>

      {/* Join CTA */}
      <section className="relative overflow-hidden border-t border-border bg-card">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <p className="eyebrow mb-4">Join The Movement</p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Make the right connection.{" "}
            <span className="text-gradient-gold">Join TRC Events.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Whether you spin, promote, host, or just love the sound — your place in
            Chicago's reggae community starts here.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="gold" size="xl">
              <Link to="/djs">Create Your Profile</Link>
            </Button>
            <Button asChild variant="goldOutline" size="xl">
              <Link to="/events">Browse Events</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
