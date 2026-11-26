import { createFileRoute } from "@tanstack/react-router";
import { irieJerkActivityHead, IrieJerkActivityPage } from "./-irie-jerk-activity-page";

export const Route = createFileRoute("/irie-jerk/$slug")({
  head: irieJerkActivityHead,
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  return <IrieJerkActivityPage slug={slug} />;
}
