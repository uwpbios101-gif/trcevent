-- Fill in qty_used_per_plate (and refresh notes with the portion-size
-- reasoning) for every ingredient row across all four dishes. Numbers are
-- grounded in standard catering/recipe portion research where a real
-- reference exists (chicken leg quarter weight, rice/coleslaw/fish
-- portions, goat meat serving size, curry-powder and jerk-marinade
-- ratios, deep-fry oil absorption rate, plantain serving size -- see chat
-- for sources); items with no searchable standard (pickle vegetables,
-- soup aromatics, spice pinches) use reasoned proportional estimates
-- flagged as such in their notes. All of these are a starting point for
-- Jerky Jerk to correct against their actual recipe -- that's the point
-- of qty_used_per_plate being an editable, not fixed, field.
--
-- "plate portion" rows (blended/allocated items like smoking fuel or
-- aromatics) always get qty = 1: units_per_case already encodes "this
-- many plates share one unit," so the multiplier per plate is 1 by
-- definition. Every "each" service item likewise gets qty = 1 (one
-- container/utensil kit/bag per plate).

-- Jerk Chicken
update plate_cost_ingredients set qty_used_per_plate = 0.5,
  notes = '40 lb case. ~8 oz (one leg quarter) per plate -- average raw weight of a chicken leg quarter.'
  where dish = 'jerk_chicken' and item = 'Chicken leg quarters (bone-in, skin-on)';
update plate_cost_ingredients set qty_used_per_plate = 0.9,
  notes = 'Wet jerk paste/marinade. ~3.5 Tbsp marinade per lb of chicken -> ~0.9 oz for an 8 oz portion.'
  where dish = 'jerk_chicken' and item = 'Jerk wet marinade & seasoning';
update plate_cost_ingredients set qty_used_per_plate = 1,
  notes = 'Bag smokes ~100 plates of chicken; blended per-plate allocation -- qty is always 1 for allocated "plate portion" items.'
  where dish = 'jerk_chicken' and item = 'Pimento wood chips (smoking fuel)';
update plate_cost_ingredients set qty_used_per_plate = 0.14,
  notes = 'Dry weight. ~1/3 cup (~2.3 oz) dry rice per side portion, per catering rice-portion guidance.'
  where dish = 'jerk_chicken' and item = 'Long grain white rice';
update plate_cost_ingredients set qty_used_per_plate = 0.25,
  notes = 'Case of 24 cans. ~1/4 can blended into a batch of rice & peas per plate.'
  where dish = 'jerk_chicken' and item = 'Pigeon peas, canned (gungo peas)';
update plate_cost_ingredients set qty_used_per_plate = 0.2,
  notes = 'Case of 24 cans. ~1/5 can per plate, blended into the rice cooking liquid.'
  where dish = 'jerk_chicken' and item = 'Coconut milk, canned';
update plate_cost_ingredients set qty_used_per_plate = 1,
  notes = 'Blended produce/seasoning cost allocated per plate -- qty is always 1 for allocated "plate portion" items.'
  where dish = 'jerk_chicken' and item = 'Rice & peas aromatics (onion, garlic, scallion, thyme, scotch bonnet)';
update plate_cost_ingredients set qty_used_per_plate = 0.19,
  notes = '50 lb case. ~3 oz of the standard ~4 oz catering coleslaw portion.'
  where dish = 'jerk_chicken' and item = 'Cabbage (for slaw)';
update plate_cost_ingredients set qty_used_per_plate = 0.06,
  notes = '25 lb bag. ~1 oz of the standard ~4 oz catering coleslaw portion.'
  where dish = 'jerk_chicken' and item = 'Carrots (for slaw)';
update plate_cost_ingredients set qty_used_per_plate = 1,
  notes = 'Blended dressing cost allocated per plate -- qty is always 1 for allocated "plate portion" items.'
  where dish = 'jerk_chicken' and item = 'Slaw dressing (mayo, vinegar, sugar)';
