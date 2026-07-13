import { createFileRoute } from "@tanstack/react-router";
import { charlyBlackHead, CharlyBlackPage } from "./-charly-black-page";

export const Route = createFileRoute("/")({
  head: charlyBlackHead,
  component: CharlyBlackPage,
});
