import { createFileRoute } from "@tanstack/react-router";
import { contractHead, ContractPage } from "./-contract-page";

export const Route = createFileRoute("/contract")({
  head: contractHead,
  component: ContractPage,
});
