import { createFileRoute } from "@tanstack/react-router";
import { getStartedHead, GetStartedPage } from "./-get-started-page";

export const Route = createFileRoute("/get-started")({
  head: getStartedHead,
  component: GetStartedPage,
});
