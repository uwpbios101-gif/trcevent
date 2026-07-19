import { createFileRoute } from "@tanstack/react-router";
import { dancehallFridaysHead, DancehallFridaysPage } from "./-dancehall-fridays-page";

export const Route = createFileRoute("/dancehall-fridays")({
  head: dancehallFridaysHead,
  component: DancehallFridaysPage,
});
