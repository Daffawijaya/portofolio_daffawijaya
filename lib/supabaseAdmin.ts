import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// SERVER ONLY: uses the service role key (bypasses RLS). Never import from client code.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin: SupabaseClient | null =
  url && serviceKey ? createClient(url, serviceKey) : null;
