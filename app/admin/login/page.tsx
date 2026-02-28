import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { AdminLoginForm } from "@/components/admin-login-form";
import { getAdminAuthContext } from "@/lib/admin-auth";

function sanitizeNext(nextPath: string | undefined) {
  if (!nextPath || !nextPath.startsWith("/admin")) {
    return "/admin";
  }

  return nextPath;
}

async function AdminLoginContent({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  await connection();
  const [params, auth] = await Promise.all([searchParams, getAdminAuthContext()]);

  if (auth) {
    redirect("/admin");
  }

  return (
    <section className="admin-login-shell">
      <AdminLoginForm nextPath={sanitizeNext(params.next)} />
    </section>
  );
}

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  return (
    <Suspense fallback={<p className="admin-loading">Loading login...</p>}>
      <AdminLoginContent searchParams={searchParams} />
    </Suspense>
  );
}
