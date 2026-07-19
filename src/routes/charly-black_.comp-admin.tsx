import { createFileRoute } from "@tanstack/react-router";
import { compAdminHead, CompAdminPage } from "./-charly-black-comp-admin-page";

export const Route = createFileRoute("/charly-black_/comp-admin")({
  head: compAdminHead,
  component: CompAdminPage,
});
