-- 24/case is confirmed correct for Heineken/Guinness/Corona, so drop the
-- earlier "correct this if it's wrong" hedge -- see plate_cost_beverage_profit.sql
-- for where the original note came from.
update plate_cost_beverage_items
  set notes = '24-can/bottle case: 10 cases x 24 = 240 units.'
  where item in ('Heineken', 'Guinness', 'Corona');
