-- Break the single "Bammy or festival (side)" row on Escovitch Fish into
-- two labeled ingredient groups, since it was really an either/or choice
-- with no breakdown. Festival is a fried cornmeal/flour dumpling; bammy
-- is a cassava flatbread -- for catering at this scale, bammy is
-- realistically bought as pre-made rounds from a Caribbean grocer, not
-- made from raw cassava (grating/draining/pressing isn't practical for
-- hundreds of plates), so that assumption is baked into the "Bammy:"
-- rows' notes. Quantities are sized for a standard 2-dumpling festival
-- portion / one bammy round per plate.

-- Make room: push Service/Energy sort_order well past the new rows.
update plate_cost_ingredients set sort_order = 200 where dish = 'escovitch_fish' and item = '3-compartment hinged carryout container';
update plate_cost_ingredients set sort_order = 210 where dish = 'escovitch_fish' and item = 'Plastic utensil + napkin kit';
update plate_cost_ingredients set sort_order = 220 where dish = 'escovitch_fish' and item = 'To-go plastic bag';
update plate_cost_ingredients set sort_order = 230 where dish = 'escovitch_fish' and item = 'Fryer fuel (propane/gas)';
update plate_cost_ingredients set sort_order = 240 where dish = 'escovitch_fish' and item = 'Electricity allocation';

delete from plate_cost_ingredients where dish = 'escovitch_fish' and item = 'Bammy or festival (side)';

insert into plate_cost_ingredients
  (dish, category, item, units_per_case, portion_unit, qty_used_per_plate, notes, sort_order) values
  ('escovitch_fish', 'Recipe', 'Festival: All-purpose flour', 25, 'lb (25 lb bag)', 0.09,
    '~1.5 oz flour for a 2-dumpling side portion (standard recipe: ~2 cups flour makes ~12 dumplings).', 111),
  ('escovitch_fish', 'Recipe', 'Festival: Cornmeal', 25, 'lb (25 lb bag)', 0.025,
    '~0.4 oz cornmeal for a 2-dumpling portion.', 112),
  ('escovitch_fish', 'Recipe', 'Festival: Sugar', 25, 'lb (25 lb bag)', 0.016,
    '~1/4 Tbsp sugar for a 2-dumpling portion.', 113),
  ('escovitch_fish', 'Recipe', 'Festival: Baking powder', 10, 'oz (10 oz can)', 0.02,
    'A pinch per 2-dumpling portion.', 114),
  ('escovitch_fish', 'Recipe', 'Festival: Salt', 26, 'oz (26 oz jar)', 0.01,
    'A pinch per 2-dumpling portion.', 115),
  ('escovitch_fish', 'Recipe', 'Festival: Vanilla extract', 32, 'oz (32 oz bottle)', 0.02,
    'A few drops per 2-dumpling portion.', 116),
  ('escovitch_fish', 'Recipe', 'Festival: Milk', 128, 'oz (1 gal jug)', 0.7,
    '~2/3 oz milk for a 2-dumpling portion.', 117),
  ('escovitch_fish', 'Recipe', 'Festival: Frying oil', 512, 'oz (4x1 gal case)', 0.5,
    'Oil absorbed frying 2 dumplings (~3.5 oz cooked weight, ~12% oil retention).', 118),
  ('escovitch_fish', 'Recipe', 'Bammy: Pre-made bammy round', 50, 'each', 1,
    'One round per plate. Assumes pre-made bammy bought from a Caribbean grocer/supplier, not made from scratch -- standard for catering at this scale.', 119),
  ('escovitch_fish', 'Recipe', 'Bammy: Coconut milk (for soaking)', 24, 'can (13.5 oz)', 0.1,
    '~1/10 can to soften the bammy before frying.', 120),
  ('escovitch_fish', 'Recipe', 'Bammy: Frying oil', 512, 'oz (4x1 gal case)', 0.6,
    'Oil absorbed frying one ~5 oz bammy round (~12% oil retention).', 121);
