import { createFileRoute } from "@tanstack/react-router";
import { dancehall101Head, Dancehall101Page } from "./-dancehall-101-page";

export const Route = createFileRoute("/dancehall-101")({
  head: dancehall101Head,
  component: Dancehall101Page,
});
