import { createFileRoute } from "@tanstack/react-router";
import { chicagoVybezHead, ChicagoVybezPage } from "./-chicago-vybez-page";

export const Route = createFileRoute("/chicago-vybez")({
  head: chicagoVybezHead,
  component: ChicagoVybezPage,
});
