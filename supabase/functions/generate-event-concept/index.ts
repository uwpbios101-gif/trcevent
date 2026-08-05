// Called from the Jerky Jerk event-brainstorm tools (Karaoke Thursdays /
// Mingles Tuesdays / Just Laugh Wednesday) once Marlon is done talking
// through an idea. Sends the raw transcript to Claude and returns a
// fleshed-out event concept -- no DB access needed here, the client saves
// the result itself.
const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

// Called cross-origin (trcevent.com -> supabase.co) from a browser, so the
// browser sends a CORS preflight OPTIONS request first -- without these
// headers on every response (including OPTIONS), the browser silently
// blocks the whole request before it reaches this code at all.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };

const JERKY_JERK_CONTEXT = `You are helping Marlon, owner of Jerky Jerk -- a real Caribbean/Jamaican
restaurant with two Chicago locations (7300 N Western Ave in West Rogers Park, and 2253 W Taylor St
in Tri-Taylor), known for charcoal-grilled jerk chicken and other dishes made from scratch daily,
with halal, vegetarian, and vegan options. He is developing new weekly events at Jerky Jerk that are
strictly day/evening and do NOT include alcohol.

You will be given a raw, possibly rambling, spoken brainstorm transcript for one specific event.
Turn it into a polished, concrete event concept designed to build the Jerky Jerk brand and drive a
real recurring crowd and business to the restaurant. Keep everything he actually said -- don't
invent a different event -- but sharpen it into something executable.

Structure your response with these sections:
1. **Hook / Tagline** -- one punchy line that sells the event in a sentence.
2. **Format & Run of Show** -- how the night/day actually flows, start to finish.
3. **Community & Hype Mechanics** -- what makes people want to come back weekly and bring friends
   (contests, prizes, social sharing, regulars culture, etc.).
4. **Why It Drives Business to Jerky Jerk** -- concretely how this turns into food/drink sales and
   repeat foot traffic, not alcohol sales.
5. **First 3 Steps** -- the most practical next actions to actually launch it.

Keep it grounded in what's realistic for a real restaurant to run weekly, not a hypothetical
big-budget production.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const { eventName, transcript } = await req.json();
  if (!eventName || typeof eventName !== "string") {
    return new Response(JSON.stringify({ error: "Missing eventName" }), {
      status: 400,
      headers: jsonHeaders,
    });
  }
  if (!transcript || typeof transcript !== "string" || !transcript.trim()) {
    return new Response(JSON.stringify({ error: "Missing transcript" }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-opus-5",
      max_tokens: 4096,
      system: `${JERKY_JERK_CONTEXT}\n\nThe event you're building a concept for is called "${eventName}".`,
      messages: [{ role: "user", content: transcript }],
    }),
  });

  if (!anthropicRes.ok) {
    const text = await anthropicRes.text();
    return new Response(JSON.stringify({ error: `Anthropic error: ${text}` }), {
      status: 502,
      headers: jsonHeaders,
    });
  }

  const anthropicBody = await anthropicRes.json();
  const concept = anthropicBody.content?.[0]?.text;
  if (!concept) {
    return new Response(JSON.stringify({ error: "Anthropic returned no content" }), {
      status: 502,
      headers: jsonHeaders,
    });
  }

  return new Response(JSON.stringify({ concept }), { status: 200, headers: jsonHeaders });
});
