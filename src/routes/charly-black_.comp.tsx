import { createFileRoute } from "@tanstack/react-router";
import { compHead, CompPage } from "./-charly-black-comp-page";

export const Route = createFileRoute("/charly-black_/comp")({
  head: compHead,
  component: CompPage,
});
