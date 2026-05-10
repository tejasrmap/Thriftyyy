import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, ArrowUpRight, Filter, Leaf, Sparkles, FilterX, Wind, Sun } from "lucide-react";
import axios from "axios";
import { cn } from "../lib/utils";

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
      <div className="min-h-screen bg-background flex items-center justify-center grain-texture">
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-earth-sage border-t-transparent rounded-full shadow-lg"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 pb-20 px-6 page-transition bg-background grain-texture">
      <header className="max-w-7xl mx-auto mb-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16 organic-card p-12 md:p-16 bg-white shadow-[10px_10px_0px_rgba(22,101,52,0.1)]">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <Leaf className="w-5 h-5 text-earth-sage" />
               <span className="text-[11px] font-black uppercase tracking-[0.4em] text-earth-bark/40">The Collective Catalog</span>
            </div>
            <h1 className="font-display font-black text-6xl md:text-9xl tracking-tighter text-earth-bark leading-none">
              Archival <br/> <span className="text-earth-clay italic">Library.</span>
            </h1>
          </div>
          
          <div className="flex flex-col gap-10 lg:text-right">
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 lg:justify-end">
              {["all", "wedding", "party", "casual", "formal"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={cn(
                    "px-4 sm:px-10 py-4 rounded-[1.5rem] text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all duration-500",
                    filter === cat
                      ? "bg-earth-clay text-earth-linen shadow-xl scale-105"
                      : "bg-earth-linen text-earth-bark/60 border border-earth-bark/5 hover:bg-white hover:text-earth-bark"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredClothes.map((cloth, idx) => (
              <motion.div
                key={cloth._id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.7, delay: idx * 0.05, ease: [0.23, 1, 0.32, 1] }}
              >
                <Link to={`/cloth/${cloth._id}`} className="group block">
                  <div className="organic-card aspect-[3/4.5] mb-8 overflow-hidden group-hover:organic-card-hover group-hover:border-earth-clay/30">
                    {/* Price Badge */}
                    <div className="absolute top-8 left-8 z-20">
                      <div className="bg-earth-saffron text-earth-linen px-5 py-2 rounded-xl text-[11px] font-black shadow-lg">
                        ₹{cloth.pricePerDay} / <span className="text-earth-linen/40 uppercase">Day</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {!cloth.availability && (
                      <div className="absolute inset-0 z-30 flex items-center justify-center p-8">
                        <div className="absolute inset-0 bg-earth-linen/80 backdrop-blur-sm" />
                        <span className="relative text-[10px] font-black uppercase tracking-[0.2em] bg-red-100 text-red-600 px-8 py-4 rounded-full border-2 border-red-200 shadow-xl">
                           Reserved
                        </span>
                      </div>
                    )}

                    <img
                      src={cloth.imageUrl}
                      alt={cloth.title}
                      className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    
                    <div className="absolute inset-0 bg-earth-clay/5 group-hover:bg-transparent transition-colors" />
                  </div>

                  <div className="px-4 space-y-3">
                     <div className="flex justify-between items-start">
                        <div>
                           <h3 className="text-lg font-display font-black tracking-tight text-earth-bark uppercase">{cloth.title}</h3>
                           <div className="flex items-center gap-2 mt-1">
                              <span className="text-earth-bark/30 text-[10px] font-black uppercase tracking-[0.3em]">{cloth.category} Collection</span>
                           </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-earth-linen flex items-center justify-center text-earth-bark/40 group-hover:bg-earth-sage group-hover:text-earth-linen transition-all duration-500">
                           <ArrowUpRight className="w-5 h-5" />
                        </div>
                     </div>
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
            className="text-center py-40 organic-card mt-8 bg-white/50"
          >
            <FilterX className="w-20 h-20 text-earth-clay mx-auto mb-8 opacity-20" />
            <h3 className="text-5xl font-display font-black text-earth-bark tracking-tight">Nothing Found.</h3>
            <p className="text-earth-bark/40 mt-6 font-bold text-[10px] tracking-[0.3em] max-w-xs mx-auto uppercase">
               Our archive currently holds no pieces matching your selection.
            </p>
            <Button
              className="clay-button mt-12 h-20 px-16 text-xs uppercase tracking-widest shadow-2xl"
              onClick={() => setFilter("all")}
            >
              Reset Archive
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
