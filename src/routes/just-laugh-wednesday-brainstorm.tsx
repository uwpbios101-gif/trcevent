import { createFileRoute } from "@tanstack/react-router";
import {
  justLaughWednesdayBrainstormHead,
  JustLaughWednesdayBrainstormPage,
} from "./-just-laugh-wednesday-brainstorm-page";

export const Route = createFileRoute("/just-laugh-wednesday-brainstorm")({
  head: justLaughWednesdayBrainstormHead,
  component: JustLaughWednesdayBrainstormPage,
});
