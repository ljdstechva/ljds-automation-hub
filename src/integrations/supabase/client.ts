import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables");
}

const isPlaceholder = (val: string | undefined) => !val || val.includes("your_project_url") || val.includes("your_anon_key") || val === "https://placeholder.supabase.co" || val === "placeholder";
export const isSupabaseConfigured = !isPlaceholder(supabaseUrl) && !isPlaceholder(supabaseAnonKey);

export const supabase = createClient(
    isSupabaseConfigured ? supabaseUrl! : 'https://placeholder.supabase.co',
    isSupabaseConfigured ? supabaseAnonKey! : 'placeholder'
);
