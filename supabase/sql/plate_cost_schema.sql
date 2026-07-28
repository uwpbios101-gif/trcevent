-- Jerky Jerk plate-cost worksheet (Charly Black "Good Times" catering).
-- Unlisted internal tool shared with an outside vendor (Jerky Jerk) -- no
-- login, so RLS intentionally allows anon full CRUD on just these two
-- tables (same "obscure route + scoped RLS" model as event_notify_signups,
-- just extended to read/update/delete for this one low-sensitivity table).
-- See src/routes/-plate-cost-page.tsx for the app that reads/writes this.

create table if not exists plate_cost_ingredients (
  id uuid primary key default gen_random_uuid(),
  dish text not null check (dish in ('jerk_chicken', 'curry_chicken', 'escovitch_fish', 'mannish_water')),
  category text not null check (category in ('Recipe', 'Service', 'Energy')),
  item text not null,
  case_cost numeric not null default 0,
  units_per_case numeric not null default 1,
  portion_unit text not null default '',
  qty_used_per_plate numeric not null default 0,
  notes text not null default '',
  sort_order bigint not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists plate_cost_settings (
  dish text primary key check (dish in ('jerk_chicken', 'curry_chicken', 'escovitch_fish', 'mannish_water')),
  target_food_cost_pct numeric not null default 0.30,
  actual_menu_price numeric not null default 0,
  updated_at timestamptz not null default now()
);

alter table plate_cost_ingredients enable row level security;
alter table plate_cost_settings enable row level security;

create policy "Allow anon select" on plate_cost_ingredients for select to anon using (true);
create policy "Allow anon insert" on plate_cost_ingredients for insert to anon with check (true);
create policy "Allow anon update" on plate_cost_ingredients for update to anon using (true) with check (true);
create policy "Allow anon delete" on plate_cost_ingredients for delete to anon using (true);

create policy "Allow anon select" on plate_cost_settings for select to anon using (true);
create policy "Allow anon insert" on plate_cost_settings for insert to anon with check (true);
create policy "Allow anon update" on plate_cost_settings for update to anon using (true) with check (true);

insert into plate_cost_settings (dish) values
  ('jerk_chicken'), ('curry_chicken'), ('escovitch_fish'), ('mannish_water')
on conflict (dish) do nothing;

insert into plate_cost_ingredients (dish, category, item, portion_unit, sort_order) values
  -- Jerk Chicken
  ('jerk_chicken', 'Recipe', 'Chicken (bone-in, skin-on)', 'lb', 10),
  ('jerk_chicken', 'Recipe', 'Jerk wet marinade & seasoning', 'oz', 20),
  ('jerk_chicken', 'Recipe', 'Pimento wood / charcoal (smoking fuel)', 'plate portion', 30),
  ('jerk_chicken', 'Recipe', 'Rice & peas', 'lb', 40),
  ('jerk_chicken', 'Recipe', 'Coconut milk', 'can', 50),
  ('jerk_chicken', 'Recipe', 'Cabbage slaw', 'lb', 60),
  ('jerk_chicken', 'Service', '3-compartment carryout container', 'each', 70),
  ('jerk_chicken', 'Service', 'Utensil + napkin kit', 'each', 80),
  ('jerk_chicken', 'Service', 'To-go bag', 'each', 90),
  ('jerk_chicken', 'Energy', 'Propane / charcoal (grill fuel)', 'plate portion', 100),
  ('jerk_chicken', 'Energy', 'Electricity allocation', 'plate portion', 110),

  -- Curry Chicken
  ('curry_chicken', 'Recipe', 'Chicken (bone-in pieces)', 'lb', 10),
  ('curry_chicken', 'Recipe', 'Curry powder & seasoning', 'oz', 20),
  ('curry_chicken', 'Recipe', 'Potatoes', 'lb', 30),
  ('curry_chicken', 'Recipe', 'Onion / garlic / scotch bonnet aromatics', 'lb', 40),
  ('curry_chicken', 'Recipe', 'Cooking oil', 'oz', 50),
  ('curry_chicken', 'Recipe', 'Rice & peas', 'lb', 60),
  ('curry_chicken', 'Service', '3-compartment carryout container', 'each', 70),
  ('curry_chicken', 'Service', 'Utensil + napkin kit', 'each', 80),
  ('curry_chicken', 'Service', 'To-go bag', 'each', 90),
  ('curry_chicken', 'Energy', 'Stove fuel', 'plate portion', 100),
  ('curry_chicken', 'Energy', 'Electricity allocation', 'plate portion', 110),

  -- Escovitch Fish
  ('escovitch_fish', 'Recipe', 'Fish (whole or fillet)', 'lb', 10),
  ('escovitch_fish', 'Recipe', 'Frying oil', 'oz', 20),
  ('escovitch_fish', 'Recipe', 'Seasoned flour (dusting)', 'oz', 30),
  ('escovitch_fish', 'Recipe', 'Escovitch pickle (vinegar, peppers, carrots, onion, pimento)', 'oz', 40),
  ('escovitch_fish', 'Recipe', 'Bammy or festival (side)', 'each', 50),
  ('escovitch_fish', 'Service', '3-compartment carryout container', 'each', 60),
  ('escovitch_fish', 'Service', 'Utensil + napkin kit', 'each', 70),
  ('escovitch_fish', 'Service', 'To-go bag', 'each', 80),
  ('escovitch_fish', 'Energy', 'Fryer fuel', 'plate portion', 90),
  ('escovitch_fish', 'Energy', 'Electricity allocation', 'plate portion', 100),

  -- Mannish Water
  ('mannish_water', 'Recipe', 'Goat meat & bones', 'lb', 10),
  ('mannish_water', 'Recipe', 'Green banana', 'each', 20),
  ('mannish_water', 'Recipe', 'Yam', 'lb', 30),
  ('mannish_water', 'Recipe', 'Dumplings (flour)', 'lb', 40),
  ('mannish_water', 'Recipe', 'Scotch bonnet / aromatics / seasoning', 'oz', 50),
  ('mannish_water', 'Recipe', 'Scallion & thyme', 'oz', 60),
  ('mannish_water', 'Service', 'Soup container with lid', 'each', 70),
  ('mannish_water', 'Service', 'Spoon + napkin kit', 'each', 80),
  ('mannish_water', 'Service', 'To-go bag', 'each', 90),
  ('mannish_water', 'Energy', 'Stove fuel', 'plate portion', 100),
  ('mannish_water', 'Energy', 'Electricity allocation', 'plate portion', 110);
