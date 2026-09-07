import { createFileRoute } from "@tanstack/react-router";
import { reggaeDayProposalHead, ReggaeDayProposalPage } from "./-jay-rebl-reggae-day-proposal-page";

export const Route = createFileRoute("/jay-rebl_/reggae-day-proposal")({
  head: reggaeDayProposalHead,
  component: ReggaeDayProposalPage,
});
