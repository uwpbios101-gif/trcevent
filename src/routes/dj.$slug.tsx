import { createFileRoute, notFound, useRouter, Link } from "@tanstack/react-router";
import { Instagram, Youtube, Music, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InitialsAvatar } from "@/components/site/Avatar";
import { StarRating } from "@/components/site/StarRating";
import { getDJ, djReviews, formatDate } from "@/data/trc";

export const Route = createFileRoute("/dj/$slug")({
  loader: ({ params }) => {
    const dj = getDJ(params.slug);
    if (!dj) throw notFound();
    return { dj };
  },
  head: ({ loaderData }) => {
    const dj = loaderData?.dj;
    if (!dj) return {};
    const title = `${dj.artistName} — Reggae Selector | TRC Events`;
    const desc = dj.bio.slice(0, 155);
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "profile" },
      ],
    };
  },
  component: DJProfile,
  notFoundComponent: () => <DetailNotFound label="selector" to="/djs" />,
  errorComponent: DetailError,
});

function DJProfile() {
  const { dj } = Route.useLoaderData();
  const reviews = djReviews(dj.slug);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link to="/djs" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold">
        <ArrowLeft className="size-4" /> All selectors
      </Link>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <InitialsAvatar
          name={dj.artistName}
          accent={dj.accent}
          className="size-28 shrink-0 rounded-2xl text-4xl"
        />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl font-extrabold tracking-tight">{dj.artistName}</h1>
            {dj.featured && (
              <Badge className="bg-gold text-gold-foreground hover:bg-gold">Featured</Badge>
            )}
            {dj.premium && (
              <Badge variant="outline" className="border-gold/40 text-gold">Premium</Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {dj.realName} · {dj.neighborhood}, Chicago · {dj.yearsActive} years active
          </p>
          <div className="mt-3">
            <StarRating rating={dj.rating} count={dj.reviewCount} size="md" />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {dj.genres.map((g: string) => (
              <Badge key={g} variant="outline" className="border-border text-muted-foreground">{g}</Badge>
            ))}
          </div>
        </div>
        <Button variant="gold" size="lg" className="shrink-0">Book This DJ</Button>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-10">
          <section>
            <h2 className="font-display text-xl font-bold">Biography</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{dj.bio}</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold">Listen</h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              <iframe
                className="aspect-video w-full"
                src={`https://www.youtube.com/embed/${dj.audioEmbed}`}
                title={`${dj.artistName} mix`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold">Gallery</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {dj.gallery.map((img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  alt={`${dj.artistName} performing`}
                  loading="lazy"
                  className="aspect-square w-full rounded-lg object-cover"
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold">
              Reviews <span className="text-muted-foreground">({reviews.length})</span>
            </h2>
            <div className="mt-4 space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{r.reviewer}</span>
                    <StarRating rating={r.rating} />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{formatDate(r.date)}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="eyebrow mb-3">Equipment & Sound</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{dj.equipment}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="eyebrow mb-3">Connect</h3>
            <div className="space-y-2">
              {dj.social.instagram && (
                <SocialLink icon={Instagram} label={`@${dj.social.instagram}`} />
              )}
              {dj.social.youtube && <SocialLink icon={Youtube} label="YouTube" />}
              {dj.social.soundcloud && <SocialLink icon={Music} label="SoundCloud" />}
            </div>
          </div>
          <div className="rounded-xl border border-gold/30 bg-card p-5 text-center">
            <p className="font-display text-lg font-bold">Want to book {dj.artistName}?</p>
            <p className="mt-1 text-sm text-muted-foreground">Send a request — the right connection is one click away.</p>
            <Button variant="gold" className="mt-4 w-full">Book This DJ</Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SocialLink({ icon: Icon, label }: { icon: typeof Instagram; label: string }) {
  return (
    <a href="#" className="flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-gold">
      <Icon className="size-4 text-gold" /> {label}
    </a>
  );
}

export function DetailNotFound({ label, to }: { label: string; to: string }) {
  return (
    <div className="mx-auto max-w-md px-4 py-28 text-center">
      <h1 className="font-display text-2xl font-bold">We couldn't find that {label}.</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The reggae connection is out there — try the directory.
      </p>
      <Button asChild variant="gold" className="mt-6">
        <Link to={to}>Back to directory</Link>
      </Button>
    </div>
  );
}

export function DetailError({ reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-md px-4 py-28 text-center">
      <h1 className="font-display text-2xl font-bold">Something went wrong.</h1>
      <p className="mt-2 text-sm text-muted-foreground">Try again in a moment.</p>
      <Button
        variant="gold"
        className="mt-6"
        onClick={() => {
          router.invalidate();
          reset();
        }}
      >
        Try again
      </Button>
    </div>
  );
}