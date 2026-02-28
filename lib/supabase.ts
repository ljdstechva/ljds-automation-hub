import "server-only";
import { createClient } from "@supabase/supabase-js";

const FALLBACK_SUPABASE_URL = "https://example.supabase.co";
const FALLBACK_SUPABASE_KEY = "public-anon-key";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && (supabaseAnonKey || supabaseServiceRoleKey));

function createSupabaseClient(key: string) {
  return createClient(supabaseUrl ?? FALLBACK_SUPABASE_URL, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Public client for server-side reads under anon/public RLS policies.
export const supabase = createSupabaseClient(supabaseAnonKey ?? supabaseServiceRoleKey ?? FALLBACK_SUPABASE_KEY);

// Server-side privileged client for admin mutations when configured.
export const supabaseAdmin = createSupabaseClient(supabaseServiceRoleKey ?? supabaseAnonKey ?? FALLBACK_SUPABASE_KEY);

export const isServiceRoleConfigured = Boolean(supabaseServiceRoleKey);
