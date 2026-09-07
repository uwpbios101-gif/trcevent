import { createFileRoute } from "@tanstack/react-router";
import {
  reggaeDayProductionHead,
  ReggaeDayProductionPage,
} from "./-jay-rebl-reggae-day-production-page";

export const Route = createFileRoute("/jay-rebl_/reggae-day-production")({
  head: reggaeDayProductionHead,
  component: ReggaeDayProductionPage,
});
