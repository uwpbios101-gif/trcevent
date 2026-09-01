import { createFileRoute } from "@tanstack/react-router";
import { pastEventsHead, PastEventsPage } from "./-past-events-page";

export const Route = createFileRoute("/past-events")({
  head: pastEventsHead,
  component: PastEventsPage,
});
