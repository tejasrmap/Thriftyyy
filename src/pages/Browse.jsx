import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { Search, SlidersHorizontal } from "lucide-react";
import axios from "axios";

export function Browse() {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchClothes = async () => {
      try {
        const { data } = await axios.get("/api/clothes");
        setClothes(data);
      } catch (error) {
        console.error("Error fetching clothes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClothes();
  }, []);

  const filteredClothes =
    filter === "all" ? clothes : clothes.filter((c) => c.category === filter);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-24">
      <header className="mb-24 text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="inline-flex items-center px-4 py-2 rounded-full glass border-white/5 text-[10px] font-bold uppercase tracking-[0.4em] mb-8 text-white/50"
        >
          Curated Showcase
        </motion.div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter glow-text mb-6">
          The <span className="text-white/20 italic">Collection</span>
        </h1>
        <div className="flex justify-center mt-12 overflow-x-auto pb-4 hide-scrollbar">
          <div className="glass p-1.5 rounded-full flex gap-1">
            {["all", "wedding", "party", "casual", "formal"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-500 ${
                  filter === cat
                    ? "bg-white text-black shadow-2xl scale-105"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-10 gap-y-20"
      >
        <AnimatePresence>
          {filteredClothes.map((cloth, idx) => (
            <motion.div
              key={cloth.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, delay: idx * 0.05, ease: [0.23, 1, 0.32, 1] }}
            >
              <Link to={`/cloth/${cloth.id}`} className="group block">
                <div className="boutique-card aspect-[3/4.5] mb-8 relative">
                  {/* Floating Price Tag */}
                  <div className="absolute top-6 right-6 z-20">
                    <div className="glass px-5 py-2.5 rounded-2xl font-black text-lg border-white/10 shadow-2xl transition-transform group-hover:scale-110 group-hover:-rotate-3">
                      ${cloth.pricePerDay}
                    </div>
                  </div>

                  {/* Availability Overlay */}
                  {!cloth.availability && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center p-6 text-center">
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
                      <span className="relative text-xs font-black uppercase tracking-[0.3em] border-2 border-white/20 px-6 py-3 rounded-full">
                        Fully Booked
                      </span>
                    </div>
                  )}

                  <img
                    src={cloth.imageUrl}
                    alt={cloth.title}
                    className="w-full h-full object-cover transition-all duration-[2s] group-hover:scale-110 group-hover:rotate-2 brightness-75 group-hover:brightness-100"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Bottom Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                </div>

                <div className="px-2">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h3 className="text-2xl font-bold tracking-tight group-hover:glow-text transition-all duration-500">
                      {cloth.title}
                    </h3>
                    <span className="text-[10px] uppercase font-black tracking-widest text-white/30 border border-white/10 px-3 py-1 rounded-full whitespace-nowrap">
                      {cloth.category}
                    </span>
                  </div>
                  <p className="text-white/40 text-sm font-medium line-clamp-1 group-hover:text-white/60 transition-colors">
                    {cloth.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredClothes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 bg-card rounded-[32px] border border-dashed border-border/60 mt-8 shadow-sm"
        >
          <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-5" />
          <h3 className="text-xl font-bold text-foreground">No items found</h3>
          <p className="text-muted-foreground mt-2 font-medium">
            Try adjusting your filters or search criteria.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => setFilter("all")}
          >
            Clear filters
          </Button>
        </motion.div>
      )}
    </div>
  );
}