update plate_cost_ingredients set qty_used_per_plate = 0.5,
  notes = 'Case of ~50 plantains. ~1/2 plantain (5-6 slices) per serving, per standard fried-plantain portions.'
  where dish = 'jerk_chicken' and item = 'Green plantains';
update plate_cost_ingredients set qty_used_per_plate = 0.5,
  notes = 'Oil absorbed frying plantains. Deep-fried food retains ~10-15% of its weight in oil; ~4 oz plantain serving -> ~0.5 oz oil.'
  where dish = 'jerk_chicken' and item = 'Frying oil';
update plate_cost_ingredients set qty_used_per_plate = 1,
  notes = 'Standard carryout clamshell. One per plate.'
  where dish = 'jerk_chicken' and item = '3-compartment hinged carryout container';
update plate_cost_ingredients set qty_used_per_plate = 1,
  notes = 'Fork, knife, napkin combo pack. One per plate.'
  where dish = 'jerk_chicken' and item = 'Plastic utensil + napkin kit';
update plate_cost_ingredients set qty_used_per_plate = 1,
  notes = '2 oz portion cup + lid. One per plate.'
  where dish = 'jerk_chicken' and item = 'Sauce cup with lid (extra jerk sauce)';
update plate_cost_ingredients set qty_used_per_plate = 1,
  notes = 'Carryout bag. One per plate.'
  where dish = 'jerk_chicken' and item = 'To-go plastic bag';
update plate_cost_ingredients set qty_used_per_plate = 1,
  notes = 'Liner sheet. One per plate.'
  where dish = 'jerk_chicken' and item = 'Foil sheet (pan liner/wrap)';
update plate_cost_ingredients set qty_used_per_plate = 1,
  notes = '~120 plates of chicken cooked per tank; blended per-plate allocation -- qty is always 1 for allocated "plate portion" items.'
  where dish = 'jerk_chicken' and item = 'Propane (20 lb tank) — grill/smoker fuel';
update plate_cost_ingredients set qty_used_per_plate = 1,
  notes = 'Daily utility allocation ÷ ~100 plates per service day -- qty is always 1 for allocated "plate portion" items.'
  where dish = 'jerk_chicken' and item = 'Electricity — stove + fryer allocation';

-- Curry Chicken
update plate_cost_ingredients set qty_used_per_plate = 0.5,
  notes = '40 lb case. ~8 oz portion, matching the jerk chicken protein portion.'
  where dish = 'curry_chicken' and item = 'Chicken (bone-in pieces, thigh/drumstick)';
update plate_cost_ingredients set qty_used_per_plate = 0.3,
  notes = 'Case of 12 x 6 oz jars. ~1.3 Tbsp curry powder per lb of chicken -> ~0.3 oz for an 8 oz portion.'
  where dish = 'curry_chicken' and item = 'Jamaican curry powder';
update plate_cost_ingredients set qty_used_per_plate = 0.2,
  notes = '26 oz jar. ~1 tsp all-purpose seasoning per plate.'
  where dish = 'curry_chicken' and item = 'All-purpose seasoning (adobo, thyme, allspice)';
update plate_cost_ingredients set qty_used_per_plate = 0.15,
  notes = '2 lb bag, minced. Light aromatic use per plate -- estimate, adjust to taste.'
  where dish = 'curry_chicken' and item = 'Fresh ginger & garlic';
update plate_cost_ingredients set qty_used_per_plate = 1,
  notes = 'Blended produce/seasoning cost allocated per plate -- qty is always 1 for allocated "plate portion" items.'
  where dish = 'curry_chicken' and item = 'Onion / scallion / scotch bonnet aromatics';
update plate_cost_ingredients set qty_used_per_plate = 0.19,
  notes = '50 lb case. ~3 oz of potato per plate, sized like a standard catering vegetable side.'
  where dish = 'curry_chicken' and item = 'Potatoes';
