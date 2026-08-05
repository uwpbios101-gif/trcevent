// Shared by src/routes/karaoke-thursdays-brainstorm.tsx. The "-" prefix
// excludes this file from route generation (TanStack Router convention) --
// see src/routes/README.md.
//
// Unlisted internal brainstorm tool for Marlon (Jerky Jerk) -- see
// src/components/site/EventBrainstormTool.tsx for the shared implementation
// and supabase/sql/event_brainstorm_schema.sql for the backing table.
import { EventBrainstormTool } from "@/components/site/EventBrainstormTool";

const SITE_URL = "https://trcevent.com";

export function karaokeThursdaysBrainstormHead() {
  return {
    meta: [
      { title: "Karaoke Thursdays Brainstorm | TRC Events" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/karaoke-thursdays-brainstorm` }],
  };
}

export function KaraokeThursdaysBrainstormPage() {
  return <EventBrainstormTool eventSlug="karaoke-thursdays" eventName="Karaoke Thursdays" />;
}
