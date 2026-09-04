import { createFileRoute } from "@tanstack/react-router";
import { workFiDiBeachHead, WorkFiDiBeachPage } from "./-work-fi-di-beach-page";

export const Route = createFileRoute("/work-fi-di-beach")({
  head: workFiDiBeachHead,
  component: WorkFiDiBeachPage,
});
