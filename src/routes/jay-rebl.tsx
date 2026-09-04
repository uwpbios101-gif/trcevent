import { createFileRoute } from "@tanstack/react-router";
import { jayReblHead, JayReblPage } from "./-jay-rebl-page";

export const Route = createFileRoute("/jay-rebl")({
  head: jayReblHead,
  component: JayReblPage,
});
