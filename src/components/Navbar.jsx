import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { UserCircle, LogOut } from "lucide-react";

export function Navbar() {
  const { user, role, logOut } = useAuth();
  const location = useLocation();

  const isCurrent = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl rounded-lg shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-0.5">
              T
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block text-foreground">
              Thriftyy
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/browse"
              className={`text-sm font-medium transition-all px-3 py-2 rounded-md ${isCurrent("/browse") ? "text-foreground bg-secondary/80 shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"}`}
            >
              Collection
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition-all px-3 py-2 rounded-md ${isCurrent("/dashboard") ? "text-foreground bg-secondary/80 shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"}`}
                >
                  Bookings
                </Link>
                {role === "admin" && (
                  <Link
                    to="/admin"
                    className={`text-sm font-medium transition-all px-3 py-2 rounded-md ${isCurrent("/admin") ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-sm" : "text-blue-600/70 hover:text-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/10"}`}
                  >
                    Admin Panel
                  </Link>
                )}
                <div className="h-4 w-px bg-border mx-2 hidden sm:block"></div>
                <div className="flex items-center gap-2 sm:gap-3 pl-2">
                  <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-secondary-foreground bg-secondary py-1.5 px-3 rounded-full shadow-sm border border-border/50">
                    <UserCircle className="w-4 h-4 opacity-70" />
                    <span className="max-w-[100px] truncate">{user.email}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={logOut}
                    title="Sign Out"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4 pl-4 border-l border-border/40">
                <Link
                  to="/signin"
                  className="inline-flex items-center justify-center whitespace-nowrap bg-primary text-primary-foreground h-10 rounded-full px-6 font-medium shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
