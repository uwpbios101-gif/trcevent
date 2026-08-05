import { createFileRoute } from "@tanstack/react-router";
import {
  minglesTuesdaysBrainstormHead,
  MinglesTuesdaysBrainstormPage,
} from "./-mingles-tuesdays-brainstorm-page";

export const Route = createFileRoute("/mingles-tuesdays-brainstorm")({
  head: minglesTuesdaysBrainstormHead,
  component: MinglesTuesdaysBrainstormPage,
});
