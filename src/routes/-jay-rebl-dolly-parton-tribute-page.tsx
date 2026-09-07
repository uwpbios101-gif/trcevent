// Shared by src/routes/jay-rebl_.dolly-parton-tribute.tsx. The "-" prefix
// excludes this file from route generation (TanStack Router convention) —
// see src/routes/README.md.
//
// Tribute page: Jay RebL covering "I Will Always Love You" in memory of
// Dolly Parton. Her death was verified against real current sources before
// writing anything here (NPR, CNN, Variety, Yahoo Entertainment, all
// corroborating): died August 25, 2026, Nashville, TN, at 80, after a
// brief cancer battle, having canceled a planned Las Vegas residency in
// May 2026 for undisclosed health reasons. Born January 19, 1946, Sevier
// County, TN. "I Will Always Love You" is her own composition (1973,
// written as a goodbye to Porter Wagoner) -- not a Whitney Houston cover,
// even though that's the more famous version; get this right, it matters.
//
// No photo of Dolly Parton is used here -- none was supplied for this page
// (unlike -bob-marley-live-forever-page.tsx, which had real supplied
// artifact photos), and a copyrighted press photo of a very recently
// deceased public figure shouldn't be scraped from the web onto a
// commercial-adjacent site without rights. Typography/design-only.
//
// No performance date/venue/recording exists yet -- this is announced as
// in-development, same "In development" framing as the SERIES cards on
// -jay-rebl-page.tsx, not a booked event. Don't invent one.
import { ArrowRight, Music2, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SITE_URL = "https://trcevent.com";

export function dollyPartonTributeHead() {
  return {
    meta: [
      { title: "I Will Always Love You — A Jay RebL Tribute to Dolly Parton | TRC Events" },
      {
        name: "description",
        content:
          "Jay RebL's in-the-works tribute cover of Dolly Parton's \"I Will Always Love You,\" in memory of Dolly Parton (1946–2026).",
      },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/jay-rebl/dolly-parton-tribute` }],
  };
}

export function DollyPartonTributePage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="eyebrow mb-2">
            In Memory of Dolly Parton — January 19, 1946 – August 25, 2026
          </p>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
            I Will Always <span className="text-gradient-gold">Love You</span>
          </h1>
          <p className="mt-2 font-display text-lg italic text-gradient-gold sm:text-xl">
            A Jay RebL Tribute to Dolly Parton
          </p>
          <div className="mt-6 flex justify-center">
            <Badge variant="outline" className="border-gold/40 text-gold">
              In development — performance details to come
            </Badge>
          </div>
          <div className="mt-7">
            <Button asChild variant="goldOutline" size="lg">
              <a href="/jay-rebl">
                <ArrowRight className="size-4 rotate-180" /> Back to Jay RebL
              </a>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-2xl space-y-10 px-4 py-16 sm:px-6">
        <section className="space-y-4 leading-relaxed text-muted-foreground">
          <p>
            Dolly Parton wrote "I Will Always Love You" in 1973 — a goodbye letter, in song, to her
            mentor Porter Wagoner — years before it became one of the most recorded songs in
            American music history. She died on August 25, 2026, in Nashville, at 80, after a brief
            battle with cancer, having stepped back from a planned Las Vegas residency just months
            earlier.
          </p>
          <p>
            Jay RebL has spent his own career moving between R&amp;B, soul, reggae, and dancehall
            without settling into one lane. He's working on a tribute arrangement of the song in
            that same spirit — a reinterpretation, not an imitation, of a song that already belonged
            to everyone long before he touched it.
          </p>
          <p>Performance and release details are still coming together — check back soon.</p>
        </section>

        <section className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card p-6 text-center">
          <Music2 className="size-4 text-gold" />
          <p className="font-display italic text-gradient-gold">
            "If I should stay, I would only be in your way…"
          </p>
        </section>

        <section className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Heart className="size-3.5 text-gold" /> Rest in peace, Dolly Parton.
        </section>
      </div>
    </div>
  );
}
