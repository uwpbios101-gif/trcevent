import { createFileRoute } from "@tanstack/react-router";
import {
  karaokeThursdaysBrainstormHead,
  KaraokeThursdaysBrainstormPage,
} from "./-karaoke-thursdays-brainstorm-page";

export const Route = createFileRoute("/karaoke-thursdays-brainstorm")({
  head: karaokeThursdaysBrainstormHead,
  component: KaraokeThursdaysBrainstormPage,
});
