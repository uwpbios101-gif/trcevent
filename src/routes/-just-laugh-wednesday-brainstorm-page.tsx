// Shared by src/routes/just-laugh-wednesday-brainstorm.tsx. The "-" prefix
// excludes this file from route generation (TanStack Router convention) --
// see src/routes/README.md.
//
// Unlisted internal brainstorm tool for Marlon (Jerky Jerk) -- see
// src/components/site/EventBrainstormTool.tsx for the shared implementation
// and supabase/sql/event_brainstorm_schema.sql for the backing table.
import { EventBrainstormTool } from "@/components/site/EventBrainstormTool";

const SITE_URL = "https://trcevent.com";

export function justLaughWednesdayBrainstormHead() {
  return {
    meta: [
      { title: "Just Laugh Wednesday Brainstorm | TRC Events" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/just-laugh-wednesday-brainstorm` }],
  };
}

export function JustLaughWednesdayBrainstormPage() {
  return <EventBrainstormTool eventSlug="just-laugh-wednesday" eventName="Just Laugh Wednesday" />;
}
