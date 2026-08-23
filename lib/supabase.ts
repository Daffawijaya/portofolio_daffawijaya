import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// null when env vars are missing -> site falls back to static data files
export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key) : null;
