import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  Zap,
  Layers,
  Settings,
  Bell,
  Search,
  Leaf,
  Sun,
  Wind
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function AdminLayout() {
  const { user, role, logOut, permissions } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Redirect if not authorized
  useEffect(() => {
    if (!user || (role !== "admin" && role !== "employee")) {
      navigate("/");
    }
  }, [user, role, navigate]);

  const menuItems = [
    { 
      name: "Studio Overview", 
      path: "/admin", 
      icon: Sun, 
      show: true 
    },
    { 
      name: "Archive Inventory", 
      path: "/admin/inventory", 
      icon: Layers, 
      show: role === "admin" || permissions?.canManageInventory 
    },
    { 
      name: "Order Manifest", 
      path: "/admin/orders", 
      icon: ShoppingBag, 
      show: role === "admin" || permissions?.canManageBookings 
    },
    { 
      name: "Personnel Nodes", 
      path: "/admin/employees", 
      icon: Users, 
      show: role === "admin" 
    },
  ];

  if (!user || (role !== "admin" && role !== "employee")) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row page-transition grain-texture">
      {/* Sidebar - Organic Earth */}
      <aside className="hidden lg:flex w-88 flex-col sticky top-0 h-screen p-10 z-30">
        <div className="organic-card h-full flex flex-col p-10 bg-white shadow-[10px_10px_0px_rgba(69,26,3,0.05)] border-earth-bark/5">
          <Link to="/" className="flex items-center gap-4 mb-20 group">
            <div className="w-14 h-14 bg-earth-clay text-earth-linen flex items-center justify-center rounded-2xl shadow-xl transition-transform group-hover:rotate-12">
               <span className="font-display font-black text-2xl">T</span>
            </div>
            <span className="font-display font-black text-2xl uppercase tracking-tighter text-earth-bark">Studio</span>
          </Link>

          <nav className="flex-1 space-y-4">
            {menuItems.filter(i => i.show).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-5 px-8 py-5 rounded-[1.5rem] text-[13px] font-black uppercase tracking-widest transition-all group",
                  location.pathname === item.path
                    ? "bg-earth-clay text-earth-linen shadow-2xl scale-105"
                    : "text-earth-bark/40 hover:text-earth-bark hover:bg-earth-linen/50"
                )}
              >
                <item.icon className={cn("w-5 h-5", location.pathname === item.path ? "text-earth-linen" : "text-earth-bark/20 group-hover:text-earth-clay transition-colors")} />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="pt-10 mt-10 border-t border-earth-bark/5 space-y-6">
             <div className="p-8 rounded-[2.5rem] bg-earth-linen/50 space-y-6 border border-earth-bark/5">
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 rounded-full bg-earth-sage text-earth-linen flex items-center justify-center font-display font-black text-xl shadow-lg border-4 border-white">
                      {user.fullName.charAt(0)}
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-black text-earth-bark uppercase truncate">{user.fullName}</p>
                      <p className="text-[9px] font-bold text-earth-bark/30 uppercase tracking-widest truncate">{role} Node</p>
                   </div>
                </div>
                <Button 
                  onClick={logOut}
                  variant="ghost" 
                  className="w-full h-14 rounded-2xl text-earth-clay hover:bg-earth-clay/5 font-black text-[10px] uppercase tracking-widest border border-earth-clay/10"
                >
                  <LogOut className="w-4 h-4 mr-3" /> Terminate Node
                </Button>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header - Organic Earth */}
        <header className="sticky top-0 z-20 px-10 pt-10 pb-6 pointer-events-none">
           <div className="max-w-6xl mx-auto organic-card h-24 flex items-center justify-between px-10 bg-white/80 backdrop-blur-xl border-earth-bark/5 pointer-events-auto shadow-[10px_10px_0px_rgba(69,26,3,0.03)]">
              <div className="flex items-center gap-10">
                 <div className="hidden sm:flex items-center gap-5 bg-earth-linen/50 px-8 py-3.5 rounded-[1.5rem] border border-earth-bark/5 group focus-within:bg-white focus-within:shadow-lg transition-all">
                    <Search className="w-5 h-5 text-earth-bark/20 group-focus-within:text-earth-clay" />
                    <input 
                       type="text" 
                       placeholder="Global Search..." 
                       className="bg-transparent border-none outline-none text-[11px] font-black uppercase tracking-widest text-earth-bark placeholder:text-earth-bark/10 w-48 md:w-80"
                    />
                 </div>
                 
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-earth-bark/20">Studio</span>
                    <ChevronRight className="w-4 h-4 text-earth-bark/10" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-earth-clay">
                       {menuItems.find(i => i.path === location.pathname)?.name || "Overview"}
                    </span>
                 </div>
              </div>

              <div className="flex items-center gap-5">
                 <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-earth-linen text-earth-bark/20 hover:text-earth-clay hover:bg-white hover:shadow-lg transition-all relative">
                    <Bell className="w-5 h-5" />
                    <div className="absolute top-3.5 right-3.5 w-2 h-2 bg-earth-clay rounded-full border-2 border-white" />
                 </button>
                 <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-earth-linen text-earth-bark/20 hover:text-earth-clay hover:bg-white hover:shadow-lg transition-all">
                    <Settings className="w-5 h-5" />
                 </button>
              </div>
           </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-10 lg:p-16">
           <div className="max-w-6xl mx-auto">
              <Outlet />
           </div>
        </main>
      </div>

      {/* Mobile Nav Toggle */}
      <div className="lg:hidden fixed bottom-10 right-10 z-50">
        <Button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-20 h-20 rounded-[2rem] bg-earth-clay text-earth-linen shadow-2xl"
        >
          {isMobileMenuOpen ? <X className="w-10 h-10" /> : <Menu className="w-10 h-10" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="lg:hidden fixed inset-0 z-40 bg-earth-linen/95 backdrop-blur-xl p-16 flex flex-col justify-center"
          >
             <nav className="space-y-8">
                {menuItems.filter(i => i.show).map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-8 p-8 rounded-[2.5rem] text-3xl font-black uppercase tracking-tighter transition-all shadow-sm",
                      location.pathname === item.path
                        ? "bg-earth-clay text-earth-linen"
                        : "text-earth-bark/40 bg-white"
                    )}
                  >
                    <item.icon className="w-10 h-10" />
                    {item.name}
                  </Link>
                ))}
                <div className="h-[1px] bg-earth-bark/10 my-12" />
                <Button 
                  onClick={() => { logOut(); setIsMobileMenuOpen(false); }}
                  variant="ghost" 
                  className="w-full justify-start h-24 rounded-[2.5rem] text-earth-clay font-black text-2xl uppercase tracking-tighter"
                >
                  <LogOut className="w-10 h-10 mr-8" /> Terminate Session
                </Button>
             </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
