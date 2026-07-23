// Backs /contract-admin. Reuses the same admin roster/RPC as the Charly
// Black comp-admin page (comp_admins / is_comp_admin()) rather than
// standing up a separate contract-admin roster -- it's the same small team
// reviewing both, and this keeps a "simple" admin page simple.
//
// talent_contracts and the private talent-contracts storage bucket are
// both locked down by RLS with no policy granting client-side reads (even
// to authenticated users) -- this function is the only way to list signed
// contracts or get a download link for one, using the service-role key to
// bypass RLS after checking the caller's own session against
// is_comp_admin() first (see admin-create-person for the same pattern).
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };

const SIGNED_URL_TTL_SECONDS = 60 * 60;

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

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ ok: false, error: "Missing Authorization header" }), {
      status: 401,
      headers: jsonHeaders,
    });
  }

  // Check the caller is actually a comp admin using THEIR OWN session --
  // this is what makes it safe to then use the service-role client below.
  const callerClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: isAdmin, error: rpcError } = await callerClient.rpc("is_comp_admin");
  if (rpcError || !isAdmin) {
    return new Response(JSON.stringify({ ok: false, error: "Not authorized" }), {
      status: 403,
      headers: jsonHeaders,
    });
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const { data: contracts, error } = await admin
    .from("talent_contracts")
    .select("*")
    .order("signed_at", { ascending: false });

  if (error) {
    console.error("talent_contracts select failed:", error);
    return new Response(JSON.stringify({ ok: false, error: "Couldn't load contracts." }), {
      status: 500,
      headers: jsonHeaders,
    });
  }

  const withUrls = await Promise.all(
    (contracts ?? []).map(async (c) => {
      if (!c.pdf_storage_path) return { ...c, pdf_url: null };
      const { data: signed } = await admin.storage
        .from("talent-contracts")
        .createSignedUrl(c.pdf_storage_path, SIGNED_URL_TTL_SECONDS);
      return { ...c, pdf_url: signed?.signedUrl ?? null };
    }),
  );

  return new Response(JSON.stringify({ ok: true, contracts: withUrls }), {
    status: 200,
    headers: jsonHeaders,
  });
});
