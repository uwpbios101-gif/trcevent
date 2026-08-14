import { createFileRoute } from "@tanstack/react-router";
import { dancehall101CheckinHead, Dancehall101CheckinPage } from "./-dancehall-101-checkin-page";

export const Route = createFileRoute("/dancehall-101_/checkin")({
  head: dancehall101CheckinHead,
  component: Dancehall101CheckinPage,
});
