// Called from the Sing Ova Sundays page after the user types in the code
// emailed to them by request-sos-code. On success, marks the email as
// verified -- which is what sos_email_is_verified() (used by sos_pairings'
// and sos_pairing_hearts' INSERT/DELETE policies) checks before allowing
// writes.
//
// Deliberate difference from verify-comp-code: this feature needs people to
// stay "logged in" across a whole week of returning to chat about pairings,
// not just verify-then-immediately-submit-once. So on a successful check,
// expires_at is pushed out to a 30-day session instead of being left at the
// code's original short TTL -- sos_email_is_verified() still just checks
// "verified = true and expires_at > now()", same shape as every other
// feature's checker function.
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const MAX_ATTEMPTS = 8;
const SESSION_DAYS = 30;

// See request-sos-code for why these are required on every response.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const { email, code, displayName } = await req.json();
  if (!email || !code) {
    return new Response(JSON.stringify({ valid: false, error: "Missing email or code" }), { status: 400, headers: jsonHeaders });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const normalizedEmail = email.trim().toLowerCase();

  const { data: row, error } = await supabase
    .from("sos_verifications")
    .select("*")
    .eq("email", normalizedEmail)
    .single();

  if (error || !row) {
    return new Response(JSON.stringify({ valid: false, error: "No code on file for this email -- request a new one" }), { status: 200, headers: jsonHeaders });
  }

  if (row.attempts >= MAX_ATTEMPTS) {
    return new Response(JSON.stringify({ valid: false, error: "Too many attempts -- request a new code" }), { status: 200, headers: jsonHeaders });
  }

  if (new Date(row.expires_at) < new Date()) {
    return new Response(JSON.stringify({ valid: false, error: "That code expired -- request a new one" }), { status: 200, headers: jsonHeaders });
  }

  const codeHash = await sha256(String(code).trim());

  if (codeHash !== row.code_hash) {
    await supabase.from("sos_verifications").update({ attempts: row.attempts + 1 }).eq("email", normalizedEmail);
    return new Response(JSON.stringify({ valid: false, error: "That code doesn't match" }), { status: 200, headers: jsonHeaders });
  }

  const sessionExpiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  await supabase
    .from("sos_verifications")
    .update({ verified: true, expires_at: sessionExpiresAt })
    .eq("email", normalizedEmail);

  if (displayName && typeof displayName === "string" && displayName.trim()) {
    await supabase
      .from("sos_members")
      .upsert(
        { email: normalizedEmail, display_name: displayName.trim().slice(0, 60) },
        { onConflict: "email" },
      );
  }

  return new Response(JSON.stringify({ valid: true }), { status: 200, headers: jsonHeaders });
});
