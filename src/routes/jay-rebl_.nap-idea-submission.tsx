import { createFileRoute } from "@tanstack/react-router";
import { napIdeaSubmissionHead, NapIdeaSubmissionPage } from "./-jay-rebl-nap-idea-submission-page";

export const Route = createFileRoute("/jay-rebl_/nap-idea-submission")({
  head: napIdeaSubmissionHead,
  component: NapIdeaSubmissionPage,
});
