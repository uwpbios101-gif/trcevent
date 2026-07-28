import { createFileRoute } from "@tanstack/react-router";
import { plateCostHead, PlateCostPage } from "./-plate-cost-page";

export const Route = createFileRoute("/plate-cost")({
  head: plateCostHead,
  component: PlateCostPage,
});
