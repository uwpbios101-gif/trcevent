-- TRC Events (trcevent.com) only. Applied 2026-11-25 with
--   supabase db query --linked -f supabase/sql/trc_past_events_and_irie_jerk_rename.sql
-- Idempotent: safe to re-run.

begin;

-- 1. Rename the weekly lineup table: the venue is Irie Jerk, not Jerky Jerk.
do $$
begin
  if exists (select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
             where n.nspname = 'public' and c.relname = 'jerky_jerk_weekly_lineup' and c.relkind = 'r') then
    alter table public.jerky_jerk_weekly_lineup rename to irie_jerk_weekly_lineup;
  end if;
end $$;

-- Lineup edits happen through SQL as the postgres/service role. The public roles
-- only ever need to read (RLS already blocks writes; this is belt and braces).
revoke insert, update, delete, truncate on public.irie_jerk_weekly_lineup from anon, authenticated;
grant select on public.irie_jerk_weekly_lineup to anon, authenticated;

-- Temporary compatibility view so the site build that is live while this runs
-- (which still queries the old name) keeps working until the new build deploys.
-- Drop it once the new build is live:  drop view public.jerky_jerk_weekly_lineup;
create or replace view public.jerky_jerk_weekly_lineup
  with (security_invoker = true)
  as select * from public.irie_jerk_weekly_lineup;
revoke all on public.jerky_jerk_weekly_lineup from anon, authenticated;
grant select on public.jerky_jerk_weekly_lineup to anon, authenticated;

-- 2. Archive of past one-off events, shown on /past-events.
create table if not exists public.trc_past_events (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  event_date   date not null,          -- last day of the event, used for ordering
  date_label   text not null,          -- human-readable, e.g. "Friday, August 28, 2026"
  path         text not null,          -- page on trcevent.com, e.g. /charly-black
  image_key    text,                   -- flyer bundled with the site (see -past-events-page.tsx)
  image_url    text,                   -- or an absolute flyer URL for events without a bundled one
  description  text not null default '',
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.trc_past_events enable row level security;

drop policy if exists "Public can read published past events" on public.trc_past_events;
create policy "Public can read published past events"
  on public.trc_past_events for select
  to anon, authenticated
  using (is_published);

revoke all on public.trc_past_events from anon, authenticated;
grant select on public.trc_past_events to anon, authenticated;

insert into public.trc_past_events (slug, name, event_date, date_label, path, image_key, description) values
  ('chicago-vybez', 'Chicago Vybez — Prestige In The Park', '2026-09-07',
   'Labor Day Weekend, September 4–7, 2026', '/chicago-vybez', 'chicago-vybez',
   'Four days of sound systems, food and fresh cuts in the park, free all Labor Day weekend.'),
  ('charly-black', 'Charly Black — Good Times', '2026-08-28',
   'Friday, August 28, 2026', '/charly-black', 'charly-black',
   'Charly Black live in Chicago for a Historic Chicago Night at Bombay Banquet Hall.'),
  ('st-catherine-linkup', 'Bad Like Di 90''s — St. Catherine Link-Up', '2026-08-22',
   'Saturday, August 22, 2026', '/st-catherine-linkup', 'st-catherine-linkup',
   'One Parish, One Link, One Community — free at ILU Club of Chicago, Dolton, IL.'),
  ('jamaicaday', 'Jamaica Independence Celebration', '2026-08-09',
   'Sunday, August 9, 2026', '/jamaicaday', 'jamaicaday',
   'Team Lenky''s annual Jamaica Independence Celebration at The Prairie Lawn, Chicago.'),
  ('jamaica64', 'Jamaica64: United in Celebrating Resilience', '2026-08-02',
   'Sunday, August 2, 2026', '/jamaica64', 'jamaica64',
   'A day on the beach at Stiner Pavilion, Waukegan, IL, presented by One Love Music Festival.')
on conflict (slug) do nothing;

commit;
