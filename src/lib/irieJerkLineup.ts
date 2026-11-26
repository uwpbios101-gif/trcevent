// Data layer for Irie Jerk's weekly day+night activity lineup -- see
// supabase/sql/irie_jerk_weekly_lineup_schema.sql for the table and its
// source (the "Weekly Master (14 Activities)" tab). Read-only from the site;
// edits happen via SQL against irie_jerk_weekly_lineup directly.
import { supabase } from "@/lib/supabase";

export type IrieJerkLineupRow = {
  slug: string;
  day_of_week: string;
  day_index: number;
  phase: "day" | "night";
  slot_order: number;
  name: string;
  time_window: string | null;
  description: string | null;
  signature_plate: string | null;
  signature_drinks: string | null;
  cover_charge: number | null;
  alcohol_free: boolean;
  is_flagship: boolean;
  is_monthly_special: boolean;
  is_21_plus: boolean;
  replaces_slug: string | null;
  detail_path: string | null;
};

// Retired from the lineup (Karaoke Thursdays is gone; Thursdays are Irie Jerk & Juggling).
const REMOVED_SLUGS = ["karaoke-thursdays", "karaoke-after-dark"];

const LINEUP_COLUMNS =
  "slug, day_of_week, day_index, phase, slot_order, name, time_window, description, signature_plate, signature_drinks, cover_charge, alcohol_free, is_flagship, is_monthly_special, is_21_plus, replaces_slug, detail_path";

export async function fetchIrieJerkLineup(): Promise<IrieJerkLineupRow[]> {
  const { data, error } = await supabase
    .from("irie_jerk_weekly_lineup")
    .select(LINEUP_COLUMNS)
    .order("slot_order", { ascending: true })
    .order("is_monthly_special", { ascending: true });
  if (error) throw error;
  return (data ?? []).filter((r) => !REMOVED_SLUGS.includes(r.slug));
}

export async function fetchIrieJerkActivityBySlug(
  slug: string,
): Promise<IrieJerkLineupRow | null> {
  const { data, error } = await supabase
    .from("irie_jerk_weekly_lineup")
    .select(LINEUP_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data && !REMOVED_SLUGS.includes(data.slug) ? data : null;
}

export function irieJerkDetailHref(row: Pick<IrieJerkLineupRow, "slug" | "detail_path">) {
  return row.detail_path || `/irie-jerk/${row.slug}`;
}
