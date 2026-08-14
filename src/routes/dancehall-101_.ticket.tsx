import { createFileRoute } from "@tanstack/react-router";
import { dancehall101TicketHead, Dancehall101TicketPage } from "./-dancehall-101-ticket-page";

export const Route = createFileRoute("/dancehall-101_/ticket")({
  head: dancehall101TicketHead,
  component: Dancehall101TicketPage,
});
