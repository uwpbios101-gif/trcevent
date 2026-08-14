-- Jerky Jerk's weekly day+night activity lineup (the "14-Activity Model"),
-- sourced from Jerky_Jerk_NonAlcoholic_Food.xlsx's "Weekly Master (14
-- Activities)" tab, cross-referenced against that workbook's Day Party
-- Detail / Night Party Detail / Signature Menu by Event tabs (the Weekly
-- Master tab's own "Activity" column has copy/paste errors for Sun/Mon/Wed/
-- Fri -- the other tabs agree with each other and were used instead).
--
-- Read-only from the site: no anon write policy, since this is marketing
-- copy Stephen/Marlon updates directly via SQL, not a vendor-editable tool
-- like plate_cost_ingredients. See src/lib/jerkyJerkLineup.ts for the reader.
--
-- detail_path is null for most rows -- the app defaults those to
-- /jerky-jerk/<slug> (a generic stub detail page). It's set explicitly for
-- two exceptions that reuse an existing page instead:
--   - Dancehall101 -> /dancehall-101 (formerly Uptown Lounge's Wednesday-night
--     event, rerouted to this Friday Jerky Jerk flagship night per Stephen's
--     call 2026-08-14)
--   - sing-ova-sundays -> /sing-ova-sundays/chicago (confirmed by Stephen
--     2026-08-14 to be the same brand/event, not a coincidental name reuse --
--     see the sos_cities 'chicago' row, whose venue was updated to Jerky
--     Jerk at the same time). Soul Sundays (the monthly special that swaps
--     into this same slot) keeps its own generic stub instead, since the
--     Sing Ova chapter page has no Soul Sundays-specific content.
-- Every other Jerky Jerk activity's ONLY venue is Jerky Jerk itself unless a
-- row says otherwise (Stephen's explicit rule, 2026-08-14).

create table if not exists jerky_jerk_weekly_lineup (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  day_of_week text not null check (day_of_week in ('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat')),
  day_index int not null check (day_index between 0 and 6),
  phase text not null check (phase in ('day', 'night')),
  slot_order int not null,
  name text not null,
  time_window text,
  description text,
  signature_plate text,
  signature_drinks text,
  cover_charge numeric,
  alcohol_free boolean not null default true,
  is_flagship boolean not null default false,
  is_monthly_special boolean not null default false,
  -- Jerky Jerk venue policy (confirmed by Stephen 2026-08-14): any activity
  -- starting at 10p is 21+, regardless of alcohol service -- day parties and
  -- the 4p-9p Sunday night slot (Sing Ova Sundays/Soul Sundays) are not.
  is_21_plus boolean not null default false,
  replaces_slug text references jerky_jerk_weekly_lineup (slug),
  detail_path text,
  updated_at timestamptz not null default now()
);

alter table jerky_jerk_weekly_lineup enable row level security;

create policy "Allow anon select" on jerky_jerk_weekly_lineup for select to anon using (true);

insert into jerky_jerk_weekly_lineup
  (slug, day_of_week, day_index, phase, slot_order, name, time_window, description, signature_plate, signature_drinks, cover_charge, is_flagship, is_monthly_special, is_21_plus, replaces_slug, detail_path)
values
  ('sunday-sessions', 'Sun', 0, 'day', 1, 'Sunday Sessions', '12:00p–4:00p',
    'Family dinner + open mic, wrapping up in time to hand off into Sing Ova Sundays.',
    null, null, 0, false, false, false, null, null),
  ('sing-ova-sundays', 'Sun', 0, 'night', 2, 'Sing Ova Sundays', '4:00p–9:00p',
    'Reggae/R&B/crossover residency — the week''s Sunday gathering.',
    'Sing Ova Sunday Supper', 'Roots & Culture Sunrise, Redemption Peanut Punch, Rasta Roots Sorrel Spritz',
    5, false, false, false, null, '/sing-ova-sundays/chicago'),
  ('soul-sundays', 'Sun', 0, 'night', 2, 'Soul Sundays', '4:00p–9:00p',
    'Once-a-month upgrade to Sing Ova Sundays — live soul vocalist/band, bigger production.',
    'Soul Sunday Supper Plate', 'Soul Sunday Sunrise, Harmony Peanut Punch, Gospel Sorrel Spritz',
    5, false, true, false, 'sing-ova-sundays', null),
  ('nu2u-radio-sessions', 'Mon', 1, 'day', 3, 'NU2U Radio Sessions', '6:00p–10:00p',
    'Daytime world-music, DJ-curated listening lounge.',
    null, null, 0, false, false, false, null, null),
  ('nu2u-radio-live', 'Mon', 1, 'night', 4, 'NU2U Radio Live', '10:00p–2:00a',
    'DJ-led world-music night.',
    'On-Air Wing Combo', 'NU2U Global Cooler, Rewind Punch, Static & Splash',
    5, false, false, true, null, null),
  ('ackee-acid-jazz', 'Tue', 2, 'day', 5, 'Ackee & Acid Jazz', '6:00p–10:00p',
    'Coffeehouse + acid jazz, a Caribbean-inflected daytime lounge.',
    null, null, 0, false, false, false, null, null),
  ('ackee-acid-jazz-after-dark', 'Tue', 2, 'night', 6, 'Ackee & Acid Jazz: After Dark', '10:00p–2:00a',
    'The acid-jazz lounge continues after dark.',
    'Blue Note Jerk & Splash', 'Ackee Cooler, Smooth Sorrel Jazz, Syncopated Splash',
    5, false, false, true, null, null),
  ('just-laugh-wednesdays', 'Wed', 3, 'day', 7, 'Just Laugh Wednesdays', '6:00p–10:00p',
    'Stand-up and open mic comedy.',
    null, null, 0, false, false, false, null, null),
  ('laugh-after-dark', 'Wed', 3, 'night', 8, 'Laugh After Dark', '10:00p–2:00a',
    'Comedy''s late set.',
    'Punchline Wing Combo', 'Laugh Riot Lemonade, Last Laugh Punch, Sidesplitter Sorrel Spritz',
    5, false, false, true, null, null),
  ('karaoke-thursdays', 'Thu', 4, 'day', 9, 'Karaoke Thursdays', '6:00p–10:00p',
    'KJ-hosted karaoke.',
    null, null, 0, false, false, false, null, null),
  ('karaoke-after-dark', 'Thu', 4, 'night', 10, 'Karaoke After Dark', '10:00p–2:00a',
    'Karaoke''s late set.',
    'Solo Star Wing Combo', 'Karaoke Kooler, Mic Drop Punch, Encore Peanut Punch',
    5, false, false, true, null, null),
  ('dancehall101-hospitality', 'Fri', 5, 'day', 11, 'Dancehall101 Hospitality', '12:00p–10:00p',
    'Food service continues through the day, building into Friday''s flagship night.',
    null, null, 0, false, false, false, null, null),
  ('dancehall101', 'Fri', 5, 'night', 12, 'Dancehall101', '10:00p–2:00a',
    'The week''s flagship night — free entry for college students with a verified .edu email.',
    'Bashment Bottomless Plate', 'Dancehall Sunset, Bashment Peanut Punch, Riddim Irish Moss',
    5, true, false, true, null, '/dancehall-101'),
  ('swiftie-saturdays', 'Sat', 6, 'day', 13, 'Swiftie Saturdays', '3:00p–10:00p',
    'Eras-themed, family-friendly daytime party.',
    null, null, 0, false, false, false, null, null),
  ('swiftie-saturdays-after-dark', 'Sat', 6, 'night', 14, 'Swiftie Saturdays: After Dark', '10:00p–2:00a',
    'The Eras-themed night continues after dark.',
    'Cardigan Combo Plate', 'Swiftie Sparkle Lemonade, Cruel Summer Cooler, Karma Colada Punch',
    5, false, false, true, null, null)
on conflict (slug) do nothing;
