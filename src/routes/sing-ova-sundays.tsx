import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";

const DEFAULT_CITY = "chicago";

// Chicago used to live at this bare URL before city support existed. Kept as
// a redirect (not deleted) in case the old link is already shared anywhere --
// plain window.location rather than a router-level beforeLoad redirect since
// this is a static export with custom prerendering/SPA-fallback and a raw
// client-side redirect is guaranteed to work regardless of how that crawls
// this route (same reasoning as this codebase's other window.location reads,
// e.g. comp-page.tsx's ?ref= parsing).
function RedirectToChicago() {
  useEffect(() => {
    window.location.replace(`/sing-ova-sundays/${DEFAULT_CITY}`);
  }, []);
  return null;
}

export const Route = createFileRoute("/sing-ova-sundays")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: RedirectToChicago,
});
