// Shared by src/routes/get-started.tsx. The "-" prefix excludes this file
// from route generation (TanStack Router convention) — see
// src/routes/README.md.
//
// Self-service entry point: performers click their own promo photo, which
// calls request-invite-access with that act's public-safe slug. If Stephen
// already has their email on file (known_email), the code is emailed
// immediately with zero input from them. Otherwise this shows an inline
// email field for just that tile and retries once they submit it. Either
// way, they then check their email and enter the code at /contract
// themselves -- this page only gets them their code, it doesn't collect
// any contract info itself.
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Mail } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import badChargieImg from "@/assets/dj-bad-chargie.jpg";
import djPoyoImg from "@/assets/dj-poyo.jpg";
import ghettoStoryImg from "@/assets/dj-ghetto-story.jpg";
import jayReblImg from "@/assets/opening-act-jayrebl.jpg";
import dainjahRusImg from "@/assets/opening-act-dainjah-rus.jpg";
import krabbitImg from "@/assets/opening-act-krabbit.jpg";
import honeztyImg from "@/assets/opening-act-honezty.jpg";
import solidShaneImg from "@/assets/opening-act-solid-shane.jpg";
import negoHeightsImg from "@/assets/opening-act-nego-heights.jpg";

const SITE_URL = "https://trcevent.com";

export function getStartedHead() {
  return {
    meta: [
      { title: "Get Started | TRC Events" },
      {
        name: "description",
        content:
          "DJs and opening acts: click your photo to get your access code and start your contract.",
      },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/get-started` }],
  };
}

const ACTS = [
  { slug: "bad-chargie", name: "Bad Chargie", img: badChargieImg },
  { slug: "dj-poyo", name: "DJ Poyo", img: djPoyoImg },
  { slug: "ghetto-story", name: "Ghetto Story", img: ghettoStoryImg },
  { slug: "jay-rebl", name: "Jay Rebl", img: jayReblImg },
  { slug: "dainjah-rus", name: "Dainjah Rus", img: dainjahRusImg },
  { slug: "krabbit", name: "Krabbit", img: krabbitImg },
  { slug: "honezty", name: "Honezty", img: honeztyImg },
  { slug: "solid-shane", name: "Solid Shane", img: solidShaneImg },
  { slug: "nego-hights", name: "Nego Hights", img: negoHeightsImg },
];

type TileState =
  | { status: "idle" }
  | { status: "busy" }
  | { status: "needsEmail"; email: string }
  | { status: "sent"; sentTo: string };

export function GetStartedPage() {
  const [tiles, setTiles] = useState<Record<string, TileState>>(
    Object.fromEntries(ACTS.map((a) => [a.slug, { status: "idle" }])),
  );

  function setTile(slug: string, state: TileState) {
    setTiles((prev) => ({ ...prev, [slug]: state }));
  }

  async function requestAccess(slug: string, email?: string) {
    setTile(slug, { status: "busy" });
    try {
      const { data, error } = await supabase.functions.invoke("request-invite-access", {
        body: { actSlug: slug, email },
      });
      if (error || data?.error) {
        toast.error(data?.error ?? "Couldn't send the code. Try again.");
        setTile(slug, { status: "idle" });
        return;
      }
      if (data?.needsEmail) {
        setTile(slug, { status: "needsEmail", email: "" });
        return;
      }
      setTile(slug, { status: "sent", sentTo: data.sentTo });
    } catch {
      toast.error("Something went wrong. Check your connection and try again.");
      setTile(slug, { status: "idle" });
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <p className="eyebrow mb-2">Ras Tafari Inc — TRC Events</p>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Get Started</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
          DJs and opening acts: click your photo below. We'll email you your access code — check
          your email, then enter that code at trcevent.com/contract to begin.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {ACTS.map((act) => {
          const tile = tiles[act.slug];
          return (
            <div key={act.slug} className="overflow-hidden rounded-xl border border-border bg-card">
              <button
                type="button"
                onClick={() => tile.status === "idle" && requestAccess(act.slug)}
                disabled={tile.status !== "idle"}
                className="group block w-full text-left disabled:cursor-default"
              >
                <div className="aspect-[4/5] w-full overflow-hidden bg-muted">
                  <img
                    src={act.img}
                    alt={`${act.name} — click to get your access code`}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              </button>
              <div className="p-3 text-center">
                <p className="mb-2 text-sm font-medium">{act.name}</p>

                {tile.status === "idle" && (
                  <Button
                    variant="goldOutline"
                    size="sm"
                    className="w-full"
                    onClick={() => requestAccess(act.slug)}
                  >
                    Get my code
                  </Button>
                )}

                {tile.status === "busy" && (
                  <div className="flex justify-center py-1.5">
                    <Loader2 className="size-4 animate-spin text-gold" />
                  </div>
                )}

                {tile.status === "needsEmail" && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (tile.status === "needsEmail" && tile.email.trim()) {
                        requestAccess(act.slug, tile.email.trim());
                      }
                    }}
                    className="space-y-2"
                  >
                    <Input
                      type="email"
                      required
                      placeholder="Your email"
                      value={tile.email}
                      onChange={(e) =>
                        setTile(act.slug, { status: "needsEmail", email: e.target.value })
                      }
                      className="h-8 text-xs"
                    />
                    <Button type="submit" variant="gold" size="sm" className="w-full">
                      <Mail className="size-3.5" /> Send code
                    </Button>
                  </form>
                )}

                {tile.status === "sent" && (
                  <div className="flex flex-col items-center gap-1 text-xs text-gold">
                    <CheckCircle2 className="size-5" />
                    Sent to {tile.sentTo}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
