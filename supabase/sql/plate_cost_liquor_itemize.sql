-- Break the single "Liquor (bottle-service stock)" $5,000 lump sum into
-- its 6 actual brands. No per-brand cost/quantity data exists, and
-- liquor doesn't come in 24-bottle cases like beer -- so this makes NO
-- assumption about case size or per-bottle cost. Every numeric field
-- stays at 0 for Jerky Jerk/the bar lead to fill in with real numbers;
-- the previous $5,000 placeholder is gone, so the beverage total will
-- read lower until these are filled in -- that's expected, not a bug.
delete from plate_cost_beverage_items where item = 'Liquor (bottle-service stock)';

insert into plate_cost_beverage_items (item, quantity, total_cost, units, sell_price, trip, notes, sort_order) values
  ('Hennessy', '', 0, 0, 0, 'Trip 1', 'Order in advance.', 11),
  ('Remy', '', 0, 0, 0, 'Trip 1', 'Order in advance.', 12),
  ('Don Julio', '', 0, 0, 0, 'Trip 1', 'Order in advance.', 13),
  ('1738', '', 0, 0, 0, 'Trip 1', 'Order in advance.', 14),
  ('Tito''s', '', 0, 0, 0, 'Trip 1', 'Order in advance.', 15),
  ('White Rum', '', 0, 0, 0, 'Trip 1', 'Order in advance.', 16);
