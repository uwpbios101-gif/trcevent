import { createFileRoute } from "@tanstack/react-router";
import { charlyBlackHead, CharlyBlackPage } from "./-charly-black-page";

export const Route = createFileRoute("/charly-black")({
  head: charlyBlackHead,
  component: CharlyBlackPage,
});
