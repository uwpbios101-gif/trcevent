// Shared visual identity for the whole "Sing Ova" brand -- the /sing-ova
// hub and every /sing-ova-sundays/$city chapter page use the exact same
// palette so they read as one thing, not five unrelated pages. Overrides
// the design system's CSS custom properties on each page's own wrapper
// only (via inline style), so every shadcn primitive (Button, Input, Card,
// Badge...) picks up the cream/forest-green/gold palette automatically
// without touching src/styles.css or any other page on the site.
// --gold/--primary are deliberately left untouched so the site's one brand
// gold stays consistent everywhere it's used.
export const SOS_THEME_VARS = {
  "--background": "oklch(0.93 0.028 85)",
  "--foreground": "oklch(0.22 0.025 85)",
  "--card": "oklch(0.895 0.03 82)",
  "--card-foreground": "oklch(0.22 0.025 85)",
  "--popover": "oklch(0.895 0.03 82)",
  "--popover-foreground": "oklch(0.22 0.025 85)",
  "--border": "oklch(0.72 0.035 78)",
  "--input": "oklch(0.85 0.03 82)",
  "--muted": "oklch(0.87 0.025 82)",
  "--muted-foreground": "oklch(0.42 0.03 80)",
  "--accent": "oklch(0.2 0.05 155)",
  "--accent-foreground": "oklch(0.93 0.025 85)",
  "--secondary": "oklch(0.19 0.045 155)",
  "--secondary-foreground": "oklch(0.93 0.02 85)",
  "--ring": "oklch(0.5 0.11 80)",
};

export const SOS_LABEL_CLASS = "text-xs font-semibold uppercase tracking-wide text-secondary";
