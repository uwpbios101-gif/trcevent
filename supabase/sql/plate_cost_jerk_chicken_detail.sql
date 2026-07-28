-- Expand jerk_chicken's ingredient rows to match the fuller breakdown from
-- Stephen's existing Plate_Cost.xlsx template (case-size defaults carried
-- over as a starting point; case_cost/qty_used_per_plate still left at 0
-- for Jerky Jerk to fill in with real numbers).
delete from plate_cost_ingredients where dish = 'jerk_chicken';

insert into plate_cost_ingredients
  (dish, category, item, units_per_case, portion_unit, notes, sort_order) values
  ('jerk_chicken', 'Recipe', 'Chicken leg quarters (bone-in, skin-on)', 40, 'lb', '40 lb case.', 10),
  ('jerk_chicken', 'Recipe', 'Jerk wet marinade & seasoning', 128, 'oz (1 gal jug)', 'Wet jerk paste/marinade.', 20),
  ('jerk_chicken', 'Recipe', 'Pimento wood chips (smoking fuel)', 100, 'plate portion', 'Bag smokes ~100 plates of chicken; blended per-plate allocation.', 30),
  ('jerk_chicken', 'Recipe', 'Long grain white rice', 25, 'lb (25 lb bag)', 'Dry weight.', 40),
  ('jerk_chicken', 'Recipe', 'Pigeon peas, canned (gungo peas)', 24, 'can (15 oz)', 'Case of 24 cans.', 50),
  ('jerk_chicken', 'Recipe', 'Coconut milk, canned', 24, 'can (13.5 oz)', 'Case of 24 cans.', 60),
  ('jerk_chicken', 'Recipe', 'Rice & peas aromatics (onion, garlic, scallion, thyme, scotch bonnet)', 300, 'plate portion', 'Blended produce/seasoning cost allocated per plate.', 70),
  ('jerk_chicken', 'Recipe', 'Cabbage (for slaw)', 50, 'lb', '50 lb case.', 80),
  ('jerk_chicken', 'Recipe', 'Carrots (for slaw)', 25, 'lb', '25 lb bag.', 90),
  ('jerk_chicken', 'Recipe', 'Slaw dressing (mayo, vinegar, sugar)', 300, 'plate portion', 'Blended dressing cost allocated per plate.', 100),
  ('jerk_chicken', 'Recipe', 'Green plantains', 50, 'each', 'Case of ~50 plantains.', 110),
  ('jerk_chicken', 'Recipe', 'Frying oil', 512, 'oz (4x1 gal case)', 'Oil absorbed frying plantains.', 120),
  ('jerk_chicken', 'Service', '3-compartment hinged carryout container', 150, 'each', 'Standard carryout clamshell.', 130),
  ('jerk_chicken', 'Service', 'Plastic utensil + napkin kit', 500, 'each', 'Fork, knife, napkin combo pack.', 140),
  ('jerk_chicken', 'Service', 'Sauce cup with lid (extra jerk sauce)', 1000, 'each', '2 oz portion cup + lid.', 150),
  ('jerk_chicken', 'Service', 'To-go plastic bag', 500, 'each', 'Carryout bag.', 160),
  ('jerk_chicken', 'Service', 'Foil sheet (pan liner/wrap)', 500, 'each', 'Liner sheet.', 170),
  ('jerk_chicken', 'Energy', 'Propane (20 lb tank) — grill/smoker fuel', 120, 'plate portion', '~120 plates of chicken cooked per tank; blended per-plate allocation.', 180),
  ('jerk_chicken', 'Energy', 'Electricity — stove + fryer allocation', 100, 'plate portion', 'Daily utility allocation ÷ ~100 plates per service day.', 190);
