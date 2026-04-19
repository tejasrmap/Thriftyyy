import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { UserCircle, LogOut } from "lucide-react";

export function Navbar() {
  const { user, role, logOut } = useAuth();
  const location = useLocation();

  const isCurrent = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/[0.05]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group transition-all">
          <span className="font-serif text-3xl tracking-tight text-black group-hover:opacity-60 transition-opacity">
            Thriftyy
          </span>
        </Link>

        <div className="flex items-center gap-8">
          <Link
            to="/browse"
            className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all ${isCurrent("/browse") ? "text-black underline underline-offset-8" : "text-black/40 hover:text-black"}`}
          >
            Collection
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all ${isCurrent("/dashboard") ? "text-black underline underline-offset-8" : "text-black/40 hover:text-black"}`}
              >
                Archive
              </Link>
              {role === "admin" && (
                <Link
                  to="/admin"
                  className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all ${isCurrent("/admin") ? "text-black underline underline-offset-8" : "text-black/20 hover:text-black"}`}
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
            <div className="flex items-center gap-6 pl-8 ml-4 border-l border-black/5">
              <Link
                to="/signin"
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-[11px] font-bold uppercase tracking-[0.2em] bg-black text-white px-6 py-3 rounded-md hover:bg-zinc-800 transition-all shadow-sm"
              >
                Join
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
