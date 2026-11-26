import { createFileRoute } from "@tanstack/react-router";
import { irieJerkJugglingHead, IrieJerkJugglingPage } from "./-irie-jerk-juggling-page";

export const Route = createFileRoute("/")({
  head: irieJerkJugglingHead,
  component: IrieJerkJugglingPage,
});
