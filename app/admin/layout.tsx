import Link from "next/link";
import "./admin.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-header__actions">
          <Link href="/" className="admin-button secondary">Back to Portfolio</Link>
          <Link href="/admin/login" className="admin-button secondary">Login</Link>
        </div>
      </header>
      {children}
    </div>
  );
}
