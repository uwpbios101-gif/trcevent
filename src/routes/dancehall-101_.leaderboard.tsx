import { createFileRoute } from "@tanstack/react-router";
import {
  dancehall101LeaderboardHead,
  Dancehall101LeaderboardPage,
} from "./-dancehall-101-leaderboard-page";

export const Route = createFileRoute("/dancehall-101_/leaderboard")({
  head: dancehall101LeaderboardHead,
  component: Dancehall101LeaderboardPage,
});
