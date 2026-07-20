// Updates a single field on one schedule_acts row (see migration 0015;
// phone/email added 2026-07-20). Gated by the same shared
// PRODUCTION_SCHEDULE_PASSWORD as update-production-schedule -- one team
// password, not per-member accounts. field is allowlisted rather than
// trusting an arbitrary column name from the client, and validated against
// the type the client is expected to send for it (checkbox fields are
// booleans, contact fields are free-text strings).
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const PRODUCTION_SCHEDULE_PASSWORD = Deno.env.get(
  "PRODUCTION_SCHEDULE_PASSWORD",
);

const BOOLEAN_FIELDS = [
  "online_promo",
  "social_media_received",
  "contract_signed",
  "tickets_ordered",
];
const TEXT_FIELDS = ["phone", "email"];
const EDITABLE_FIELDS = [...BOOLEAN_FIELDS, ...TEXT_FIELDS];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  const { password, id, field, value } = await req.json();

  if (password !== PRODUCTION_SCHEDULE_PASSWORD) {
    return new Response(JSON.stringify({ error: "Wrong password." }), {
      status: 200,
      headers: jsonHeaders,
    });
  }
  if (!id || !EDITABLE_FIELDS.includes(field)) {
    return new Response(JSON.stringify({ error: "Invalid request." }), {
      status: 400,
      headers: jsonHeaders,
    });
  }
  if (BOOLEAN_FIELDS.includes(field) && typeof value !== "boolean") {
    return new Response(JSON.stringify({ error: "Invalid request." }), {
      status: 400,
      headers: jsonHeaders,
    });
  }
  if (TEXT_FIELDS.includes(field) && typeof value !== "string") {
    return new Response(JSON.stringify({ error: "Invalid request." }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  const normalizedValue = TEXT_FIELDS.includes(field)
    ? value.trim() || null
    : value;

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const { data, error } = await supabase
    .from("schedule_acts")
    .update({ [field]: normalizedValue, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    console.error("schedule_acts update failed:", error);
    return new Response(
      JSON.stringify({ error: "Couldn't save. Try again." }),
      { status: 500, headers: jsonHeaders },
    );
  }

  return new Response(JSON.stringify({ ok: true, act: data }), {
    status: 200,
    headers: jsonHeaders,
  });
});
