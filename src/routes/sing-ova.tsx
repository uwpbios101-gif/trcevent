import { createFileRoute } from "@tanstack/react-router";
import { singOvaHubHead, SingOvaHubPage } from "./-sing-ova-hub-page";

export const Route = createFileRoute("/sing-ova")({
  head: singOvaHubHead,
  component: SingOvaHubPage,
});
