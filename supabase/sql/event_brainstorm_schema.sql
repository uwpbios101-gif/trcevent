-- Jerky Jerk event-brainstorm tool (Karaoke Thursdays / Mingles Tuesdays /
-- Just Laugh Wednesday). Unlisted internal tool for Marlon -- no login, so
-- RLS intentionally allows anon select/insert/update on this one table
-- (same "obscure route + scoped RLS" model as plate_cost_ingredients; no
-- delete policy since there's exactly one row per event, never removed).
-- See src/components/site/EventBrainstormTool.tsx for the app that reads/writes this.

create table if not exists event_brainstorm_sessions (
  id uuid primary key default gen_random_uuid(),
  event_slug text not null unique check (event_slug in ('karaoke-thursdays', 'mingles-tuesdays', 'just-laugh-wednesday')),
  event_name text not null,
  transcript text not null default '',
  concept text,
  generated_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table event_brainstorm_sessions enable row level security;

create policy "Allow anon select" on event_brainstorm_sessions for select to anon using (true);
create policy "Allow anon insert" on event_brainstorm_sessions for insert to anon with check (true);
create policy "Allow anon update" on event_brainstorm_sessions for update to anon using (true) with check (true);

insert into event_brainstorm_sessions (event_slug, event_name) values
  ('karaoke-thursdays', 'Karaoke Thursdays'),
  ('mingles-tuesdays', 'Mingles Tuesdays'),
  ('just-laugh-wednesday', 'Just Laugh Wednesday')
on conflict (event_slug) do nothing;
