import { createFileRoute } from "@tanstack/react-router";
import { irieJerkJugglingHead, IrieJerkJugglingPage } from "./-irie-jerk-juggling-page";

export const Route = createFileRoute("/irie-jerk-and-juggling")({
  head: irieJerkJugglingHead,
  component: IrieJerkJugglingPage,
});
