// Shared by src/routes/plate-cost.tsx. The "-" prefix excludes this file
// from route generation (TanStack Router convention) -- see
// src/routes/README.md.
//
// Live, editable plate-cost worksheet for Jerky Jerk (catering the Charly
// Black "Good Times" show): ingredient-level case-cost -> per-plate-cost
// build for Jerk Chicken, Curry Chicken, Escovitch Fish, and Mannish Water.
// Unlike the other admin pages in this repo (comp-admin, contract-admin),
// this one is intentionally NOT behind a Supabase Auth login -- it's meant
// to be edited by an outside vendor with no account, like a shared
// spreadsheet. The unlisted URL is the only gate; RLS on
// plate_cost_ingredients/plate_cost_settings allows anon full CRUD on just
// those two tables (see supabase/sql/plate_cost_schema.sql).
//
// Styling is intentionally hardcoded to black-on-white with a 16px+ floor,
// overriding the site's dark-first theme tokens -- this page is a working
// document read by a caterer at a glance, not a branded marketing page.
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SITE_URL = "https://trcevent.com";

export function plateCostHead() {
  return {
    meta: [
      { title: "Plate Cost Worksheet | TRC Events" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/plate-cost` }],
  };
}

type Category = "Recipe" | "Service" | "Energy";
type DishKey = "jerk_chicken" | "curry_chicken" | "escovitch_fish" | "mannish_water";

type Ingredient = {
  id: string;
  dish: DishKey;
  category: Category;
  item: string;
  case_cost: number;
  units_per_case: number;
  portion_unit: string;
  qty_used_per_plate: number;
  notes: string;
  sort_order: number;
};

type Settings = {
  dish: DishKey;
  target_food_cost_pct: number;
  actual_menu_price: number;
};

type BeverageItem = {
  id: string;
  item: string;
  quantity: string;
  total_cost: number;
  units: number;
  sell_price: number;
  trip: string;
  notes: string;
  sort_order: number;
};

type ShoppingTrip = {
  id: string;
  trip_date: string;
  notes: string;
  sort_order: number;
};

type TabKey = DishKey | "beverages";

const DISHES: Array<{ key: DishKey; label: string }> = [
  { key: "jerk_chicken", label: "Jerk Chicken" },
  { key: "curry_chicken", label: "Curry Chicken" },
  { key: "escovitch_fish", label: "Escovitch Fish" },
  { key: "mannish_water", label: "Mannish Water" },
];

const TABS: Array<{ key: TabKey; label: string }> = [
  ...DISHES,
  { key: "beverages", label: "Beverages" },
];

const CATEGORIES: Category[] = ["Recipe", "Service", "Energy"];

const FIELD_CLASS =
  "border-gray-400 bg-white text-base text-black placeholder:text-gray-500 focus-visible:ring-gray-400 md:text-base";

function toNum(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

function money(n: number) {
  return (Number.isFinite(n) ? n : 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function costPerUnit(ing: Ingredient) {
  return ing.units_per_case > 0 ? ing.case_cost / ing.units_per_case : 0;
}

function extendedCost(ing: Ingredient) {
  return ing.qty_used_per_plate * costPerUnit(ing);
}

function beverageProfit(row: BeverageItem) {
  return row.units * row.sell_price - row.total_cost;
}

function NumberCell({
  value,
  onCommit,
  step = "0.01",
}: {
  value: number;
  onCommit: (next: number) => void;
  step?: string;
}) {
  const [text, setText] = useState(String(value));

  useEffect(() => {
    setText(String(value));
  }, [value]);

  return (
    <Input
      type="number"
      step={step}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => onCommit(toNum(text))}
      className={`${FIELD_CLASS} h-10 w-24`}
    />
  );
}

function TextCell({
  value,
  onCommit,
  placeholder,
  className,
}: {
  value: string;
  onCommit: (next: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [text, setText] = useState(value);

  useEffect(() => {
    setText(value);
  }, [value]);

  return (
    <Input
      value={text}
      placeholder={placeholder}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => onCommit(text)}
      className={`${FIELD_CLASS} ${className ?? "h-10"}`}
    />
  );
}

function DateCell({ value, onCommit }: { value: string; onCommit: (next: string) => void }) {
  const [text, setText] = useState(value);

  useEffect(() => {
    setText(value);
  }, [value]);

  return (
    <Input
      type="date"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => onCommit(text)}
      className={`${FIELD_CLASS} h-10 w-44`}
    />
  );
}

function CategorySection({
  category,
  rows,
  onUpdate,
  onRemove,
  onAdd,
}: {
  category: Category;
  rows: Ingredient[];
  onUpdate: (id: string, field: keyof Ingredient, value: string | number) => void;
  onRemove: (id: string) => void;
  onAdd: (category: Category) => void;
}) {
  const subtotal = rows.reduce((sum, r) => sum + extendedCost(r), 0);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-black">{category}</h3>
        <span className="text-base text-gray-700">
          {category} subtotal: <strong className="text-black">{money(subtotal)}</strong>
        </span>
      </div>
      <div className="mt-2 rounded-lg border border-gray-300">
        <Table className="text-base">
          <TableHeader>
            <TableRow className="border-gray-200 hover:bg-transparent">
              <TableHead className="min-w-[220px] text-base font-semibold text-black">
                Item
              </TableHead>
              <TableHead className="text-base font-semibold text-black">Case Cost ($)</TableHead>
              <TableHead className="text-base font-semibold text-black">Units / Case</TableHead>
              <TableHead className="text-base font-semibold text-black">Portion Unit</TableHead>
              <TableHead className="text-base font-semibold text-black">
                Cost / Portion Unit ($)
              </TableHead>
              <TableHead className="text-base font-semibold text-black">Qty Used / Plate</TableHead>
              <TableHead className="text-base font-semibold text-black">
                Extended Cost ($)
              </TableHead>
              <TableHead className="min-w-[200px] text-base font-semibold text-black">
                Notes / Source
              </TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="border-gray-200 hover:bg-gray-50">
                <TableCell>
                  <TextCell
                    value={row.item}
                    placeholder="Ingredient or item name"
                    onCommit={(v) => onUpdate(row.id, "item", v)}
                    className="h-10 min-w-[200px]"
                  />
                </TableCell>
                <TableCell>
                  <NumberCell
                    value={row.case_cost}
                    onCommit={(v) => onUpdate(row.id, "case_cost", v)}
                  />
                </TableCell>
                <TableCell>
                  <NumberCell
                    value={row.units_per_case}
                    onCommit={(v) => onUpdate(row.id, "units_per_case", v)}
                    step="1"
                  />
                </TableCell>
                <TableCell>
                  <TextCell
                    value={row.portion_unit}
                    placeholder="lb, oz, each…"
                    onCommit={(v) => onUpdate(row.id, "portion_unit", v)}
                    className="h-10 w-28"
                  />
                </TableCell>
                <TableCell className="text-base text-gray-700">{money(costPerUnit(row))}</TableCell>
                <TableCell>
                  <NumberCell
                    value={row.qty_used_per_plate}
                    onCommit={(v) => onUpdate(row.id, "qty_used_per_plate", v)}
                  />
                </TableCell>
                <TableCell className="font-medium text-black">{money(extendedCost(row))}</TableCell>
                <TableCell>
                  <TextCell
                    value={row.notes}
                    placeholder="Supplier, case size, allocation…"
                    onCommit={(v) => onUpdate(row.id, "notes", v)}
                    className="h-10 min-w-[180px]"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-100"
                    onClick={() => onRemove(row.id)}
                    aria-label="Remove row"
                  >
                    <Trash2 className="size-4 text-gray-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="mt-2 border-gray-400 bg-white text-base text-black hover:bg-gray-100"
        onClick={() => onAdd(category)}
      >
        <Plus className="size-4" /> Add {category.toLowerCase()} item
      </Button>
    </div>
  );
}

function DishWorksheet({ dishKey }: { dishKey: DishKey }) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [settings, setSettings] = useState<Settings>({
    dish: dishKey,
    target_food_cost_pct: 0.3,
    actual_menu_price: 0,
  });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [
      { data: ingredientRows, error: ingredientsError },
      { data: settingsRow, error: settingsError },
    ] = await Promise.all([
      supabase.from("plate_cost_ingredients").select("*").eq("dish", dishKey).order("sort_order"),
      supabase.from("plate_cost_settings").select("*").eq("dish", dishKey).maybeSingle(),
    ]);
    if (ingredientsError || settingsError) {
      toast.error("Couldn't load the worksheet. Try refreshing.");
    }
    setIngredients(ingredientRows ?? []);
    if (settingsRow) setSettings(settingsRow);
    setLoading(false);
  }, [dishKey]);

  useEffect(() => {
    load();
  }, [load]);

  function updateIngredientLocal(id: string, field: keyof Ingredient, value: string | number) {
    setIngredients((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  }

  async function commitIngredient(id: string, field: keyof Ingredient, value: string | number) {
    updateIngredientLocal(id, field, value);
    const { error } = await supabase
      .from("plate_cost_ingredients")
      .update({ [field]: value })
      .eq("id", id);
    if (error) toast.error("Couldn't save that change.");
  }

  async function addRow(category: Category) {
    const { data, error } = await supabase
      .from("plate_cost_ingredients")
      .insert({
        dish: dishKey,
        category,
        item: "",
        case_cost: 0,
        units_per_case: 1,
        portion_unit: "",
        qty_used_per_plate: 0,
        notes: "",
        sort_order: Date.now(),
      })
      .select()
      .single();
    if (error || !data) {
      toast.error("Couldn't add a new row.");
      return;
    }
    setIngredients((prev) => [...prev, data]);
  }

  async function removeRow(id: string) {
    setIngredients((prev) => prev.filter((row) => row.id !== id));
    const { error } = await supabase.from("plate_cost_ingredients").delete().eq("id", id);
    if (error) {
      toast.error("Couldn't remove that row.");
      load();
    }
  }

  function updateSettingsLocal(field: keyof Settings, value: number) {
    setSettings((prev) => ({ ...prev, [field]: value }));
  }

  async function commitSettings(field: keyof Settings, value: number) {
    updateSettingsLocal(field, value);
    const { error } = await supabase
      .from("plate_cost_settings")
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq("dish", dishKey);
    if (error) toast.error("Couldn't save that change.");
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-12 text-base text-gray-700">
        <Loader2 className="size-4 animate-spin" /> Loading…
      </div>
    );
  }

  const subtotals = Object.fromEntries(
    CATEGORIES.map((category) => [
      category,
      ingredients
        .filter((row) => row.category === category)
        .reduce((sum, row) => sum + extendedCost(row), 0),
    ]),
  ) as Record<Category, number>;
  const total = CATEGORIES.reduce((sum, category) => sum + subtotals[category], 0);

  const targetPct = settings.target_food_cost_pct;
  const suggestedPrice = targetPct > 0 ? total / targetPct : 0;
  const actualPrice = settings.actual_menu_price;
  const resultingPct = actualPrice > 0 ? total / actualPrice : 0;
  const grossProfit = actualPrice - total;

  return (
    <div>
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="border-gray-400 bg-white text-base text-black hover:bg-gray-100"
          onClick={load}
        >
          <RefreshCw className="size-4" /> Refresh
        </Button>
      </div>

      {CATEGORIES.map((category) => (
        <CategorySection
          key={category}
          category={category}
          rows={ingredients.filter((row) => row.category === category)}
          onUpdate={commitIngredient}
          onRemove={removeRow}
          onAdd={addRow}
        />
      ))}

      <Card className="mt-6 border-gray-300 bg-white text-black">
        <CardHeader>
          <CardTitle className="font-display text-black">Total Cost Per Plate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-base">
          {CATEGORIES.map((category) => (
            <div key={category} className="flex justify-between text-gray-700">
              <span>{category} subtotal</span>
              <span>{money(subtotals[category])}</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between border-t border-gray-300 pt-2 text-lg font-bold text-black">
            <span>Total cost per plate (all-in)</span>
            <span>{money(total)}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 border-gray-300 bg-white text-black">
        <CardHeader>
          <CardTitle className="font-display text-black">Menu Pricing Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-base">
          <div className="flex items-center justify-between gap-4">
            <span className="text-black">Target food cost % (industry norm 28–35%)</span>
            <Input
              type="number"
              step="1"
              className={`${FIELD_CLASS} h-10 w-24`}
              value={Math.round(targetPct * 100)}
              onChange={(e) =>
                updateSettingsLocal("target_food_cost_pct", toNum(e.target.value) / 100)
              }
              onBlur={() => commitSettings("target_food_cost_pct", targetPct)}
            />
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Suggested menu price at target food cost %</span>
            <span>{money(suggestedPrice)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-black">Actual menu price you plan to charge</span>
            <Input
              type="number"
              step="0.01"
              className={`${FIELD_CLASS} h-10 w-24`}
              value={actualPrice}
              onChange={(e) => updateSettingsLocal("actual_menu_price", toNum(e.target.value))}
              onBlur={() => commitSettings("actual_menu_price", actualPrice)}
            />
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Resulting food cost % at that price</span>
            <span>{actualPrice > 0 ? `${(resultingPct * 100).toFixed(1)}%` : "—"}</span>
          </div>
          <div className="flex justify-between font-medium text-black">
            <span>Gross profit per plate at that price</span>
            <span>{actualPrice > 0 ? money(grossProfit) : "—"}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ShoppingTripsSection() {
  const [trips, setTrips] = useState<ShoppingTrip[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("plate_cost_shopping_trips")
      .select("*")
      .order("trip_date");
    if (error) toast.error("Couldn't load the shopping trip schedule.");
    setTrips(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function updateLocal(id: string, field: keyof ShoppingTrip, value: string) {
    setTrips((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  }

  async function commit(id: string, field: keyof ShoppingTrip, value: string) {
    updateLocal(id, field, value);
    const { error } = await supabase
      .from("plate_cost_shopping_trips")
      .update({ [field]: value })
      .eq("id", id);
    if (error) toast.error("Couldn't save that change.");
  }

  async function addTrip() {
    const { data, error } = await supabase
      .from("plate_cost_shopping_trips")
      .insert({
        trip_date: new Date().toISOString().slice(0, 10),
        notes: "",
        sort_order: Date.now(),
      })
      .select()
      .single();
    if (error || !data) {
      toast.error("Couldn't add a new trip.");
      return;
    }
    setTrips((prev) => [...prev, data]);
  }

  async function removeTrip(id: string) {
    setTrips((prev) => prev.filter((row) => row.id !== id));
    const { error } = await supabase.from("plate_cost_shopping_trips").delete().eq("id", id);
    if (error) {
      toast.error("Couldn't remove that trip.");
      load();
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-black">Shopping Trip Schedule</h3>
        <Button
          variant="outline"
          size="sm"
          className="border-gray-400 bg-white text-base text-black hover:bg-gray-100"
          onClick={load}
        >
          <RefreshCw className="size-4" /> Refresh
        </Button>
      </div>
      {loading ? (
        <div className="flex items-center gap-2 py-6 text-base text-gray-700">
          <Loader2 className="size-4 animate-spin" /> Loading…
        </div>
      ) : (
        <>
          <div className="mt-2 rounded-lg border border-gray-300">
            <Table className="text-base">
              <TableHeader>
                <TableRow className="border-gray-200 hover:bg-transparent">
                  <TableHead className="text-base font-semibold text-black">Date</TableHead>
                  <TableHead className="min-w-[320px] text-base font-semibold text-black">
                    What to buy
                  </TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.map((trip) => (
                  <TableRow key={trip.id} className="border-gray-200 hover:bg-gray-50">
                    <TableCell>
                      <DateCell
                        value={trip.trip_date}
                        onCommit={(v) => commit(trip.id, "trip_date", v)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextCell
                        value={trip.notes}
                        placeholder="What to buy this trip"
                        onCommit={(v) => commit(trip.id, "notes", v)}
                        className="h-10 min-w-[300px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-gray-100"
                        onClick={() => removeTrip(trip.id)}
                        aria-label="Remove trip"
                      >
                        <Trash2 className="size-4 text-gray-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 border-gray-400 bg-white text-base text-black hover:bg-gray-100"
            onClick={addTrip}
          >
            <Plus className="size-4" /> Add trip
          </Button>
        </>
      )}
    </div>
  );
}

function BeverageWorksheet() {
  const [items, setItems] = useState<BeverageItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("plate_cost_beverage_items")
      .select("*")
      .order("sort_order");
    if (error) toast.error("Couldn't load the beverage list. Try refreshing.");
    setItems(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function updateLocal(id: string, field: keyof BeverageItem, value: string | number) {
    setItems((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  }

  async function commit(id: string, field: keyof BeverageItem, value: string | number) {
    updateLocal(id, field, value);
    const { error } = await supabase
      .from("plate_cost_beverage_items")
      .update({ [field]: value })
      .eq("id", id);
    if (error) toast.error("Couldn't save that change.");
  }

  async function addRow() {
    const { data, error } = await supabase
      .from("plate_cost_beverage_items")
      .insert({
        item: "",
        quantity: "",
        total_cost: 0,
        units: 0,
        sell_price: 0,
        trip: "",
        notes: "",
        sort_order: Date.now(),
      })
      .select()
      .single();
    if (error || !data) {
      toast.error("Couldn't add a new row.");
      return;
    }
    setItems((prev) => [...prev, data]);
  }

  async function removeRow(id: string) {
    setItems((prev) => prev.filter((row) => row.id !== id));
    const { error } = await supabase.from("plate_cost_beverage_items").delete().eq("id", id);
    if (error) {
      toast.error("Couldn't remove that row.");
      load();
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-12 text-base text-gray-700">
        <Loader2 className="size-4 animate-spin" /> Loading…
      </div>
    );
  }

  const grandTotal = items.reduce((sum, row) => sum + row.total_cost, 0);
  const totalProfit = items
    .filter((row) => row.sell_price > 0)
    .reduce((sum, row) => sum + beverageProfit(row), 0);
  const hasAnyProfitRow = items.some((row) => row.sell_price > 0);

  return (
    <div>
      <ShoppingTripsSection />

      <div className="mt-8 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-black">Beverage Items</h3>
        <Button
          variant="outline"
          size="sm"
          className="border-gray-400 bg-white text-base text-black hover:bg-gray-100"
          onClick={load}
        >
          <RefreshCw className="size-4" /> Refresh
        </Button>
      </div>

      <div className="mt-2 rounded-lg border border-gray-300">
        <Table className="text-base">
          <TableHeader>
            <TableRow className="border-gray-200 hover:bg-transparent">
              <TableHead className="min-w-[220px] text-base font-semibold text-black">
                Item
              </TableHead>
              <TableHead className="text-base font-semibold text-black">Trip</TableHead>
              <TableHead className="text-base font-semibold text-black">Quantity</TableHead>
              <TableHead className="text-base font-semibold text-black">Cost ($)</TableHead>
              <TableHead className="text-base font-semibold text-black">Units</TableHead>
              <TableHead className="text-base font-semibold text-black">
                Sell Price ($/unit)
              </TableHead>
              <TableHead className="text-base font-semibold text-black">Profit ($)</TableHead>
              <TableHead className="min-w-[220px] text-base font-semibold text-black">
                Notes
              </TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((row) => (
              <TableRow key={row.id} className="border-gray-200 hover:bg-gray-50">
                <TableCell>
                  <TextCell
                    value={row.item}
                    placeholder="Item name"
                    onCommit={(v) => commit(row.id, "item", v)}
                    className="h-10 min-w-[200px]"
                  />
                </TableCell>
                <TableCell>
                  <TextCell
                    value={row.trip}
                    placeholder="e.g. Trip 1"
                    onCommit={(v) => commit(row.id, "trip", v)}
                    className="h-10 w-24"
                  />
                </TableCell>
                <TableCell>
                  <TextCell
                    value={row.quantity}
                    placeholder="e.g. 10 cases"
                    onCommit={(v) => commit(row.id, "quantity", v)}
                    className="h-10 w-32"
                  />
                </TableCell>
                <TableCell>
                  <NumberCell
                    value={row.total_cost}
                    onCommit={(v) => commit(row.id, "total_cost", v)}
                  />
                </TableCell>
                <TableCell>
                  <NumberCell
                    value={row.units}
                    onCommit={(v) => commit(row.id, "units", v)}
                    step="1"
                  />
                </TableCell>
                <TableCell>
                  <NumberCell
                    value={row.sell_price}
                    onCommit={(v) => commit(row.id, "sell_price", v)}
                  />
                </TableCell>
                <TableCell className="font-medium text-black">
                  {row.sell_price > 0 ? money(beverageProfit(row)) : "—"}
                </TableCell>
                <TableCell>
                  <TextCell
                    value={row.notes}
                    placeholder="Brands, source, estimate needed…"
                    onCommit={(v) => commit(row.id, "notes", v)}
                    className="h-10 min-w-[200px]"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-100"
                    onClick={() => removeRow(row.id)}
                    aria-label="Remove row"
                  >
                    <Trash2 className="size-4 text-gray-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="mt-2 border-gray-400 bg-white text-base text-black hover:bg-gray-100"
        onClick={addRow}
      >
        <Plus className="size-4" /> Add item
      </Button>

      <Card className="mt-6 border-gray-300 bg-white text-black">
        <CardHeader>
          <CardTitle className="font-display text-black">Total Beverage Budget</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-base">
          <div className="flex justify-between border-t border-gray-300 pt-2 text-lg font-bold text-black">
            <span>Total cost</span>
            <span>{money(grandTotal)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-black">
            <span>Total profit (items with a sell price set)</span>
            <span>{hasAnyProfitRow ? money(totalProfit) : "—"}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function PlateCostPage() {
  const [tab, setTab] = useState<TabKey>(TABS[0].key);

  return (
    <div className="min-h-screen bg-white text-black [color-scheme:light]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-2xl font-bold text-black">
          Jerky Jerk × Charly Black Plate Cost Worksheet
        </h1>
        <p className="mt-1 text-base text-gray-700">
          Shared, live worksheet for pricing one plate each of Jerk Chicken, Curry Chicken,
          Escovitch Fish, and Mannish Water, plus the event's beverage budget. Add or remove rows as
          needed — everything calculates automatically as you fill in the editable fields. Changes
          save as soon as you leave a field, so anyone with this link (including Jerky Jerk) is
          editing the same live sheet.
        </p>

        <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)} className="mt-6">
          <TabsList className="flex-wrap bg-gray-100 text-gray-700">
            {TABS.map((t) => (
              <TabsTrigger
                key={t.key}
                value={t.key}
                className="text-base data-[state=active]:bg-white data-[state=active]:text-black"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {TABS.map((t) => (
            <TabsContent key={t.key} value={t.key}>
              {t.key === "beverages" ? <BeverageWorksheet /> : <DishWorksheet dishKey={t.key} />}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
