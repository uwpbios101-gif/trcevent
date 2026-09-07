import { createFileRoute } from "@tanstack/react-router";
import {
  bobMarleyLiveForeverHead,
  BobMarleyLiveForeverPage,
} from "./-bob-marley-live-forever-page";

export const Route = createFileRoute("/bob-marley-live-forever")({
  head: bobMarleyLiveForeverHead,
  component: BobMarleyLiveForeverPage,
});
