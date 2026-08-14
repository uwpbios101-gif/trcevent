// Shared by src/routes/jerky-jerk.$slug.tsx. The "-" prefix excludes this
// file from route generation (TanStack Router convention) — see
// src/routes/README.md.
//
// A single generic stub detail page for every row in jerky_jerk_weekly_lineup
// that doesn't already have its own dedicated page (see jerkyJerkDetailHref in
// src/lib/jerkyJerkLineup.ts for the one exception, Dancehall101, which
// points at /dancehall-101 instead of here).
import { useEffect, useState } from "react";
import { CalendarDays, Clock, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchJerkyJerkActivityBySlug, type JerkyJerkLineupRow } from "@/lib/jerkyJerkLineup";

const SITE_URL = "https://trcevent.com";

export function jerkyJerkActivityHead() {
  return {
    meta: [
      { title: "This Week at Jerky Jerk | TRC Events" },
      {
        name: "description",
        content:
          "Jerky Jerk's weekly lineup — a different vibe every day and night, 100% alcohol-free.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/dinner-in-jamaica` }],
  };
}

export function JerkyJerkActivityPage({ slug }: { slug: string }) {
  const [activity, setActivity] = useState<JerkyJerkLineupRow | null | undefined>(undefined);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchJerkyJerkActivityBySlug(slug)
      .then((row) => {
        if (!cancelled) setActivity(row);
      })
      .catch((err) => {
        console.error("Failed to load Jerky Jerk activity:", err);
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <p className="text-muted-foreground">Something went wrong loading this page.</p>
      </div>
    );
  }

  if (activity === undefined) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (activity === null) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-3xl font-bold">We couldn't find that night</h1>
        <p className="mt-3 text-muted-foreground">
          It may have moved or been renamed as the weekly lineup evolves.
        </p>
        <Button asChild variant="gold" className="mt-6">
          <a href="/dinner-in-jamaica">See the full week</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="eyebrow mb-3 text-center">
        {activity.day_of_week} · {activity.phase === "day" ? "Day" : "Night"}
      </p>
      <h1 className="text-center font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
        {activity.name}
      </h1>

      <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        {activity.time_window && (
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4 text-gold" /> {activity.time_window}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <UtensilsCrossed className="size-4 text-gold" /> At Jerky Jerk
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="size-4 text-gold" />
          {activity.cover_charge ? `$${activity.cover_charge} cover` : "Free entry"}
        </span>
        {activity.is_21_plus && (
          <span className="rounded-sm border border-gold/50 px-1.5 py-0.5 text-xs font-medium text-gold">
            21+
          </span>
        )}
      </div>

      {activity.description && (
        <p className="mx-auto mt-8 max-w-lg text-center leading-relaxed text-muted-foreground">
          {activity.description}
        </p>
      )}

      {activity.is_monthly_special && (
        <p className="mx-auto mt-4 max-w-lg text-center text-sm italic text-muted-foreground">
          A once-a-month upgrade in this slot — check the calendar for the next date.
        </p>
      )}

      {(activity.signature_plate || activity.signature_drinks) && (
        <div className="mt-8 rounded-xl border border-border bg-card p-6 text-center">
          <p className="eyebrow mb-3">On the Menu</p>
          {activity.signature_plate && (
            <p className="font-display text-lg font-bold">{activity.signature_plate}</p>
          )}
          {activity.signature_drinks && (
            <p className="mt-2 text-sm text-muted-foreground">{activity.signature_drinks}</p>
          )}
        </div>
      )}

      {activity.alcohol_free && (
        <p className="mt-6 text-center text-xs text-muted-foreground">100% alcohol-free.</p>
      )}

      <div className="mt-10 text-center">
        <Button asChild variant="goldOutline">
          <a href="/dinner-in-jamaica">See the full week at Jerky Jerk</a>
        </Button>
      </div>
    </div>
  );
}
