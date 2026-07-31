import { createFileRoute } from "@tanstack/react-router";
import { singOvaSundaysHead, SingOvaSundaysPage } from "./-sing-ova-sundays-page";

export const Route = createFileRoute("/sing-ova-sundays_/$city")({
  head: singOvaSundaysHead,
  component: RouteComponent,
});

function RouteComponent() {
  const { city } = Route.useParams();
  return <SingOvaSundaysPage citySlug={city} />;
}
