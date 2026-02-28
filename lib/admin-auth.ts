import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient, type Session } from "@supabase/supabase-js";

const ADMIN_ACCESS_COOKIE = "ljds_admin_access_token";
const ADMIN_REFRESH_COOKIE = "ljds_admin_refresh_token";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

export const isAdminAuthConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const isProduction = process.env.NODE_ENV === "production";

function getAdminAuthConfig(): { supabaseUrl: string; supabaseAnonKey: string } {
  const resolvedUrl = supabaseUrl;
  const resolvedAnonKey = supabaseAnonKey;

  if (!resolvedUrl || !resolvedAnonKey) {
    throw new Error(
      "Admin authentication is unavailable. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return {
    supabaseUrl: resolvedUrl,
    supabaseAnonKey: resolvedAnonKey,
  };
}

function createAuthClient() {
  const config = getAdminAuthConfig();

  return createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function sanitizeAdminNextPath(nextPath: string | null) {
  if (!nextPath || !nextPath.startsWith("/admin")) {
    return "/admin";
  }

  return nextPath;
}

export async function setAdminSessionCookies(session: Session) {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_ACCESS_COOKIE, session.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: session.expires_in,
  });

  cookieStore.set(ADMIN_REFRESH_COOKIE, session.refresh_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearAdminSessionCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_ACCESS_COOKIE);
  cookieStore.delete(ADMIN_REFRESH_COOKIE);
}

export type AdminAuthContext = {
  userId: string;
  email: string | null;
  accessToken: string;
};

export async function getAdminAuthContext(): Promise<AdminAuthContext | null> {
  if (!isAdminAuthConfigured) {
    return null;
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ADMIN_ACCESS_COOKIE)?.value;

  if (!accessToken) {
    return null;
  }

  const supabase = createAuthClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(accessToken);

  if (error || !user) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email ?? null,
    accessToken,
  };
}

export async function requireAdminUserForPage() {
  const context = await getAdminAuthContext();

  if (!context) {
    redirect("/admin/login");
  }

  return context;
}

export async function requireAdminUserForAction() {
  const context = await getAdminAuthContext();

  if (!context) {
    throw new Error("Unauthorized. Please sign in to access admin actions.");
  }

  return context;
}

export function createAuthenticatedSupabase(accessToken: string) {
  const config = getAdminAuthConfig();

  return createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

export async function signInAdminWithPassword(email: string, password: string) {
  const supabase = createAuthClient();
  return supabase.auth.signInWithPassword({ email, password });
}
