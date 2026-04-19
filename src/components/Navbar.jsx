import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { UserCircle, LogOut } from "lucide-react";

export function Navbar() {
  const { user, role, logOut } = useAuth();
  const location = useLocation();

  const isCurrent = (path) => location.pathname === path;

  return (
    <nav className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="glass rounded-[2rem] px-6 py-3 flex items-center gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] pointer-events-auto transition-all duration-500 hover:shadow-[0_30px_70px_rgba(0,0,0,0.4)] hover:bg-white/[0.05]">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-white text-black flex items-center justify-center font-black text-xl rounded-xl transition-all group-hover:scale-110 group-hover:rotate-3 shadow-xl">
            T
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:block">
            Thriftyy
          </span>
        </Link>

        <div className="h-6 w-px bg-white/10 hidden md:block"></div>

        <div className="flex items-center gap-1">
          <Link
            to="/browse"
            className={`text-sm font-semibold transition-all px-4 py-2 rounded-full ${isCurrent("/browse") ? "bg-white text-black shadow-lg" : "text-white/60 hover:text-white hover:bg-white/5"}`}
          >
            Collection
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`text-sm font-semibold transition-all px-4 py-2 rounded-full ${isCurrent("/dashboard") ? "bg-white text-black shadow-lg" : "text-white/60 hover:text-white hover:bg-white/5"}`}
              >
                Bookings
              </Link>
              {role === "admin" && (
                <Link
                  to="/admin"
                  className={`text-sm font-semibold transition-all px-4 py-2 rounded-full ${isCurrent("/admin") ? "bg-white text-black shadow-lg" : "text-white/30 hover:text-white hover:bg-white/5"}`}
                >
                  Admin
                </Link>
              )}
              <div className="flex items-center gap-2 pl-4 ml-2 border-l border-white/10">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logOut}
                  className="text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="pl-4 ml-2 border-l border-white/10">
              <Link
                to="/signin"
                className="text-sm font-bold bg-white text-black hover:bg-white/90 px-6 py-2 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 whitespace-nowrap block"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
