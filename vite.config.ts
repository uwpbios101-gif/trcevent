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
      // crawlLinks follows every <a href>, including the flyer flipper's link to the
      // raw image itself (used for "open full size"). Without this filter it tries to
      // prerender that image as if it were an HTML page, and writes back a corrupted
      // (UTF-8-mangled) copy over the real binary asset — silently breaking the image.
      // Only real routes should ever be prerendered, so skip anything under /assets/.
      filter: ({ path }) => !path.startsWith("/assets/"),
    },
    // /sing-ova-sundays/$city is never linked from anywhere (crawlLinks can't find
    // it), so without this it falls back to GitHub Pages' 404.html -- a raw copy of
    // whatever page happens to be dist/client/index.html at deploy time (currently
    // Charly Black), which isn't guaranteed to hydrate cleanly into a totally
    // different route. Chicago is a known, confirmed city, so prerender it for
    // real; the still-tentative cities keep relying on the fallback for now since
    // nobody has a direct link to them yet.
    pages: [{ path: "/sing-ova-sundays/chicago" }],
  },
});
