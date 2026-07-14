import { createClient } from "@supabase/supabase-js";

// Shared Supabase project across trcevent.com and selassiefest.com — see
// supabase/schema.sql in the selassiefest repo for the tables this talks to.
// The anon/publishable key is meant to be public: it only grants what the
// Row Level Security policies allow (insert-only on event_notify_signups,
// no read-back).
const SUPABASE_URL = "https://xdjbgcqaynnzykrglgnf.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_1B4Musk5YF23XHb_BEOiTA_w1DGM5P4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
