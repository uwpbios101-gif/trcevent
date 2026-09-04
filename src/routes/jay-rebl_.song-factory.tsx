import { createFileRoute } from "@tanstack/react-router";
import { songFactoryHead, SongFactoryPage } from "./-jay-rebl-song-factory-page";

export const Route = createFileRoute("/jay-rebl_/song-factory")({
  head: songFactoryHead,
  component: SongFactoryPage,
});
