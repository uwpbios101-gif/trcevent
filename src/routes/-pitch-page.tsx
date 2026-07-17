// Shared by src/routes/pitch.$slug.tsx. The "-" prefix excludes this file
// from route generation (TanStack Router convention) — see
// src/routes/README.md.
//
// Generic, fully data-driven pitch-deck viewer: fetches one deck (pitch +
// ordered slides) from the public get-pitch Edge Function by slug and lets
// the reader flip through it like a slideshow. This is the ONE frontend
// component for every venue pitch — see migration 0020 (pitches,
// pitch_slides) and create-pitch. Adding pitch #301 next year should never
// require touching this file; it should only ever need a new DB row.
//
// This page is client-hydrated, not build-time prerendered: the site is a
// static export with no server at runtime (crawlLinks-based prerendering),
// so a brand-new pitch added months from now (just a DB insert, no git
// push) still needs to resolve on GitHub Pages. dist/client/404.html is a
// copy of the SPA shell for exactly this reason — see .github/workflows/deploy.yml.
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, CheckCircle2, Sparkles } from "lucide-react";

import { supabase } from "@/lib/supabase";

const SITE_URL = "https://trcevent.com";

export function pitchHead() {
  return {
    meta: [
      { title: "Partnership Proposal | TRC Events" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/pitch` }],
  };
}

type Pitch = {
  slug: string;
  venue_name: string;
  venue_address: string;
  contact_name: string;
  contact_title: string;
  contact_phone: string;
  contact_email: string;
  prepared_by_name: string;
  prepared_by_org: string;
  pitch_date: string | null;
  logo_url: string | null;
  status: string;
};

type Slide = {
  position: number;
  layout: string;
  kicker: string;
  heading: string;
  subheading: string;
  // deliberately loose -- shape depends on `layout`, see each renderer below
  body: Record<string, unknown>;
  image_url: string | null;
};

function formatDate(value: string | null) {
  if (!value) return "";
  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Kicker({ children }: { children: string }) {
  if (!children) return null;
  return <p className="eyebrow mb-3">{children}</p>;
}

function SlideShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col justify-center px-6 py-10 sm:px-10">
      {children}
    </div>
  );
}

function CoverSlide({ pitch, slide }: { pitch: Pitch; slide: Slide }) {
  const cadence = (slide.body.cadence as string) ?? "";
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-10 text-center">
      {pitch.logo_url && (
        <img
          src={pitch.logo_url}
          alt={`${pitch.prepared_by_org || pitch.prepared_by_name} logo`}
          className="mb-8 max-h-28 w-auto object-contain"
        />
      )}
      <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
        {slide.heading}
      </h1>
      <div className="mx-auto my-6 h-px w-40 bg-gold/50" />
      {slide.subheading && (
        <p className="max-w-xl text-lg text-muted-foreground sm:text-xl">{slide.subheading}</p>
      )}
      {cadence && <p className="mt-3 text-sm tracking-wide text-gold">{cadence}</p>}

      <div className="mt-12 grid w-full max-w-lg gap-1 text-sm text-muted-foreground sm:grid-cols-2 sm:text-left">
        <div>
          <p className="text-xs uppercase tracking-wide text-gold/80">Prepared for</p>
          <p className="text-foreground">{pitch.contact_name}</p>
          <p>{pitch.contact_title}</p>
          <p>{pitch.venue_address}</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <p className="text-xs uppercase tracking-wide text-gold/80">Prepared by</p>
          <p className="text-foreground">{pitch.prepared_by_name}</p>
          <p>{pitch.prepared_by_org}</p>
          <p>{formatDate(pitch.pitch_date)}</p>
        </div>
      </div>
    </div>
  );
}

function StatementSlide({ slide }: { slide: Slide }) {
  const points = (slide.body.points as string[]) ?? [];
  return (
    <SlideShell>
      <Kicker>{slide.kicker}</Kicker>
      <h2 className="font-display text-2xl font-bold sm:text-4xl">{slide.heading}</h2>
      {points.length > 0 && (
        <ul className="mt-8 space-y-4">
          {points.map((point, i) => (
            <li key={i} className="flex gap-3 rounded-xl border border-border bg-card p-4">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-gold" />
              <span className="text-sm text-muted-foreground sm:text-base">{point}</span>
            </li>
          ))}
        </ul>
      )}
    </SlideShell>
  );
}

function PointsSlide({ slide }: { slide: Slide }) {
  const points = (slide.body.points as { title: string; text: string }[]) ?? [];
  return (
    <SlideShell>
      <Kicker>{slide.kicker}</Kicker>
      <h2 className="font-display text-2xl font-bold sm:text-4xl">{slide.heading}</h2>
      {slide.subheading && (
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">{slide.subheading}</p>
      )}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {points.map((p, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <p className="font-display text-base font-semibold text-gold">{p.title}</p>
            <p className="mt-1.5 text-sm text-muted-foreground">{p.text}</p>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}

function CrowdSlide({ slide }: { slide: Slide }) {
  const quote = (slide.body.quote as string) ?? "";
  const region = (slide.body.region as string) ?? "";
  const groups = (slide.body.groups as string) ?? "";
  return (
    <SlideShell>
      <Kicker>{slide.kicker}</Kicker>
      <h2 className="font-display text-2xl font-bold sm:text-4xl">{slide.heading}</h2>
      {quote && (
        <p className="font-display mt-6 text-lg italic text-gold sm:text-xl">
          &ldquo;{quote}&rdquo;
        </p>
      )}
      {region && <p className="mt-4 text-sm font-semibold uppercase tracking-wide">{region}</p>}
      {groups && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{groups}</p>}
    </SlideShell>
  );
}

function TimelineSlide({ slide }: { slide: Slide }) {
  const items = (slide.body.items as { time: string; label: string }[]) ?? [];
  return (
    <SlideShell>
      <Kicker>{slide.kicker}</Kicker>
      <h2 className="font-display text-2xl font-bold sm:text-4xl">{slide.heading}</h2>
      <div className="mt-8 space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-baseline sm:gap-4"
          >
            <span className="font-display shrink-0 text-sm font-semibold text-gold sm:w-28">
              {item.time}
            </span>
            <span className="text-sm text-muted-foreground sm:text-base">{item.label}</span>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}

function CriteriaSlide({ slide }: { slide: Slide }) {
  const date = (slide.body.date as string) ?? "";
  const minAttendance = (slide.body.minAttendance as string) ?? "";
  const criteria = (slide.body.criteria as string[]) ?? [];
  const note = (slide.body.note as string) ?? "";
  return (
    <SlideShell>
      <Kicker>{slide.kicker}</Kicker>
      <h2 className="font-display text-2xl font-bold sm:text-4xl">{slide.heading}</h2>
      {date && (
        <div className="mt-6 rounded-xl border border-gold/40 bg-gold/5 p-4">
          <p className="text-xs uppercase tracking-wide text-gold/80">Pilot launch date</p>
          <p className="font-display text-lg font-semibold">{date}</p>
        </div>
      )}
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {minAttendance && (
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-3 text-sm">
            <CheckCircle2 className="size-4 shrink-0 text-gold" /> {minAttendance}
          </div>
        )}
        {criteria.map((c, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-lg border border-border bg-card p-3 text-sm"
          >
            <CheckCircle2 className="size-4 shrink-0 text-gold" /> {c}
          </div>
        ))}
      </div>
      {note && <p className="mt-6 text-sm italic text-muted-foreground">{note}</p>}
    </SlideShell>
  );
}

function RolesSlide({ slide }: { slide: Slide }) {
  const venueName = (slide.body.venueName as string) ?? "";
  const venueTasks = (slide.body.venueTasks as string[]) ?? [];
  const trcTasks = (slide.body.trcTasks as string[]) ?? [];
  const sharedNote = (slide.body.sharedNote as string) ?? "";
  return (
    <SlideShell>
      <Kicker>{slide.kicker}</Kicker>
      <h2 className="font-display text-2xl font-bold sm:text-4xl">{slide.heading}</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="font-display text-sm font-semibold uppercase tracking-wide text-gold">
            {venueName}
          </p>
          <ul className="mt-3 space-y-2">
            {venueTasks.map((t, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gold" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="font-display text-sm font-semibold uppercase tracking-wide text-gold">
            TRC Events
          </p>
          <ul className="mt-3 space-y-2">
            {trcTasks.map((t, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gold" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {sharedNote && (
        <p className="mt-4 rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Both partners: </span>
          {sharedNote}
        </p>
      )}
    </SlideShell>
  );
}

function CostSlide({ slide }: { slide: Slide }) {
  const items = (slide.body.items as { number: string; label: string }[]) ?? [];
  const notes = (slide.body.notes as string[]) ?? [];
  return (
    <SlideShell>
      <Kicker>{slide.kicker}</Kicker>
      <h2 className="font-display text-2xl font-bold sm:text-4xl">{slide.heading}</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 text-center">
            <p className="font-display text-3xl font-bold text-gold">{item.number}</p>
            <p className="mt-1.5 text-xs text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
      {notes.length > 0 && (
        <ul className="mt-6 space-y-2">
          {notes.map((n, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gold" /> {n}
            </li>
          ))}
        </ul>
      )}
    </SlideShell>
  );
}

function GrowthSlide({ slide }: { slide: Slide }) {
  const stages = (slide.body.stages as { title: string; text: string }[]) ?? [];
  return (
    <SlideShell>
      <Kicker>{slide.kicker}</Kicker>
      <h2 className="font-display text-2xl font-bold sm:text-4xl">{slide.heading}</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        {stages.map((s, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold">{s.title}</p>
            <p className="mt-1.5 text-sm text-muted-foreground">{s.text}</p>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}

function GratitudeSlide({ slide }: { slide: Slide }) {
  const paragraph = (slide.body.paragraph as string) ?? "";
  const signoff = (slide.body.signoff as string) ?? "";
  return (
    <SlideShell>
      <Kicker>{slide.kicker}</Kicker>
      <h2 className="font-display text-2xl font-bold sm:text-4xl">{slide.heading}</h2>
      {paragraph && (
        <p className="mt-6 text-base leading-relaxed text-muted-foreground">{paragraph}</p>
      )}
      {signoff && <p className="mt-6 text-sm text-gold">{signoff}</p>}
    </SlideShell>
  );
}

function NextStepsSlide({ slide }: { slide: Slide }) {
  const steps = (slide.body.steps as { n: number; text: string }[]) ?? [];
  const footer = (slide.body.footer as string) ?? "";
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-10 text-center">
      <h2 className="font-display text-3xl font-bold sm:text-5xl">{slide.heading}</h2>
      <div className="mx-auto my-6 h-px w-40 bg-gold/50" />
      <div className="w-full max-w-xl space-y-3 text-left">
        {steps.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gold font-display text-sm font-bold text-gold-foreground">
              {s.n}
            </span>
            <span className="text-sm sm:text-base">{s.text}</span>
          </div>
        ))}
      </div>
      {footer && <p className="mt-10 text-xs text-muted-foreground">{footer}</p>}
    </div>
  );
}

function SlideContent({ pitch, slide }: { pitch: Pitch; slide: Slide }) {
  switch (slide.layout) {
    case "cover":
      return <CoverSlide pitch={pitch} slide={slide} />;
    case "statement":
      return <StatementSlide slide={slide} />;
    case "points":
      return <PointsSlide slide={slide} />;
    case "crowd":
      return <CrowdSlide slide={slide} />;
    case "timeline":
      return <TimelineSlide slide={slide} />;
    case "criteria":
      return <CriteriaSlide slide={slide} />;
    case "roles":
      return <RolesSlide slide={slide} />;
    case "cost":
      return <CostSlide slide={slide} />;
    case "growth":
      return <GrowthSlide slide={slide} />;
    case "gratitude":
      return <GratitudeSlide slide={slide} />;
    case "next-steps":
      return <NextStepsSlide slide={slide} />;
    default:
      return (
        <SlideShell>
          <Kicker>{slide.kicker}</Kicker>
          <h2 className="font-display text-2xl font-bold">{slide.heading}</h2>
        </SlideShell>
      );
  }
}

export function PitchPage({ slug }: { slug: string }) {
  const [pitch, setPitch] = useState<Pitch | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke("get-pitch", {
        body: { slug },
      });
      if (cancelled) return;
      if (error || !data?.pitch) {
        setNotFound(true);
      } else {
        setPitch(data.pitch);
        setSlides(data.slides ?? []);
      }
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const goTo = useCallback(
    (next: number) => {
      setIndex((prev) => {
        const clamped = Math.max(0, Math.min(next, slides.length - 1));
        return clamped;
      });
    },
    [slides.length],
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") goTo(index + 1);
      if (e.key === "ArrowLeft") goTo(index - 1);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, goTo]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) goTo(index + (delta < 0 ? 1 : -1));
    touchStartX.current = null;
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-gold" />
      </div>
    );
  }

  if (notFound || !pitch) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="font-display text-2xl font-bold">This proposal isn't available.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Double-check the link, or reach out to TRC Events directly.
        </p>
      </div>
    );
  }

  const slide = slides[index];

  return (
    <div
      className="relative flex min-h-[80vh] flex-col bg-background"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex-1">{slide && <SlideContent pitch={pitch} slide={slide} />}</div>

      <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-4 sm:px-8">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          aria-label="Previous slide"
          className="flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-gold hover:text-gold disabled:opacity-30"
        >
          <ChevronLeft className="size-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden gap-1.5 sm:flex">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`size-1.5 rounded-full transition-colors ${
                  i === index ? "bg-gold" : "bg-border"
                }`}
              />
            ))}
          </div>
          <span className="tabular-nums text-xs text-muted-foreground">
            {index + 1} / {slides.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={index === slides.length - 1}
          aria-label="Next slide"
          className="flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-gold hover:text-gold disabled:opacity-30"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}
