// Legacy URL: the venue was renamed from "Jerky Jerk" to Irie Jerk, and every
// /jerky-jerk/<slug> page moved to /irie-jerk/<slug>. This route only exists so
// old shared links and search results land on the new page instead of a 404.
// It is never prerendered; GitHub Pages serves 404.html for these paths, which
// hands the path back to the router (see useRedirectRecovery in __root.tsx).
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/jerky-jerk/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/irie-jerk/$slug", params: { slug: params.slug }, replace: true });
  },
});
