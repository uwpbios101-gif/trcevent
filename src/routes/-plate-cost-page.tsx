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

const DISHES: Array<{ key: DishKey; label: string }> = [
  { key: "jerk_chicken", label: "Jerk Chicken" },
  { key: "curry_chicken", label: "Curry Chicken" },
  { key: "escovitch_fish", label: "Escovitch Fish" },
  { key: "mannish_water", label: "Mannish Water" },
];

const CATEGORIES: Category[] = ["Recipe", "Service", "Energy"];

function toNum(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

function money(n: number) {
  return `$${(Number.isFinite(n) ? n : 0).toFixed(2)}`;
}

function costPerUnit(ing: Ingredient) {
  return ing.units_per_case > 0 ? ing.case_cost / ing.units_per_case : 0;
}

function extendedCost(ing: Ingredient) {
  return ing.qty_used_per_plate * costPerUnit(ing);
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
      className="h-8 w-24"
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
      className={className ?? "h-8"}
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
        <h3 className="font-display text-lg font-bold">{category}</h3>
        <span className="text-sm text-muted-foreground">
          {category} subtotal: <strong className="text-foreground">{money(subtotal)}</strong>
        </span>
      </div>
      <div className="mt-2 rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[220px]">Item</TableHead>
              <TableHead>Case Cost ($)</TableHead>
              <TableHead>Units / Case</TableHead>
              <TableHead>Portion Unit</TableHead>
              <TableHead>Cost / Portion Unit ($)</TableHead>
              <TableHead>Qty Used / Plate</TableHead>
              <TableHead>Extended Cost ($)</TableHead>
              <TableHead className="min-w-[200px]">Notes / Source</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <TextCell
                    value={row.item}
                    placeholder="Ingredient or item name"
                    onCommit={(v) => onUpdate(row.id, "item", v)}
                    className="h-8 min-w-[200px]"
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
                    className="h-8 w-28"
                  />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {money(costPerUnit(row))}
                </TableCell>
                <TableCell>
                  <NumberCell
                    value={row.qty_used_per_plate}
                    onCommit={(v) => onUpdate(row.id, "qty_used_per_plate", v)}
                  />
                </TableCell>
                <TableCell className="font-medium">{money(extendedCost(row))}</TableCell>
                <TableCell>
                  <TextCell
                    value={row.notes}
                    placeholder="Supplier, case size, allocation…"
                    onCommit={(v) => onUpdate(row.id, "notes", v)}
                    className="h-8 min-w-[180px]"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(row.id)}
                    aria-label="Remove row"
                  >
                    <Trash2 className="size-4 text-muted-foreground" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button variant="outline" size="sm" className="mt-2" onClick={() => onAdd(category)}>
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
      <div className="flex items-center gap-2 py-12 text-sm text-muted-foreground">
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
        <Button variant="outline" size="sm" onClick={load}>
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

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="font-display">Total Cost Per Plate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          {CATEGORIES.map((category) => (
            <div key={category} className="flex justify-between text-muted-foreground">
              <span>{category} subtotal</span>
              <span>{money(subtotals[category])}</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between border-t border-border pt-2 text-base font-bold">
            <span>Total cost per plate (all-in)</span>
            <span className="text-gold">{money(total)}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="font-display">Menu Pricing Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span>Target food cost % (industry norm 28–35%)</span>
            <Input
              type="number"
              step="1"
              className="h-8 w-24"
              value={Math.round(targetPct * 100)}
              onChange={(e) =>
                updateSettingsLocal("target_food_cost_pct", toNum(e.target.value) / 100)
              }
              onBlur={() => commitSettings("target_food_cost_pct", targetPct)}
            />
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Suggested menu price at target food cost %</span>
            <span>{money(suggestedPrice)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>Actual menu price you plan to charge</span>
            <Input
              type="number"
              step="0.01"
              className="h-8 w-24"
              value={actualPrice}
              onChange={(e) => updateSettingsLocal("actual_menu_price", toNum(e.target.value))}
              onBlur={() => commitSettings("actual_menu_price", actualPrice)}
            />
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Resulting food cost % at that price</span>
            <span>{actualPrice > 0 ? `${(resultingPct * 100).toFixed(1)}%` : "—"}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Gross profit per plate at that price</span>
            <span>{actualPrice > 0 ? money(grossProfit) : "—"}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function PlateCostPage() {
  const [dish, setDish] = useState<DishKey>(DISHES[0].key);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-2xl font-bold">
        Jerky Jerk × Charly Black Plate Cost Worksheet
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Shared, live worksheet for pricing one plate each of Jerk Chicken, Curry Chicken, Escovitch
        Fish, and Mannish Water. Add or remove ingredient rows as needed — case cost, units per
        case, and quantity used per plate are the only fields to fill in; everything else calculates
        automatically. Changes save as soon as you leave a field, so anyone with this link
        (including Jerky Jerk) is editing the same live sheet.
      </p>

      <Tabs value={dish} onValueChange={(v) => setDish(v as DishKey)} className="mt-6">
        <TabsList className="flex-wrap">
          {DISHES.map((d) => (
            <TabsTrigger key={d.key} value={d.key}>
              {d.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {DISHES.map((d) => (
          <TabsContent key={d.key} value={d.key}>
            <DishWorksheet dishKey={d.key} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
