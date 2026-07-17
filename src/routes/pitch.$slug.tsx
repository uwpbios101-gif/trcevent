import { createFileRoute } from "@tanstack/react-router";
import { pitchHead, PitchPage } from "./-pitch-page";

export const Route = createFileRoute("/pitch/$slug")({
  head: pitchHead,
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  return <PitchPage slug={slug} />;
}
