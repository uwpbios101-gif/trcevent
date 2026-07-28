-- Expand curry_chicken, escovitch_fish, and mannish_water to the same
-- ingredient-level granularity as jerk_chicken (which came from Stephen's
-- Plate_Cost.xlsx). No equivalent spreadsheet exists for these three, so
-- item names/case sizes are drawn from real Jamaican recipe ingredient
-- lists (see chat sources) rather than an existing document. case_cost and
-- qty_used_per_plate stay at 0 -- units_per_case is a reasonable starting
-- case size for Jerky Jerk to adjust.

delete from plate_cost_ingredients where dish in ('curry_chicken', 'escovitch_fish', 'mannish_water');

insert into plate_cost_ingredients
  (dish, category, item, units_per_case, portion_unit, notes, sort_order) values

  -- Curry Chicken
  ('curry_chicken', 'Recipe', 'Chicken (bone-in pieces, thigh/drumstick)', 40, 'lb', '40 lb case.', 10),
  ('curry_chicken', 'Recipe', 'Jamaican curry powder', 72, 'oz', 'Case of 12 x 6 oz jars.', 20),
  ('curry_chicken', 'Recipe', 'All-purpose seasoning (adobo, thyme, allspice)', 26, 'oz (26 oz jar)', '26 oz jar.', 30),
  ('curry_chicken', 'Recipe', 'Fresh ginger & garlic', 32, 'oz', '2 lb bag, minced.', 40),
  ('curry_chicken', 'Recipe', 'Onion / scallion / scotch bonnet aromatics', 300, 'plate portion', 'Blended produce/seasoning cost allocated per plate.', 50),
  ('curry_chicken', 'Recipe', 'Potatoes', 50, 'lb', '50 lb case.', 60),
  ('curry_chicken', 'Recipe', 'Carrots', 25, 'lb', '25 lb bag.', 70),
  ('curry_chicken', 'Recipe', 'Coconut milk, canned', 24, 'can (13.5 oz)', 'Case of 24 cans.', 80),
  ('curry_chicken', 'Recipe', 'Cooking oil', 512, 'oz (4x1 gal case)', 'Oil for browning chicken and building the curry base.', 90),
  ('curry_chicken', 'Recipe', 'Rice & peas (starch side)', 25, 'lb', '25 lb bag, dry weight.', 100),
  ('curry_chicken', 'Service', '3-compartment hinged carryout container', 150, 'each', 'Standard carryout clamshell.', 110),
  ('curry_chicken', 'Service', 'Plastic utensil + napkin kit', 500, 'each', 'Fork, knife, napkin combo pack.', 120),
  ('curry_chicken', 'Service', 'To-go plastic bag', 500, 'each', 'Carryout bag.', 130),
  ('curry_chicken', 'Energy', 'Stove burner fuel (propane/gas)', 120, 'plate portion', '~120 plates cooked per tank; blended per-plate allocation.', 140),
  ('curry_chicken', 'Energy', 'Electricity allocation', 100, 'plate portion', 'Daily utility allocation ÷ ~100 plates per service day.', 150),

  -- Escovitch Fish
  ('escovitch_fish', 'Recipe', 'Whole fish or fillet (snapper/tilapia)', 40, 'lb', '40 lb case, cleaned fish.', 10),
  ('escovitch_fish', 'Recipe', 'Fish seasoning (salt, black pepper, garlic powder, adobo)', 26, 'oz (26 oz jar)', '26 oz jar.', 20),
  ('escovitch_fish', 'Recipe', 'Frying oil', 512, 'oz (4x1 gal case)', 'Oil absorbed frying fish.', 30),
  ('escovitch_fish', 'Recipe', 'Seasoned flour (dusting)', 25, 'lb (25 lb bag)', 'For dusting fish before frying.', 40),
  ('escovitch_fish', 'Recipe', 'White vinegar (escovitch pickle base)', 128, 'oz (1 gal jug)', '1 gal jug.', 50),
  ('escovitch_fish', 'Recipe', 'Onion (escovitch pickle)', 25, 'lb', '25 lb bag.', 60),
  ('escovitch_fish', 'Recipe', 'Carrots (escovitch pickle)', 25, 'lb', '25 lb bag.', 70),
  ('escovitch_fish', 'Recipe', 'Bell peppers, red & green (escovitch pickle)', 25, 'lb', '25 lb case, mixed colors.', 80),
  ('escovitch_fish', 'Recipe', 'Scotch bonnet pepper & pimento (allspice) berries', 16, 'oz (1 lb bag)', '1 lb bag, for the pickle.', 90),
  ('escovitch_fish', 'Recipe', 'Sugar (pickle brine)', 25, 'lb (25 lb bag)', '25 lb bag.', 100),
  ('escovitch_fish', 'Recipe', 'Bammy or festival (side)', 50, 'each', 'Case of ~50 pieces.', 110),
  ('escovitch_fish', 'Service', '3-compartment hinged carryout container', 150, 'each', 'Standard carryout clamshell.', 120),
  ('escovitch_fish', 'Service', 'Plastic utensil + napkin kit', 500, 'each', 'Fork, knife, napkin combo pack.', 130),
  ('escovitch_fish', 'Service', 'To-go plastic bag', 500, 'each', 'Carryout bag.', 140),
  ('escovitch_fish', 'Energy', 'Fryer fuel (propane/gas)', 120, 'plate portion', '~120 plates fried per tank; blended per-plate allocation.', 150),
  ('escovitch_fish', 'Energy', 'Electricity allocation', 100, 'plate portion', 'Daily utility allocation ÷ ~100 plates per service day.', 160),

  -- Mannish Water
  ('mannish_water', 'Recipe', 'Goat meat & bones (incl. head/tripe for broth)', 40, 'lb', '40 lb case, mixed cuts including bone-in for the broth.', 10),
  ('mannish_water', 'Recipe', 'All-purpose seasoning (thyme, allspice, garlic, onion powder)', 26, 'oz (26 oz jar)', '26 oz jar.', 20),
  ('mannish_water', 'Recipe', 'Scotch bonnet pepper', 16, 'oz (1 lb bag)', '1 lb bag.', 30),
  ('mannish_water', 'Recipe', 'Scallion & fresh thyme', 16, 'oz (1 lb bunch)', '1 lb bunched.', 40),
  ('mannish_water', 'Recipe', 'Green banana', 50, 'each', 'Case of ~50 green bananas.', 50),
  ('mannish_water', 'Recipe', 'Yellow yam', 40, 'lb', '40 lb case.', 60),
  ('mannish_water', 'Recipe', 'Chayote (cho cho)', 25, 'lb', '25 lb case.', 70),
  ('mannish_water', 'Recipe', 'Carrots', 25, 'lb', '25 lb bag.', 80),
  ('mannish_water', 'Recipe', 'Dumplings (flour, for spinners)', 25, 'lb (25 lb bag)', '25 lb bag of flour.', 90),
  ('mannish_water', 'Recipe', 'White rum (traditional splash)', 25.4, 'oz (750 ml bottle)', '750 ml bottle.', 100),
  ('mannish_water', 'Recipe', 'Pumpkin (optional, for body/color)', 25, 'lb', '25 lb case; optional -- some cooks skip it.', 110),
  ('mannish_water', 'Service', 'Soup container with lid', 150, 'each', 'Standard carryout soup container.', 120),
  ('mannish_water', 'Service', 'Spoon + napkin kit', 500, 'each', 'Spoon and napkin combo pack.', 130),
  ('mannish_water', 'Service', 'To-go plastic bag', 500, 'each', 'Carryout bag.', 140),
  ('mannish_water', 'Energy', 'Stove fuel (propane/gas)', 120, 'plate portion', '~120 servings simmered per tank; blended per-plate allocation.', 150),
  ('mannish_water', 'Energy', 'Electricity allocation', 100, 'plate portion', 'Daily utility allocation ÷ ~100 plates per service day.', 160);
