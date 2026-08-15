import { createFileRoute } from "@tanstack/react-router";
import { eventsHead, EventsPage } from "./-events-page";

export const Route = createFileRoute("/events")({
  head: eventsHead,
  component: EventsPage,
});
