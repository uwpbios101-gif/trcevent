// Shared by src/routes/mingles-tuesdays-brainstorm.tsx. The "-" prefix
// excludes this file from route generation (TanStack Router convention) --
// see src/routes/README.md.
//
// Unlisted internal brainstorm tool for Marlon (Jerky Jerk) -- see
// src/components/site/EventBrainstormTool.tsx for the shared implementation
// and supabase/sql/event_brainstorm_schema.sql for the backing table.
import { EventBrainstormTool } from "@/components/site/EventBrainstormTool";

const SITE_URL = "https://trcevent.com";

export function minglesTuesdaysBrainstormHead() {
  return {
    meta: [
      { title: "Mingles Tuesdays Brainstorm | TRC Events" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/mingles-tuesdays-brainstorm` }],
  };
}

export function MinglesTuesdaysBrainstormPage() {
  return <EventBrainstormTool eventSlug="mingles-tuesdays" eventName="Mingles Tuesdays" />;
}
