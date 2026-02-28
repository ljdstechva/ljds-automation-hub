import { Suspense } from "react";
import { connection } from "next/server";
import { getPortfolioDataUncached } from "@/lib/portfolio-data";
import { requireAdminUserForPage } from "@/lib/admin-auth";
import AdminPanel from "@/components/admin-panel";

async function AdminData() {
  await requireAdminUserForPage();
  await connection();
  const data = await getPortfolioDataUncached();
  return <AdminPanel initialData={data} />;
}

export default function AdminPage() {
  return (
    <Suspense fallback={<p className="admin-loading">Loading admin data...</p>}>
      <AdminData />
    </Suspense>
  );
}
