// Shared by src/routes/index.tsx and src/routes/irie-jerk-and-juggling.tsx, same
// pattern as -chicago-vybez-page.tsx: the page renders at both "/" and
// "/irie-jerk-and-juggling" (no runtime redirect — the static-exported build has
// no server). The "-" prefix excludes this file from route generation — see
// src/routes/README.md.
//
// Irie Jerk & Juggling (weekly Thursday, free, 5-9 PM, Calumet Park) is the
// front-page event from 2026-12-03. The page ROTATES between three design editions:
// each page load shows the next one in order (Tokyo → Copenhagen → Seoul → Tokyo …),
// tracked per browser in localStorage. All three editions are in the static HTML; a
// tiny inline script picks one before they're parsed, so there's no flash. On a
// client-side navigation (where that inline script doesn't run) a layout effect does
// the same pick before paint. Without JS the first edition (Tokyo) shows.
//
// Each edition lives in its own file with its palette scoped to its own class:
//   -irie-jerk-juggling-tokyo.tsx (.ijj-tokyo), -irie-jerk-juggling-copenhagen.tsx
//   (.ijj-cph), -irie-jerk-juggling-seoul.tsx (.ijj-seoul).
// To add/remove an edition, change EDITIONS (order = rotation order).
// Each edition has its OWN animated-flyer clip (tokyo-clip / copenhagen-clip / clip
// for Seoul); only the shown edition's clip loads and autoplays (muted, looping).
import { useEffect, useLayoutEffect, useRef } from "react";
import { IrieJerkJugglingTokyo } from "./-irie-jerk-juggling-tokyo";
import { IrieJerkJugglingCopenhagen } from "./-irie-jerk-juggling-copenhagen";
import { IrieJerkJugglingSeoul } from "./-irie-jerk-juggling-seoul";

const SITE_URL = "https://trcevent.com";
const PAGE_URL = `${SITE_URL}/irie-jerk-and-juggling`;
const DESCRIPTION =
  "Irie Jerk & Juggling is a Thursday evening dancehall party in Calumet Park. Jamaican cooking, familiar hooks, and free admission from 5 to 9 PM.";

export function irieJerkJugglingHead() {
  return {
    meta: [
      { title: "Irie Jerk & Juggling | Thursdays in Calumet Park | TRC Events" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Irie Jerk & Juggling | Free Thursdays, 5–9 PM" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Irie Jerk & Juggling | Free Thursdays, 5–9 PM" },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
  };
}

const EDITIONS = [
  { key: "tokyo", Component: IrieJerkJugglingTokyo },
  { key: "copenhagen", Component: IrieJerkJugglingCopenhagen },
  { key: "seoul", Component: IrieJerkJugglingSeoul },
] as const;

const KEYS = EDITIONS.map((e) => e.key);
const STORAGE_KEY = "ijj-edition";

// Advances the per-browser rotation and returns the edition to show. Must stay
// self-contained: it is also serialized into the inline script below.
function pickNextEdition(keys: readonly string[], storageKey: string): string {
  let next: number;
  try {
    const last = keys.indexOf(window.localStorage.getItem(storageKey) || "");
    next = last < 0 ? 0 : (last + 1) % keys.length;
    window.localStorage.setItem(storageKey, keys[next]);
  } catch {
    // Storage blocked (private mode, etc.): at least vary it between loads.
    next = Math.floor(Math.random() * keys.length);
  }
  return keys[next];
}

const INLINE_SCRIPT = `(function(){var el=document.currentScript&&document.currentScript.parentElement;if(el)el.setAttribute("data-show",(${pickNextEdition.toString()})(${JSON.stringify(KEYS)},${JSON.stringify(STORAGE_KEY)}));})();`;

// Hide every edition except the chosen one; with no choice yet, show the first.
const ROTATE_CSS =
  KEYS.map((k) => `.ijj-rotate[data-show="${k}"]>[data-edition]:not([data-edition="${k}"])`).join(",") +
  `,.ijj-rotate:not([data-show])>[data-edition]:not([data-edition="${KEYS[0]}"]){display:none}`;

export function IrieJerkJugglingPage() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (el && !el.hasAttribute("data-show")) {
      el.setAttribute("data-show", pickNextEdition(KEYS, STORAGE_KEY));
    }
  }, []);

  // Autoplay (muted, looping) only the shown edition's clip, once it nears the
  // viewport. Hidden editions keep preload="none", so their clips never download.
  useEffect(() => {
    const shown = ref.current?.getAttribute("data-show") || KEYS[0];
    const video = ref.current?.querySelector<HTMLVideoElement>(
      `[data-edition="${shown}"] video[data-ijj-clip]`,
    );
    if (!video) return;
    const start = () => {
      video.preload = "auto";
      video.play().catch(() => {});
    };
    if (!("IntersectionObserver" in window)) {
      start();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          start();
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <div className="ijj-rotate" ref={ref} suppressHydrationWarning>
      <style>{ROTATE_CSS}</style>
      <script dangerouslySetInnerHTML={{ __html: INLINE_SCRIPT }} />
      {EDITIONS.map(({ key, Component }) => (
        <div key={key} data-edition={key}>
          <Component />
        </div>
      ))}
    </div>
  );
}