update plate_cost_ingredients set qty_used_per_plate = 0.06,
  notes = '25 lb bag. ~1 oz of carrot per plate -- a minor bulk ingredient next to the potato.'
  where dish = 'curry_chicken' and item = 'Carrots';
update plate_cost_ingredients set qty_used_per_plate = 0.2,
  notes = 'Case of 24 cans. ~1/5 can per plate, blended into the curry gravy.'
  where dish = 'curry_chicken' and item = 'Coconut milk, canned';
update plate_cost_ingredients set qty_used_per_plate = 0.5,
  notes = 'Oil for browning chicken and building the curry base. ~0.5 oz retained per plate -- estimate.'
  where dish = 'curry_chicken' and item = 'Cooking oil';
update plate_cost_ingredients set qty_used_per_plate = 0.14,
  notes = '25 lb bag, dry weight. ~1/3 cup (~2.3 oz) dry rice-equivalent per plate, per catering rice-portion guidance.'
  where dish = 'curry_chicken' and item = 'Rice & peas (starch side)';
update plate_cost_ingredients set qty_used_per_plate = 1,
  notes = 'Standard carryout clamshell. One per plate.'
  where dish = 'curry_chicken' and item = '3-compartment hinged carryout container';
update plate_cost_ingredients set qty_used_per_plate = 1,
  notes = 'Fork, knife, napkin combo pack. One per plate.'
  where dish = 'curry_chicken' and item = 'Plastic utensil + napkin kit';
update plate_cost_ingredients set qty_used_per_plate = 1,
  notes = 'Carryout bag. One per plate.'
  where dish = 'curry_chicken' and item = 'To-go plastic bag';
update plate_cost_ingredients set qty_used_per_plate = 1,
  notes = '~120 plates cooked per tank; blended per-plate allocation -- qty is always 1 for allocated "plate portion" items.'
  where dish = 'curry_chicken' and item = 'Stove burner fuel (propane/gas)';
update plate_cost_ingredients set qty_used_per_plate = 1,
  notes = 'Daily utility allocation ÷ ~100 plates per service day -- qty is always 1 for allocated "plate portion" items.'
  where dish = 'curry_chicken' and item = 'Electricity allocation';

-- Escovitch Fish
update plate_cost_ingredients set qty_used_per_plate = 0.44,
  notes = '40 lb case, cleaned fish. ~7 oz raw fillet per plate -- standard restaurant portions run 6-8 oz raw for a cooked 5-6 oz serving.'
  where dish = 'escovitch_fish' and item = 'Whole fish or fillet (snapper/tilapia)';
update plate_cost_ingredients set qty_used_per_plate = 0.2,
  notes = '26 oz jar. Light dry-seasoning coat per fillet.'
  where dish = 'escovitch_fish' and item = 'Fish seasoning (salt, black pepper, garlic powder, adobo)';
update plate_cost_ingredients set qty_used_per_plate = 0.8,
  notes = 'Oil absorbed frying fish. Deep-fried food retains ~10-15% of its weight in oil; ~7 oz fillet -> ~0.8 oz oil.'
  where dish = 'escovitch_fish' and item = 'Frying oil';
update plate_cost_ingredients set qty_used_per_plate = 0.06,
  notes = '25 lb bag. ~1 oz dusting flour per fillet.'
  where dish = 'escovitch_fish' and item = 'Seasoned flour (dusting)';
update plate_cost_ingredients set qty_used_per_plate = 1,
  notes = '1 gal jug. ~1 oz pickle liquid spooned over the fish per plate.'
  where dish = 'escovitch_fish' and item = 'White vinegar (escovitch pickle base)';
update plate_cost_ingredients set qty_used_per_plate = 0.06,
  notes = '25 lb bag. ~1 oz sliced onion topping per plate.'
  where dish = 'escovitch_fish' and item = 'Onion (escovitch pickle)';
