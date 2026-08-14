// Shared by all four Dancehall 101 route files (dancehall-101.tsx,
// dancehall-101_.ticket.tsx, dancehall-101_.leaderboard.tsx,
// dancehall-101_.checkin.tsx). The "-" prefix excludes this file from route
// generation (TanStack Router convention) -- see src/routes/README.md.
//
// Dancehall 101 keeps its own distinct visual identity (Anton display font,
// dark background, per-school red/gold accent system) rather than trcevent's
// site-wide Playfair Display/Jost + gold theme -- it was built that way on
// selassiefest.com specifically because it's TRC Events' own event brand,
// not a sub-theme of whatever site happens to host it. That choice carries
// over unchanged in this migration; only the hosting site changed.
import type { CSSProperties } from "react";
import type { Dh101School } from "@/lib/dancehall101";
import { dh101Initials } from "@/lib/dancehall101";

export const SITE_URL = "https://trcevent.com";

// Loaded per-route (not site-wide in __root.tsx) since only these four pages
// use it.
export const DH101_FONT_LINKS = [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Anton&display=swap",
  },
];

export const DH101_BG = "#0a0a0a";
export const DH101_TEXT = "#f5f5f5";
export const DH101_TEXT_DIM = "#9a9a9a";
export const DH101_BORDER = "rgba(255,255,255,0.1)";
export const DH101_CARD = "rgba(255,255,255,0.04)";

export const DH101_FALLBACK_PRIMARY = "#C8102E";
export const DH101_FALLBACK_SECONDARY = "#F2B705";

export function dh101Vars(
  school?: {
    color_primary?: string | null;
    color_secondary?: string | null;
  } | null,
): CSSProperties {
  return {
    "--school-primary": school?.color_primary || DH101_FALLBACK_PRIMARY,
    "--school-secondary": school?.color_secondary || DH101_FALLBACK_SECONDARY,
  } as CSSProperties;
}

// Reproduces dancehall101-client.js's wordmarkHtml(): a real cleared logo
// renders as an <img>; otherwise a styled text badge using the school's own
// short code/colors, never a generic placeholder icon.
export function SchoolWordmark({
  school,
  size = "sm",
}: {
  school: Pick<Dh101School, "logo_url" | "logo_bg" | "short_code" | "name">;
  size?: "sm" | "lg";
}) {
  const dims = size === "lg" ? "size-23" : "size-13";
  const pad = size === "lg" ? "p-3" : "p-1.5";
  const fontSize = size === "lg" ? "text-2xl" : "text-sm";

  if (school.logo_url) {
    return (
      <img
        src={school.logo_url}
        alt={`${school.name} logo`}
        loading="lazy"
        className={`mx-auto block ${dims} ${pad} rounded-xl object-contain ${
          school.logo_bg === "dark" ? "bg-black/75" : "bg-white/92"
        } ${size === "lg" ? "mb-3.5" : ""}`}
      />
    );
  }

  return (
    <div
      className={`mx-auto flex items-center justify-center ${dims} ${pad} rounded-2xl border ${
        size === "lg" ? "mb-3.5" : ""
      }`}
      style={{
        background:
          "linear-gradient(155deg, var(--school-primary), color-mix(in srgb, var(--school-primary) 55%, black))",
        borderColor: "color-mix(in srgb, var(--school-secondary) 60%, transparent)",
      }}
    >
      <span
        className={`font-[Anton] tracking-wide ${fontSize}`}
        style={{ color: "var(--school-secondary)" }}
      >
        {dh101Initials(school)}
      </span>
    </div>
  );
}

export function Dh101Topbar({ tagline }: { tagline: string }) {
  return (
    <header
      className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-4.5"
      style={{ borderColor: DH101_BORDER }}
    >
      <a
        href="https://dancehall101.com/"
        className="font-[Anton] text-[1.3rem] tracking-wide uppercase no-underline"
        style={{ color: DH101_TEXT }}
      >
        DANCEHALL<span style={{ color: "var(--school-primary)" }}>101</span>
      </a>
      <div className="text-[0.72rem] tracking-[0.15em] uppercase" style={{ color: DH101_TEXT_DIM }}>
        {tagline}
      </div>
    </header>
  );
}

export function Dh101Footer() {
  return (
    <footer
      className="border-t px-5 py-5 text-center text-[0.78rem]"
      style={{ borderColor: DH101_BORDER, color: DH101_TEXT_DIM }}
    >
      Dancehall 101 &mdash; presented by TRC Events, a Ras Tafari Inc production. Uptown Lounge,
      Chicago.
    </footer>
  );
}
