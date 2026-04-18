import { Outlet, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Shield } from "lucide-react";
import { Button } from "./ui/button";

export function AdminLayout() {
  const { user, role, loading, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate("/admin/login");
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0A0A0A]" />;
  }

  // Strict check: Only fully authorized admins can view the outlet contents
  if (role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] text-[#0A0A0A] font-sans tracking-tight">
      {/* Exclusive Admin Header */}
      <header className="bg-[#0A0A0A] text-[#FAFAFA] h-16 flex items-center px-6 justify-between sticky top-0 z-50 border-b border-white/10 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">LuxeRent Control Center</span>
          <span className="px-2 py-0.5 ml-2 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest border border-red-500/30">
            Internal Use Only
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-sm font-medium text-gray-400 flex flex-col text-right">
            <span>{user.displayName}</span>
            <span className="text-xs text-gray-500">{user.email}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content Area - Unstyled so Admin.jsx handles the max-width */}
      <main className="flex-1 w-full relative">
        <Outlet />
      </main>
    </div>
  );
}
