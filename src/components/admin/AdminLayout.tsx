
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/components/admin/AuthProvider";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminLayout = () => {
    const { session, loading, signOut } = useAuth();
    const navigate = useNavigate();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!session) {
        return <Navigate to="/admin/login" replace />;
    }

    const handleSignOut = async () => {
        await signOut();
        navigate("/admin/login");
    };

    return (
        <div className="min-h-screen bg-muted/10">
            {/* Admin Header */}
            <header className="bg-background border-b border-border sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl text-primary">
                        <LayoutDashboard className="h-6 w-6" />
                        <span>Admin Dashboard</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground hidden sm:inline">
                            {session.user.email}
                        </span>
                        <Button variant="outline" size="sm" onClick={handleSignOut}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
