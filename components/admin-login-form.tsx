"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/lib/admin-auth-actions";

export function AdminLoginForm({ nextPath }: { nextPath: string }) {
  const [state, formAction, isPending] = useActionState(loginAdmin, { error: null });

  return (
    <form action={formAction} className="admin-login-card">
      <h1>Admin Login</h1>
      <p>Sign in with your Supabase Auth credentials.</p>

      <input type="hidden" name="next" value={nextPath} />

      <div className="form-group">
        <label htmlFor="admin-email">Email</label>
        <input id="admin-email" name="email" type="email" required autoComplete="email" />
      </div>

      <div className="form-group">
        <label htmlFor="admin-password">Password</label>
        <input id="admin-password" name="password" type="password" required autoComplete="current-password" />
      </div>

      {state.error && <p className="admin-error">{state.error}</p>}

      <button type="submit" className="admin-button" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
