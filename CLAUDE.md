# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

TRC Events ("The Right Connection. The Reggae Connection.") — trcevent.com, the marketing arm of
Ras Tafari Inc (a 501(c)(3) nonprofit that also runs SelassieFest / selassiefest.com). Built with
TanStack Start (file-based router + SSR) on React 19, styled with Tailwind v4 + shadcn/ui
("new-york" style). This is a **Lovable-connected project**: it was exported from Lovable and the
branch stays linked back to the Lovable editor.

Lovable's export scaffolded a generic demo directory (fake DJs/venues/events, dashboards, a
booking-system vision — see the original spec if you need it) — that placeholder content and its
mock data layer were deliberately deleted (2026-07-13) once real content existed. **Only ship real
TRC Events content** — don't resurrect the mock DJ/venue/event directory pattern for new features;
build against real data (hardcoded event details, or the shared Supabase project once a feature
needs it) instead.

- Do not force-push, rebase, or amend/squash already-pushed commits — this rewrites history on
  Lovable's side and can destroy the user's project history there.
- Commits pushed to the connected branch sync back into the Lovable editor, so keep the branch in
  a working state.

## Commands

Package manager is **bun** (`bun.lock`, `bunfig.toml` present — don't use npm/yarn/pnpm).

```
bun install          # install deps
bun dev              # vite dev — dev server
bun run build        # vite build (production, targets Cloudflare via nitro)
bun run build:dev    # vite build --mode development
bun run preview      # preview a production build
bun run lint         # eslint .
bun run format       # prettier --write .
```

There is no test suite/framework configured in this repo.

`bunfig.toml` enforces a 24h supply-chain guard (`minimumReleaseAge`) blocking newly published
package versions. Only add a package to `minimumReleaseAgeExcludes` after confirming with the
user.

## Architecture

**Routing.** File-based routing via TanStack Router, rooted at `src/routes/`. See
`src/routes/README.md` for the naming conventions (`$slug` dynamic segments, `{-$optional}`,
splats, `_layout`, `__root.tsx`). `src/routeTree.gen.ts` is auto-generated — never hand-edit it (it
regenerates automatically whenever `bun dev`/`bun run build` is running and a route file changes).
`src/routes/__root.tsx` is the single app shell (`RootShell` for the `<html>` doc, `RootComponent`
for the `Navbar`/`Outlet`/`Footer` layout) and also owns the global `notFoundComponent` /
`errorComponent`.

As of 2026-07-13 there are only two real routes: `src/routes/index.tsx` (a bare redirect to
`/charly-black` — the root domain has no content of its own) and `src/routes/charly-black.tsx`
(the actual site: the Charly Black "Good Times" event page, self-contained with hardcoded event
details, no loader/data layer). `src/routes/sitemap[.]xml.ts` is a server route (`GET` handler)
generating `/sitemap.xml` — it lists routes as a plain hardcoded array now that there's no data
layer to walk; keep it in sync when real routes are added/removed.

Dancehall 101 (a weekly event migrating from selassiefest.com/dancehall101/, backed by an existing
Supabase project) is queued as the next real page — when it's built, follow the same pattern:
self-contained route, hardcoded copy where content is static, live Supabase reads only where the
data is genuinely dynamic (signups, leaderboard, door check-in).

**SSR error handling (Lovable-specific plumbing — treat carefully).** There's a layered fallback
so a broken SSR render never shows a raw crash:
- `src/start.ts` — `createStart` request middleware that catches server errors and returns
  `renderErrorPage()` as a plain HTML `Response` (except for errors that already carry a
  `statusCode`, which are rethrown for normal handling).
- `src/server.ts` — wraps the TanStack Start server entry (`@tanstack/react-start/server-entry`).
  It also detects the case where h3 has already swallowed an in-handler throw into a generic JSON
  500 (`{"unhandled":true,"message":"HTTPError"}`) and replaces that response with the same
  rendered error page, pulling the real error via `consumeLastCapturedError()` for logging.
- `src/lib/error-capture.ts` — records the last uncaught `error`/`unhandledrejection` event
  out-of-band (5s TTL) so `server.ts` can log the real cause even after h3 has swallowed it.
- `src/lib/error-page.ts` — the static HTML string used for the above 500 fallback.
- `src/lib/lovable-error-reporting.ts` — `reportLovableError`, called from the root route's React
  `errorComponent`, forwards client-side render errors to `window.__lovableEvents.captureException`
  (a hook Lovable's editor listens on) — a no-op outside the Lovable iframe/preview.

**Vite config.** `@lovable.dev/vite-tanstack-config` already wires up `tanstackStart`, `viteReact`,
`tailwindcss`, `tsConfigPaths`, `nitro` (build-only, Cloudflare target), the dev-only component
tagger, `VITE_*` env injection, the `@` path alias, React/TanStack deduping, and the error-logger
plugins described above. Do not re-add any of these plugins manually in `vite.config.ts` — doing
so breaks the app with duplicate plugins. Only pass extra config through `defineConfig({ vite: {...} })`.

**UI components.** `src/components/ui/*` are shadcn/ui primitives (generated via the shadcn CLI per
`components.json` — style `new-york`, base color `slate`, icon library `lucide`). `src/components/site/*`
are the app-specific composed components: `Navbar`/`Footer` (site chrome, used on every page) and
`BrandIcons.tsx` (hand-traced TikTok/Pinterest SVGs — lucide-react doesn't ship those two). Import
both via the `@/*` alias (maps to `src/*`).

**Social links.** `src/lib/social.ts` exports `SOCIAL_LINKS` — the one place real social profile
URLs + contact email live. Both the Footer and any page linking out to socials should import from
here rather than hardcoding URLs inline.

**Design tokens.** `src/styles.css` defines the full design system as OKLCH CSS custom properties
(`:root` for light, `.dark` for the dark-first default theme) mapped into Tailwind utilities via
`@theme inline`. The brand is black + gold: `--color-gold`/`--color-gold-foreground` and
`font-display` (Playfair Display, headings) vs. the default sans (Jost, body) are used throughout
routes/components — follow this existing token set (all new colors must also be OKLCH) rather than
introducing arbitrary Tailwind colors.
