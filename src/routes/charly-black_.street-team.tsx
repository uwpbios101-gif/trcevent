import { createFileRoute } from "@tanstack/react-router";
import { streetTeamHead, StreetTeamPage } from "./-charly-black-street-team-page";

export const Route = createFileRoute("/charly-black_/street-team")({
  head: streetTeamHead,
  component: StreetTeamPage,
});
