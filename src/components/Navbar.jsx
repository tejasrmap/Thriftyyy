import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { UserCircle, LogOut } from "lucide-react";
import { motion } from "motion/react";

export function Navbar() {
  const { user, role, logOut } = useAuth();
  const location = useLocation();

  const isCurrent = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/[0.05]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group transition-all">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: -5 }}
            className="w-9 h-9 bg-black text-white flex items-center justify-center font-extrabold text-xl rounded-xl"
          >
            T
          </motion.div>
          <motion.span 
            whileHover={{ letterSpacing: "0.05em" }}
            className="font-display font-extrabold text-2xl tracking-architectural text-black uppercase transition-all"
          >
            Thriftyy
          </motion.span>
        </Link>
        <div className="flex items-center gap-10">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/browse"
              className="px-6 py-2.5 rounded-full border border-black/10 text-xs font-extrabold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all shadow-sm"
            >
              Collection
            </Link>
          </motion.div>
        </div>

        <div className="flex items-center gap-8">
          {user ? (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/dashboard"
                  className={`text-xs font-extrabold uppercase tracking-widest transition-all ${isCurrent("/dashboard") ? "text-black border-b-2 border-black pb-1" : "text-black/40 hover:text-black"}`}
                >
                  Archive
                </Link>
              </motion.div>
              {role === "admin" && (
                <Link
                  to="/admin"
                  className={`text-xs font-bold uppercase tracking-widest transition-all ${isCurrent("/admin") ? "text-black border-b-2 border-black pb-1" : "text-black/20 hover:text-black"}`}
                >
                  Admin
                </Link>
              )}
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-black/10">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logOut}
                  className="w-8 h-8 text-black/20 hover:text-black hover:bg-black/5 rounded-full transition-all"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-6 pl-8 ml-4 border-l border-black/10">
              <Link
                to="/signin"
                className="text-xs font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-xs font-bold uppercase tracking-widest bg-black text-white px-7 py-3 rounded-full hover:bg-zinc-800 transition-all shadow-sm"
              >
                Join Circle
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
