import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { LogOut, Menu, X, ShoppingBag, User, Leaf, Wind, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

export function Navbar() {
  const { user, role, logOut } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "The Archive", path: "/browse", icon: Leaf },
    { name: "My Pieces", path: "/dashboard", icon: Wind },
  ];

  if (role === "admin" || role === "employee") {
    navLinks.push({ name: "Studio", path: "/admin", icon: Sun });
  }

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      scrolled ? "bg-earth-linen/95 backdrop-blur-md py-4 border-b border-earth-bark/10" : "bg-transparent py-8"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-earth-clay text-earth-linen flex items-center justify-center rounded-[1.2rem] shadow-lg transition-transform group-hover:rotate-12 group-hover:scale-110">
            <span className="font-display font-black text-2xl">T</span>
          </div>
          <span className="font-display font-black text-2xl tracking-tighter text-earth-bark group-hover:text-earth-clay transition-colors uppercase">
            Thriftyy
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2 bg-white/50 p-1.5 rounded-[2rem] border border-earth-bark/5">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "px-8 py-3 rounded-full text-[13px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2",
                location.pathname === link.path
                  ? "bg-earth-sage text-earth-linen shadow-md"
                  : "text-earth-bark/60 hover:text-earth-bark hover:bg-white"
              )}
            >
              <link.icon className={cn("w-4 h-4", location.pathname === link.path ? "text-earth-linen" : "text-earth-bark/20")} />
              {link.name}
            </Link>
          ))}
          
          <div className="w-[1px] h-6 bg-earth-bark/10 mx-4" />

          {user ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={logOut}
                className="rounded-full px-6 h-12 text-[12px] font-black uppercase tracking-widest text-earth-clay hover:bg-earth-clay/5"
              >
                <LogOut className="w-4 h-4 mr-2" /> Exit
              </Button>
            </div>
          ) : (
            <Link to="/signin">
              <Button className="rounded-full px-10 h-12 bg-earth-clay hover:bg-earth-bark text-earth-linen font-black uppercase tracking-widest text-[12px] shadow-lg shadow-earth-clay/20 transition-all">
                Enter
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden w-12 h-12 flex items-center justify-center rounded-[1rem] bg-white border border-earth-bark/10"
        >
          {isOpen ? <X className="w-6 h-6 text-earth-bark" /> : <Menu className="w-6 h-6 text-earth-bark" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="md:hidden fixed top-24 left-6 right-6 bg-earth-linen border border-earth-bark/10 rounded-[2rem] p-8 shadow-2xl z-40"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-6 rounded-[1.5rem] bg-white/50 hover:bg-white border border-transparent hover:border-earth-bark/10 transition-all"
                >
                  <link.icon className="w-6 h-6 text-earth-sage" />
                  <span className="font-black text-earth-bark uppercase tracking-widest">{link.name}</span>
                </Link>
              ))}
              <div className="h-[1px] bg-earth-bark/5 my-4" />
              {user ? (
                <Button
                  variant="ghost"
                  onClick={() => { logOut(); setIsOpen(false); }}
                  className="w-full h-16 rounded-[1.5rem] text-earth-clay bg-white border border-earth-bark/10 font-black uppercase tracking-widest"
                >
                  Sign Out
                </Button>
              ) : (
                <Link to="/signin" onClick={() => setIsOpen(false)}>
                  <Button className="w-full h-16 rounded-[1.5rem] bg-earth-clay text-earth-linen font-black uppercase tracking-widest">
                    Enter Portal
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
