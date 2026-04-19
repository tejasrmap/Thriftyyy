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
    <div className="max-w-7xl mx-auto px-6 py-20 relative">
      <header className="mb-20">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4 block"
        >
          Curated Catalog
        </motion.div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <h1 className="font-display font-extrabold text-5xl md:text-8xl tracking-tighter text-black uppercase">
            The Collection
          </h1>
          
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {["all", "wedding", "party", "casual", "formal"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                  filter === cat
                    ? "bg-black text-white shadow-lg"
                    : "bg-zinc-100 text-zinc-400 hover:text-black hover:bg-zinc-200"
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12"
      >
        <AnimatePresence>
          {filteredClothes.map((cloth, idx) => (
            <motion.div
              key={cloth.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
            >
              <Link to={`/cloth/${cloth.id}`} className="group block">
                <div className="boutique-card aspect-[3/4] mb-6 relative shadow-sm group-hover:boutique-card-hover">
                  {/* Indigo Price Tag */}
                  <div className="absolute top-4 right-4 z-20">
                    <div className="bg-indigo-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-xl transition-transform group-hover:scale-110">
                      ${cloth.pricePerDay}/day
                    </div>
                  </div>

                  {/* Standard Availability Overlay */}
                  {!cloth.availability && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center p-6 text-center">
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
                      <span className="relative text-[10px] font-bold uppercase tracking-widest bg-zinc-100 px-5 py-2.5 rounded-full text-zinc-400 border border-black/5">
                        Currently Rented
                      </span>
                    </div>
                  )}

                  <img
                    src={cloth.imageUrl}
                    alt={cloth.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="px-1">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <h3 className="text-xl font-bold tracking-tight text-black group-hover:text-indigo-600 transition-colors">
                      {cloth.title}
                    </h3>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-300">
                      {cloth.category}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm font-medium line-clamp-1">
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
          className="text-center py-24 bg-card rounded-[8px] border border-black/[0.05] mt-8 shadow-sm"
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
