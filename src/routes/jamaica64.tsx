import { createFileRoute } from "@tanstack/react-router";
import { jamaica64Head, Jamaica64Page } from "./-jamaica64-page";

export const Route = createFileRoute("/jamaica64")({
  head: jamaica64Head,
  component: Jamaica64Page,
});
