import { createFileRoute } from "@tanstack/react-router";
import { riddimVaultHead, RiddimVaultPage } from "./-jay-rebl-riddim-vault-page";

export const Route = createFileRoute("/jay-rebl_/riddim-vault")({
  head: riddimVaultHead,
  component: RiddimVaultPage,
});
