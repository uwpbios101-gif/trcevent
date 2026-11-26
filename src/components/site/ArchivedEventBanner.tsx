// Shown at the top of a one-off event page once the event is over and it has
// moved to the archive (trc_past_events in Supabase, listed on /past-events).
// The page itself stays up as a record of the event.
import { Archive } from "lucide-react";

export function ArchivedEventBanner({ date }: { date: string }) {
  return (
    <div role="note" className="border-b border-gold/40 bg-card">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-3 text-center text-sm sm:px-6">
        <Archive className="size-4 shrink-0 text-gold" aria-hidden="true" />
        <span>
          <strong className="font-semibold">This event has passed.</strong>{" "}
          <span className="text-muted-foreground">It took place {date}. Tickets are no longer on sale.</span>
        </span>
        <span className="flex flex-wrap justify-center gap-x-3">
          <a href="/" className="font-medium text-gold hover:underline">
            See what's on now
          </a>
          <a href="/past-events" className="font-medium text-gold hover:underline">
            More past events
          </a>
        </span>
      </div>
    </div>
  );
}
