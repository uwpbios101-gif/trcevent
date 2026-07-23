import { createFileRoute } from "@tanstack/react-router";
import { contractAdminHead, ContractAdminPage } from "./-contract-admin-page";

export const Route = createFileRoute("/contract-admin")({
  head: contractAdminHead,
  component: ContractAdminPage,
});
