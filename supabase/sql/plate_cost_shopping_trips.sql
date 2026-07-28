-- Shopping-trip schedule for staged beverage buying ahead of Charly Black
-- (Aug 28, 2026). Lives alongside the Beverages tab: a small editable
-- date+notes list (add/remove trips freely, not locked to exactly 4),
-- plus a free-text "trip" tag on each beverage line so you can see which
-- run buys what. Same open-anon-CRUD, no-login pattern as the rest of
-- this page.
create table if not exists plate_cost_shopping_trips (
  id uuid primary key default gen_random_uuid(),
  trip_date date not null,
  notes text not null default '',
  sort_order bigint not null default 0,
  created_at timestamptz not null default now()
);

alter table plate_cost_shopping_trips enable row level security;

create policy "Allow anon select" on plate_cost_shopping_trips for select to anon using (true);
create policy "Allow anon insert" on plate_cost_shopping_trips for insert to anon with check (true);
create policy "Allow anon update" on plate_cost_shopping_trips for update to anon using (true) with check (true);
create policy "Allow anon delete" on plate_cost_shopping_trips for delete to anon using (true);

-- Placeholder dates spread across the ~4 weeks before the Aug 28 show,
-- shelf-stable items first and perishables (ice) last -- adjust freely,
-- these are just a reasonable starting spread.
insert into plate_cost_shopping_trips (trip_date, notes, sort_order) values
  ('2026-08-01', 'Trip 1 — liquor & case beer (shelf-stable), warehouse run.', 10),
  ('2026-08-10', 'Trip 2 — top up beer cases, mixers & juices.', 20),
  ('2026-08-19', 'Trip 3 — remaining beer, water, bar supplies.', 30),
  ('2026-08-27', 'Trip 4 — ice and last-minute perishables (day before show).', 40);

alter table plate_cost_beverage_items add column if not exists trip text not null default '';

update plate_cost_beverage_items set trip = 'Trip 1' where item = 'Liquor (bottle-service stock)';
update plate_cost_beverage_items set trip = 'Trip 2' where item in ('Heineken', 'Guinness', 'Corona');
update plate_cost_beverage_items set trip = 'Trip 3' where item in ('Water', 'Mixers & juices', 'Cups', 'Stirrer');
update plate_cost_beverage_items set trip = 'Trip 4' where item = 'Ice';
