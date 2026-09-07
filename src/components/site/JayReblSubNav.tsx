// A sticky sub-nav shown at the top of every Jay RebL page (the hub plus
// every page it links out to, including Bob Marley: Live Forever -- that
// one's really The Wild Hare's event, but Jay RebL performs there, and this
// nav exists so nobody has to bounce back through the hub to find it).
// Sticks directly under the main Navbar (which is h-16 / 64px, hence
// top-16) so both stay visible while scrolling. TanStack Router's <Link>
// applies its own ".active" class on a route match -- exact:true on every
// entry so /jay-rebl only lights up on the hub itself, not on every
// sub-page nested under it.
import { Link } from "@tanstack/react-router";

const JAY_REBL_PAGES = [
  { to: "/jay-rebl", label: "Jay RebL" },
  { to: "/jay-rebl/song-factory", label: "Song Factory" },
  { to: "/jay-rebl/riddim-vault", label: "Riddim Vault" },
  { to: "/jay-rebl/reggae-day-proposal", label: "Reggae Day Proposal" },
  { to: "/jay-rebl/reggae-day-production", label: "Tech Rider & Run of Show" },
  { to: "/jay-rebl/nap-idea-submission", label: "NAP Idea Submission" },
  { to: "/bob-marley-live-forever", label: "Bob Marley Tribute" },
  { to: "/jay-rebl/dolly-parton-tribute", label: "Dolly Parton Tribute" },
] as const;

export function JayReblSubNav() {
  return (
    <div className="sticky top-16 z-40 border-b border-border/60 bg-background/95 backdrop-blur-md">
      <nav
        aria-label="Jay RebL pages"
        className="mx-auto flex max-w-5xl gap-1.5 overflow-x-auto px-4 py-2.5 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {JAY_REBL_PAGES.map((p) => (
          <Link
            key={p.to}
            to={p.to}
            activeOptions={{ exact: true }}
            className="shrink-0 rounded-full border border-transparent px-3 py-1.5 text-xs font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-gold [&.active]:border-gold/40 [&.active]:bg-gold/10 [&.active]:text-gold"
          >
            {p.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
