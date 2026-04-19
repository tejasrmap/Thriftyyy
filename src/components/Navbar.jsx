import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { UserCircle, LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { user, role, logOut } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isCurrent = (path) => location.pathname === path;

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Collection", path: "/browse", public: true },
    { name: "Archive", path: "/dashboard", private: true },
    { name: "Admin", path: "/admin", adminOnly: true },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/[0.05]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group transition-all z-50" onClick={() => setIsOpen(false)}>
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

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/browse"
              className="px-6 py-2.5 rounded-full border border-black/10 text-xs font-extrabold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all shadow-sm"
            >
              Collection
            </Link>
          </motion.div>

          {user && (
            <div className="flex items-center gap-8 pl-8 border-l border-black/10">
              <Link
                to="/dashboard"
                className={`text-xs font-extrabold uppercase tracking-widest transition-all ${isCurrent("/dashboard") ? "text-black border-b-2 border-black pb-1" : "text-black/40 hover:text-black"}`}
              >
                Archive
              </Link>
              {role === "admin" && (
                <Link
                  to="/admin"
                  className={`text-xs font-extrabold uppercase tracking-widest transition-all ${isCurrent("/admin") ? "text-black border-b-2 border-black pb-1" : "text-black/40 hover:text-black"}`}
                >
                  Admin
                </Link>
              )}
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logOut}
                  className="w-8 h-8 text-black/20 hover:text-black hover:bg-black/5 rounded-full transition-all"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {!user && (
            <div className="flex items-center gap-6 pl-8 border-l border-black/10">
              <Link
                to="/signin"
                className="text-xs font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-xs font-extrabold uppercase tracking-widest bg-black text-white px-7 py-3 rounded-full hover:bg-zinc-800 transition-all shadow-sm"
              >
                Join Circle
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={toggleMenu}
          className="md:hidden z-50 w-10 h-10 flex items-center justify-center text-black"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-0 inset-x-0 h-screen bg-white z-40 flex flex-col p-10 pt-32 gap-8 md:hidden"
            >
              {navLinks.map((link) => (
                ((link.public && !user) || (link.private && user) || (link.adminOnly && role === "admin")) && (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-4xl font-display font-extrabold uppercase tracking-tighter ${isCurrent(link.path) ? "text-black" : "text-black/20"}`}
                  >
                    {link.name}
                  </Link>
                )
              ))}
              
              {!user ? (
                <div className="mt-auto flex flex-col gap-4">
                  <Link
                    to="/signin"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-5 rounded-2xl bg-zinc-100 text-center text-sm font-bold uppercase tracking-widest"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-5 rounded-2xl bg-black text-white text-center text-sm font-bold uppercase tracking-widest"
                  >
                    Join Circle
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => { logOut(); setIsOpen(false); }}
                  className="mt-auto w-full py-5 rounded-2xl bg-zinc-100 text-center text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-3"
                >
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