update plate_cost_ingredients set qty_used_per_plate = 0.03,
  notes = '25 lb bag. ~0.5 oz julienned carrot topping per plate.'
  where dish = 'escovitch_fish' and item = 'Carrots (escovitch pickle)';
update plate_cost_ingredients set qty_used_per_plate = 0.03,
  notes = '25 lb case, mixed colors. ~0.5 oz pepper strips per plate.'
  where dish = 'escovitch_fish' and item = 'Bell peppers, red & green (escovitch pickle)';
update plate_cost_ingredients set qty_used_per_plate = 0.1,
  notes = '1 lb bag, for the pickle. A pinch/few berries and a sliver of pepper per plate -- used sparingly, adjust to taste.'
  where dish = 'escovitch_fish' and item = 'Scotch bonnet pepper & pimento (allspice) berries';
update plate_cost_ingredients set qty_used_per_plate = 0.02,
  notes = '25 lb bag. ~0.3 oz dissolved into the pickle brine per plate.'
  where dish = 'escovitch_fish' and item = 'Sugar (pickle brine)';
update plate_cost_ingredients set qty_used_per_plate = 1,
  notes = 'Case of ~50 pieces. One per plate.'
  where dish = 'escovitch_fish' and item = 'Bammy or festival (side)';
update plate_cost_ingredients set qty_used_per_plate = 1,
  notes = 'Standard carryout clamshell. One per plate.'
  where dish = 'escovitch_fish' and item = '3-compartment hinged carryout container';
update plate_cost_ingredients set qty_used_per_plate = 1,
  notes = 'Fork, knife, napkin combo pack. One per plate.'
  where dish = 'escovitch_fish' and item = 'Plastic utensil + napkin kit';
update plate_cost_ingredients set qty_used_per_plate = 1,
  notes = 'Carryout bag. One per plate.'
  where dish = 'escovitch_fish' and item = 'To-go plastic bag';
update plate_cost_ingredients set qty_used_per_plate = 1,
  notes = '~120 plates fried per tank; blended per-plate allocation -- qty is always 1 for allocated "plate portion" items.'
  where dish = 'escovitch_fish' and item = 'Fryer fuel (propane/gas)';
update plate_cost_ingredients set qty_used_per_plate = 1,
  notes = 'Daily utility allocation ÷ ~100 plates per service day -- qty is always 1 for allocated "plate portion" items.'
  where dish = 'escovitch_fish' and item = 'Electricity allocation';

-- Mannish Water
update plate_cost_ingredients set qty_used_per_plate = 0.25,
  notes = '40 lb case, mixed cuts including bone-in for the broth. ~4 oz meat/bone per bowl, per typical mannish-water serving sizes.'
  where dish = 'mannish_water' and item = 'Goat meat & bones (incl. head/tripe for broth)';
update plate_cost_ingredients set qty_used_per_plate = 0.15,
  notes = '26 oz jar. Light seasoning per bowl -- flavors a big pot, not a heavy per-bowl dose.'
  where dish = 'mannish_water' and item = 'All-purpose seasoning (thyme, allspice, garlic, onion powder)';
update plate_cost_ingredients set qty_used_per_plate = 0.05,
  notes = '1 lb bag. A tiny sliver per bowl -- very spicy, used sparingly across the whole pot.'
  where dish = 'mannish_water' and item = 'Scotch bonnet pepper';
update plate_cost_ingredients set qty_used_per_plate = 0.1,
  notes = '1 lb bunched. Light garnish/flavoring per bowl.'
  where dish = 'mannish_water' and item = 'Scallion & fresh thyme';
update plate_cost_ingredients set qty_used_per_plate = 0.5,
  notes = 'Case of ~50 green bananas. ~1/2 banana, cut into pieces, per bowl.'
  where dish = 'mannish_water' and item = 'Green banana';
