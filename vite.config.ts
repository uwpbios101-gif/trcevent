// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // The site is deployed to GitHub Pages (no server at runtime), so every route is
    // prerendered to static HTML at build time instead of rendered per-request.
    // (nitro's own "static"/"github-pages" deploy presets conflict with the custom
    // server.entry override above, so this uses TanStack Start's own prerender option
    // instead of a nitro preset.)
    prerender: {
      enabled: true,
      crawlLinks: true,
    },
  },
});
