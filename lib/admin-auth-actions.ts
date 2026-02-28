"use server";

import { redirect } from "next/navigation";
import {
  clearAdminSessionCookies,
  sanitizeAdminNextPath,
  setAdminSessionCookies,
  signInAdminWithPassword,
} from "./admin-auth";

export async function loginAdmin(
  _prevState: { error: string | null },
  formData: FormData,
): Promise<{ error: string | null }> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = sanitizeAdminNextPath(String(formData.get("next") ?? "/admin"));

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const { data, error } = await signInAdminWithPassword(email, password);

  if (error || !data.session) {
    return { error: "Invalid email or password." };
  }

  await setAdminSessionCookies(data.session);
  redirect(nextPath);
}

export async function logoutAdmin() {
  await clearAdminSessionCookies();
  redirect("/admin/login");
}
