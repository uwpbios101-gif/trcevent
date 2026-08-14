import { createFileRoute } from "@tanstack/react-router";
import { jerkyJerkActivityHead, JerkyJerkActivityPage } from "./-jerky-jerk-activity-page";

export const Route = createFileRoute("/jerky-jerk/$slug")({
  head: jerkyJerkActivityHead,
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  return <JerkyJerkActivityPage slug={slug} />;
}
