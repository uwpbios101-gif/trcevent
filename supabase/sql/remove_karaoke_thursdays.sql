-- Karaoke Thursdays is retired; Thursdays are Irie Jerk & Juggling.
-- The site already hides these rows in code; run this to remove them for good.
delete from jerky_jerk_weekly_lineup where slug in ('karaoke-thursdays', 'karaoke-after-dark');
