import { createFileRoute } from "@tanstack/react-router";
import { singOvaSundaysAdminHead, SingOvaSundaysAdminPage } from "./-sing-ova-sundays-admin-page";

export const Route = createFileRoute("/sing-ova-sundays-admin")({
  head: singOvaSundaysAdminHead,
  component: SingOvaSundaysAdminPage,
});
