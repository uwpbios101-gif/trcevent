import { createFileRoute } from "@tanstack/react-router";
import { jamaicadayHead, JamaicadayPage } from "./-jamaicaday-page";

export const Route = createFileRoute("/jamaicaday")({
  head: jamaicadayHead,
  component: JamaicadayPage,
});
