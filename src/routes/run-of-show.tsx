import { createFileRoute } from "@tanstack/react-router";
import { runOfShowHead, RunOfShowPage } from "./-run-of-show-page";

export const Route = createFileRoute("/run-of-show")({
  head: runOfShowHead,
  component: RunOfShowPage,
});
