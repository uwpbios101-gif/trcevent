import { createFileRoute } from "@tanstack/react-router";
import { singOvaSundaysHead, SingOvaSundaysPage } from "./-sing-ova-sundays-page";

export const Route = createFileRoute("/sing-ova-sundays")({
  head: singOvaSundaysHead,
  component: SingOvaSundaysPage,
});
