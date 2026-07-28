-- Add per-unit sell price / unit count to the beverage tab so profit can
-- be computed (revenue = units * sell_price, profit = revenue - cost).
-- Left at 0 for anything not resold per-unit (bottle-service liquor,
-- water, mixers, bar supplies) -- the UI shows "--" for profit when
-- sell_price is 0 rather than a misleading negative "profit" on a cost
-- that was never meant to be recouped per-unit.
alter table plate_cost_beverage_items add column if not exists units numeric not null default 0;
alter table plate_cost_beverage_items add column if not exists sell_price numeric not null default 0;

-- $5/beer per the client; unit counts assume a standard 24-can/bottle
-- case (10 cases x 24 = 240) -- flagged in notes since the real case
-- size wasn't specified, so this is a starting point to correct in place.
update plate_cost_beverage_items set units = 240, sell_price = 5,
  notes = notes || case when notes = '' then '' else ' ' end || 'Assumes a standard 24-can/bottle case (10 cases x 24 = 240 units) -- correct "Units" if your actual case size differs.'
  where item in ('Heineken', 'Guinness', 'Corona');
