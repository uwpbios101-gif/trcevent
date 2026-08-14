// Data layer for the Dancehall 101 pages (see src/routes/-dancehall-101*.tsx),
// migrated from selassiefest.com/dancehall101/assets/dancehall101-client.js.
// Talks to the dh101_* tables/RPCs on the shared Supabase project (see
// src/lib/supabase.ts) -- same backend, no schema changes, just a new
// frontend. Those tables carry their own RLS independent of every other
// table on the project; see supabase/schema.sql in the selassiefest repo for
// the authoritative source.
import { supabase } from "@/lib/supabase";

export type Dh101School = {
  id: string;
  slug: string;
  name: string;
  short_code: string;
  logo_url: string | null;
  logo_bg: "light" | "dark";
  mascot: string | null;
  color_primary: string;
  color_secondary: string;
  default_campaign_code: string | null;
};

export type Dh101Ticket = {
  status: "ok" | "not_found" | "expired";
  ticket_id: string | null;
  redemption_code: string | null;
  full_name: string | null;
  school_slug: string | null;
  school_name: string | null;
  school_logo_url: string | null;
  school_logo_bg: string | null;
  school_mascot: string | null;
  color_primary: string | null;
  color_secondary: string | null;
  campaign_code: string | null;
  student_segment: string | null;
  verified_at: string | null;
};

export type Dh101LeaderboardRow = {
  ambassador_id: string;
  code: string;
  display_name: string;
  school_id: string;
  school_slug: string;
  school_name: string;
  signup_count: number;
};

export type Dh101CheckInResult = {
  status: "checked_in" | "already_checked_in" | "not_verified" | "not_found";
  ticket_id: string | null;
  full_name: string | null;
  school_name: string | null;
  checked_in_at: string | null;
};

export type Dh101DoorRow = {
  id: string;
  ticket_id: string | null;
  redemption_code: string | null;
  full_name: string;
  school_name: string;
  is_verified: boolean;
  checked_in: boolean;
};

const SCHOOL_COLUMNS =
  "id, slug, name, short_code, logo_url, logo_bg, mascot, color_primary, color_secondary, default_campaign_code";

export async function fetchActiveSchools(): Promise<Dh101School[]> {
  const { data, error } = await supabase
    .from("dh101_schools")
    .select(SCHOOL_COLUMNS)
    .order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchSchoolBySlug(slug: string): Promise<Dh101School | null> {
  const { data, error } = await supabase
    .from("dh101_schools")
    .select(SCHOOL_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Honeypot: if the hidden field got filled in (a bot did it, no human sees
// it), silently pretend success without ever hitting the network -- cheap,
// zero-cost bot filter, no server round trip needed.
export async function submitDh101Signup(input: {
  school: Dh101School;
  fullName: string;
  eduEmail: string;
  dob: string;
  studentSegment: string;
  referralCode: string | null;
  honeypot: string;
}): Promise<{ skipped: boolean }> {
  if (input.honeypot) return { skipped: true };
  const { error } = await supabase.from("dh101_signups").insert({
    school_id: input.school.id,
    full_name: input.fullName,
    edu_email: input.eduEmail,
    dob: input.dob,
    student_segment: input.studentSegment,
    referral_code: input.referralCode || null,
    campaign_code: input.school.default_campaign_code || null,
  });
  if (error) throw error;
  return { skipped: false };
}

export async function verifyDh101Ticket(token: string): Promise<Dh101Ticket | null> {
  const { data, error } = await supabase.rpc("dh101_verify_and_get_ticket", { p_token: token });
  if (error) throw error;
  return data?.[0] ?? null;
}

export async function fetchDh101Leaderboard(): Promise<Dh101LeaderboardRow[]> {
  const { data, error } = await supabase
    .from("dh101_ambassador_leaderboard")
    .select("*")
    .order("signup_count", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchDh101CheckedInCount(): Promise<number> {
  const { count, error } = await supabase
    .from("dh101_door_checkin")
    .select("id", { count: "exact", head: true })
    .eq("checked_in", true);
  if (error) throw error;
  return count ?? 0;
}

export async function checkInDh101Ticket(code: string): Promise<Dh101CheckInResult | null> {
  const { data, error } = await supabase.rpc("dh101_check_in_ticket", { p_code: code });
  if (error) throw error;
  return data?.[0] ?? null;
}

export async function searchDh101ByName(query: string): Promise<Dh101DoorRow[]> {
  const { data, error } = await supabase
    .from("dh101_door_checkin")
    .select("id, ticket_id, redemption_code, full_name, school_name, is_verified, checked_in")
    .ilike("full_name", `%${query}%`)
    .limit(10);
  if (error) throw error;
  return data ?? [];
}

// Real cleared logo -> caller renders an <img>. No cleared logo -> caller
// falls back to a styled text wordmark using the school's own short
// code/initials -- see dh101_schools.logo_url comment in schema.sql for why
// most schools don't have a cleared image yet.
export function dh101Initials(school: Pick<Dh101School, "short_code" | "name">) {
  return (school.short_code || school.name.slice(0, 3)).slice(0, 6);
}
