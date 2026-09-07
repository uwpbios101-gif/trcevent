import { createFileRoute } from "@tanstack/react-router";
import {
  dollyPartonTributeHead,
  DollyPartonTributePage,
} from "./-jay-rebl-dolly-parton-tribute-page";

export const Route = createFileRoute("/jay-rebl_/dolly-parton-tribute")({
  head: dollyPartonTributeHead,
  component: DollyPartonTributePage,
});
