import { createFileRoute } from "@tanstack/react-router";
import { stCatherineLinkupHead, StCatherineLinkupPage } from "./-st-catherine-linkup-page";

export const Route = createFileRoute("/st-catherine-linkup")({
  head: stCatherineLinkupHead,
  component: StCatherineLinkupPage,
});
