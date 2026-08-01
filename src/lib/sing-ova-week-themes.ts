// The 8-week "Cover Story" format is the brand-wide show format, identical
// across every city's own 8-week run (each city's "week 1" is relative to
// its own launch date) -- not per-city data. Shared between the /sing-ova
// hub and every /sing-ova-sundays/$city page so the calendar reads the
// same everywhere.
export const WEEK_THEMES = [
  { week: 1, theme: "Lovers Rock vs. Slow Jams", promise: "Reggae lovers rock paired with R&B slow jams." },
  { week: 2, theme: "Riddim Rewind", promise: "One riddim traced across eras, artists, and genres." },
  { week: 3, theme: "Dancehall x Hip-Hop", promise: "Dancehall anthems beside the hip-hop records they influenced." },
  { week: 4, theme: "Roots & Culture", promise: "Message-driven reggae with a deeper cultural frame." },
  { week: 5, theme: "Unexpected Voices", promise: "White/Latino paired with dancehall/reggae crossover." },
  { week: 6, theme: "Throwback Sunday", promise: "60s/70s R&B, reggae, and dancehall side by side." },
  { week: 7, theme: "Queens of the Riddim", promise: "Women artists across R&B, reggae, and dancehall." },
  { week: 8, theme: "Wildcard / Request Sunday", promise: "Crowd pairings, resident picks, and a guest selector." },
] as const;
