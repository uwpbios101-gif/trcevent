import { createFileRoute } from "@tanstack/react-router";
import { techRiderHead, TechRiderPage } from "./-tech-rider-page";

export const Route = createFileRoute("/tech-rider")({
  head: techRiderHead,
  component: TechRiderPage,
});
