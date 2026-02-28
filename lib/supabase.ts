import "server-only";
import { createClient } from "@supabase/supabase-js";

function requireEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing ${name}.`);
  }

  return value;
}

const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseAnonKey && !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase key. Set NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY.");
}

function createSupabaseClient(key: string) {
  return createClient(supabaseUrl, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Public client for server-side reads under anon/public RLS policies.
export const supabase = createSupabaseClient(supabaseAnonKey ?? supabaseServiceRoleKey!);

// Server-side privileged client for admin mutations when configured.
export const supabaseAdmin = createSupabaseClient(supabaseServiceRoleKey ?? supabaseAnonKey!);

export const isServiceRoleConfigured = Boolean(supabaseServiceRoleKey);