update plate_cost_ingredients set qty_used_per_plate = 0.13,
  notes = '40 lb case. ~2 oz yam chunk per bowl.'
  where dish = 'mannish_water' and item = 'Yellow yam';
update plate_cost_ingredients set qty_used_per_plate = 0.09,
  notes = '25 lb case. ~1.5 oz chunk per bowl.'
  where dish = 'mannish_water' and item = 'Chayote (cho cho)';
update plate_cost_ingredients set qty_used_per_plate = 0.06,
  notes = '25 lb bag. ~1 oz per bowl.'
  where dish = 'mannish_water' and item = 'Carrots';
update plate_cost_ingredients set qty_used_per_plate = 0.06,
  notes = '25 lb bag of flour. ~1 oz flour, about 2 small spinner dumplings, per bowl.'
  where dish = 'mannish_water' and item = 'Dumplings (flour, for spinners)';
update plate_cost_ingredients set qty_used_per_plate = 0.25,
  notes = '750 ml bottle. A traditional splash (~1.5 tsp) per bowl.'
  where dish = 'mannish_water' and item = 'White rum (traditional splash)';
update plate_cost_ingredients set qty_used_per_plate = 0.06,
  notes = '25 lb case; optional -- some cooks skip it. ~1 oz per bowl if used.'
  where dish = 'mannish_water' and item = 'Pumpkin (optional, for body/color)';
update plate_cost_ingredients set qty_used_per_plate = 1,
  notes = 'Standard carryout soup container. One per plate.'
  where dish = 'mannish_water' and item = 'Soup container with lid';
update plate_cost_ingredients set qty_used_per_plate = 1,
  notes = 'Spoon and napkin combo pack. One per plate.'
  where dish = 'mannish_water' and item = 'Spoon + napkin kit';
update plate_cost_ingredients set qty_used_per_plate = 1,
  notes = 'Carryout bag. One per plate.'
  where dish = 'mannish_water' and item = 'To-go plastic bag';
update plate_cost_ingredients set qty_used_per_plate = 1,
  notes = '~120 servings simmered per tank; blended per-plate allocation -- qty is always 1 for allocated "plate portion" items.'
  where dish = 'mannish_water' and item = 'Stove fuel (propane/gas)';
update plate_cost_ingredients set qty_used_per_plate = 1,
  notes = 'Daily utility allocation ÷ ~100 plates per service day -- qty is always 1 for allocated "plate portion" items.'
  where dish = 'mannish_water' and item = 'Electricity allocation';

-- Rows added by a live edit through the app itself (not part of the
-- original seed) -- covered here so nothing on the sheet is left at
-- qty_used_per_plate = 0.
update plate_cost_ingredients set qty_used_per_plate = 0.25,
  notes = 'Case of 24 cans. ~1/4 can blended into a batch of rice & peas per plate. Note: traditional Jamaican "rice & peas" usually uses red kidney beans (locally called "red peas"), not pigeon peas -- you may want to keep this row and drop the separate "Pigeon peas" row to avoid double-counting beans.'
  where dish = 'jerk_chicken' and item = 'Red peas, canned (gungo peas)';
update plate_cost_ingredients set qty_used_per_plate = 0.5,
  notes = 'Case of ~50 plantains. ~1/2 plantain (5-6 slices) per serving. Note: a fried-plantain side is usually made with ripe (yellow) plantains for sweetness -- green plantains are more often boiled/savory -- so this may be the more accurate item vs. the "Green plantains" row above.'
  where dish = 'jerk_chicken' and item = 'Ripe plantains';
update plate_cost_ingredients set qty_used_per_plate = 1, portion_unit = 'plate portion', units_per_case = 120,
  notes = '~120 plates cooked per bag; blended per-plate allocation, same convention as the propane tank above. If charcoal is your actual grill fuel (propane just for backup/lighting), keep this and remove the propane row -- don''t price both as if you''re burning both per plate.'
  where dish = 'jerk_chicken' and item = 'Charcoal Briquettes';
