// Shared by /events and /dinner-in-jamaica -- the day-by-day grid of Jerky
// Jerk's weekly lineup, fetched from jerky_jerk_weekly_lineup (see
// src/lib/jerkyJerkLineup.ts). Extracted here so both pages render the same
// data the same way rather than maintaining two copies.
import { useEffect, useState } from "react";
import {
  fetchJerkyJerkLineup,
  jerkyJerkDetailHref,
  type JerkyJerkLineupRow,
} from "@/lib/jerkyJerkLineup";

const DAY_ORDER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function ActivityCard({ activity }: { activity: JerkyJerkLineupRow }) {
  return (
    <a
      href={jerkyJerkDetailHref(activity)}
      className={
        activity.is_flagship
          ? "block rounded-xl border-2 border-gold bg-gold/10 p-3 shadow-lg shadow-gold/20 transition-colors hover:border-gold"
          : "block rounded-xl border border-border bg-card p-3 transition-colors hover:border-gold/50"
      }
    >
      {activity.is_flagship && (
        <span className="mb-2 inline-block whitespace-nowrap rounded-full bg-gold px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-gold-foreground">
          Biggest Night
        </span>
      )}
      <p className="text-[0.65rem] uppercase tracking-wide text-muted-foreground">
        {activity.phase === "day" ? "Day" : "Night"}
        {activity.time_window ? ` · ${activity.time_window}` : ""}
      </p>
      <p className="mt-1 font-display text-base font-bold">{activity.name}</p>
      {activity.description && (
        <p className="mt-1.5 text-xs text-muted-foreground">{activity.description}</p>
      )}
      {activity.signature_plate && (
        <p className="mt-2 text-xs font-medium italic">{activity.signature_plate}</p>
      )}
      <p className="mt-2 flex items-center gap-2 text-[0.65rem] font-medium text-gold">
        {activity.cover_charge ? `$${activity.cover_charge} cover` : "Free entry"}
        {activity.is_21_plus && (
          <span className="rounded-sm border border-gold/50 px-1 py-0.5 text-muted-foreground">
            21+
          </span>
        )}
      </p>
    </a>
  );
}

export function JerkyJerkLineupGrid() {
  const [rows, setRows] = useState<JerkyJerkLineupRow[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchJerkyJerkLineup()
      .then(setRows)
      .catch((err) => {
        console.error("Failed to load the Jerky Jerk weekly lineup:", err);
        setError(true);
      });
  }, []);

  if (error) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Couldn't load this week's lineup — check back shortly.
      </p>
    );
  }

  if (!rows) {
    return <p className="text-center text-sm text-muted-foreground">Loading the week…</p>;
  }

  const byDay = DAY_ORDER.map((day) => ({
    day,
    activities: rows.filter((r) => r.day_of_week === day && !r.is_monthly_special),
    monthly: rows.filter((r) => r.day_of_week === day && r.is_monthly_special),
  }));

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
      {byDay.map(({ day, activities, monthly }) => (
        <div key={day} className="flex flex-col gap-3">
          <p className="eyebrow text-center">{day}</p>
          {activities.map((activity) => (
            <ActivityCard key={activity.slug} activity={activity} />
          ))}
          {monthly.map((special) => (
            <p key={special.slug} className="text-center text-[0.65rem] text-muted-foreground">
              Once a month:{" "}
              <a
                href={jerkyJerkDetailHref(special)}
                className="font-medium text-gold hover:underline"
              >
                {special.name}
              </a>
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
