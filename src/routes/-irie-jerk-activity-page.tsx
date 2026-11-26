// Shared by src/routes/irie-jerk.$slug.tsx. The "-" prefix excludes this
// file from route generation (TanStack Router convention) — see
// src/routes/README.md.
//
// A single generic stub detail page for every row in irie_jerk_weekly_lineup
// that doesn't already have its own dedicated page (see irieJerkDetailHref in
// src/lib/irieJerkLineup.ts for the one exception, Dancehall101, which
// points at /dancehall-101 instead of here).
import { useEffect, useState } from "react";
import { CalendarDays, Clock, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchIrieJerkActivityBySlug, type IrieJerkLineupRow } from "@/lib/irieJerkLineup";

const SITE_URL = "https://trcevent.com";

// Static copy of each night's name and blurb from irie_jerk_weekly_lineup, so the
// prerendered HTML gets a real, page-specific <title>/description/canonical
// before the client-side Supabase fetch runs (search engines and link previews
// only see the prerendered head). Keep in sync when a row is added or renamed.
const ACTIVITY_SEO: Record<string, { name: string; day: string; blurb: string }> = {
  "sunday-sessions": { name: "Sunday Sessions", day: "Sundays", blurb: "Family dinner and open mic." },
  "sing-ova-sundays": { name: "Sing Ova Sundays", day: "Sundays", blurb: "Reggae, R&B and crossover residency, the week's Sunday gathering." },
  "soul-sundays": { name: "Soul Sundays", day: "Sundays", blurb: "A once-a-month Sunday upgrade with a live soul vocalist and band." },
  "nu2u-radio-sessions": { name: "NU2U Radio Sessions", day: "Mondays", blurb: "A daytime world-music, DJ-curated listening lounge." },
  "nu2u-radio-live": { name: "NU2U Radio Live", day: "Mondays", blurb: "A DJ-led world-music night." },
  "ackee-acid-jazz": { name: "Ackee & Acid Jazz", day: "Tuesdays", blurb: "Coffeehouse and acid jazz in a Caribbean-inflected daytime lounge." },
  "ackee-acid-jazz-after-dark": { name: "Ackee & Acid Jazz: After Dark", day: "Tuesdays", blurb: "The acid-jazz lounge continues after dark." },
  "just-laugh-wednesdays": { name: "Just Laugh Wednesdays", day: "Wednesdays", blurb: "Stand-up and open mic comedy." },
  "laugh-after-dark": { name: "Laugh After Dark", day: "Wednesdays", blurb: "Comedy's late set." },
  "dancehall101-hospitality": { name: "Dancehall101 Hospitality", day: "Fridays", blurb: "Food service all day, building into Friday's flagship night." },
  "swiftie-saturdays": { name: "Swiftie Saturdays", day: "Saturdays", blurb: "An Eras-themed, family-friendly daytime party." },
  "swiftie-saturdays-after-dark": { name: "Swiftie Saturdays: After Dark", day: "Saturdays", blurb: "The Eras-themed night continues after dark." },
};

export function irieJerkActivityHead({ params }: { params: { slug: string } }) {
  const seo = ACTIVITY_SEO[params.slug];
  const url = `${SITE_URL}/irie-jerk/${params.slug}`;
  const title = seo
    ? `${seo.name} | ${seo.day} at Irie Jerk | TRC Events`
    : "This Week at Irie Jerk | TRC Events";
  const description = seo
    ? `${seo.name} at Irie Jerk Bar and Grill, Calumet Park: ${seo.blurb}`
    : "Irie Jerk's weekly lineup — a different vibe every day and night.";
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

function activityTitleFromSlug(slug: string) {
  return ACTIVITY_SEO[slug]?.name ?? "This Week at Irie Jerk";
}

export function IrieJerkActivityPage({ slug }: { slug: string }) {
  const [activity, setActivity] = useState<IrieJerkLineupRow | null | undefined>(undefined);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchIrieJerkActivityBySlug(slug)
      .then((row) => {
        if (!cancelled) setActivity(row);
      })
      .catch((err) => {
        console.error("Failed to load Irie Jerk activity:", err);
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
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          {activityTitleFromSlug(slug)}
        </h1>
        <p className="mt-4 text-muted-foreground">Loading…</p>
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
          <UtensilsCrossed className="size-4 text-gold" /> At Irie Jerk
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
          <a href="/dinner-in-jamaica">See the full week at Irie Jerk</a>
        </Button>
      </div>
    </div>
  );
}
