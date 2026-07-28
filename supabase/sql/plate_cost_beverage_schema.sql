-- Beverages tab on /plate-cost: bulk event-wide bar budget (bottle
-- service, case buys, mixers) rather than per-plate ingredient costing,
-- so it's a simpler Item/Quantity/Cost/Notes shape instead of
-- plate_cost_ingredients' case-cost-per-unit model. Same open-anon-CRUD,
-- no-login pattern as the rest of this page -- see plate_cost_schema.sql.

create table if not exists plate_cost_beverage_items (
  id uuid primary key default gen_random_uuid(),
  item text not null,
  quantity text not null default '',
  total_cost numeric not null default 0,
  notes text not null default '',
  sort_order bigint not null default 0,
  created_at timestamptz not null default now()
);

alter table plate_cost_beverage_items enable row level security;

create policy "Allow anon select" on plate_cost_beverage_items for select to anon using (true);
create policy "Allow anon insert" on plate_cost_beverage_items for insert to anon with check (true);
create policy "Allow anon update" on plate_cost_beverage_items for update to anon using (true) with check (true);
create policy "Allow anon delete" on plate_cost_beverage_items for delete to anon using (true);

insert into plate_cost_beverage_items (item, quantity, total_cost, notes, sort_order) values
  ('Liquor (bottle-service stock)', '', 5000, 'Hennessy, Remy, Don Julio, 1738, Tito''s, White Rum — order in advance', 10),
  ('Heineken', '10 cases', 250, '', 20),
  ('Guinness', '10 cases', 300, '', 30),
  ('Corona', '10 cases', 250, '', 40),
  ('Water', '', 200, '', 50),
  ('Mixers & juices', '', 1000, 'Red Bull, cranberry, coke, sprite, pineapple, OJ', 60),
  ('Cups, ice, bar supplies', '', 0, 'Estimate needed', 70);
