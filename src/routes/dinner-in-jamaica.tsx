import { createFileRoute } from "@tanstack/react-router";
import { dinnerInJamaicaHead, DinnerInJamaicaPage } from "./-dinner-in-jamaica-page";

export const Route = createFileRoute("/dinner-in-jamaica")({
  head: dinnerInJamaicaHead,
  component: DinnerInJamaicaPage,
});
