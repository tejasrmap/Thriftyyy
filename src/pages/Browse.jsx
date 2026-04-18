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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-2">
            The Collection
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            Discover our curated selection of designer pieces.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {["all", "wedding", "party", "casual", "formal"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold capitalize whitespace-nowrap transition-all duration-300 ${
                filter === cat
                  ? "bg-primary text-primary-foreground shadow-md -translate-y-0.5"
                  : "bg-background text-muted-foreground border border-border/60 hover:border-border hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {cat}
            </button>
          ))}
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shrink-0 ml-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        <AnimatePresence>
          {filteredClothes.map((cloth, idx) => (
            <motion.div
              key={cloth.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Link to={`/cloth/${cloth.id}`} className="group block h-full">
                <Card className="overflow-hidden border-transparent bg-transparent shadow-none h-full flex flex-col group">
                  <div className="aspect-[3/4] relative rounded-3xl overflow-hidden bg-secondary mb-5 shadow-sm group-hover:shadow-md transition-shadow">
                    <img
                      src={cloth.imageUrl}
                      alt={cloth.title}
                      className="object-cover w-full h-full transition-transform duration-[1.5s] group-hover:scale-[1.03] ease-out"
                      referrerPolicy="no-referrer"
                    />

                    {!cloth.availability && (
                      <div className="absolute inset-0 bg-background/60 backdrop-blur-md flex items-center justify-center transition-opacity">
                        <Badge
                          variant="secondary"
                          className="px-4 py-1.5 text-sm font-bold bg-background text-foreground drop-shadow-sm border border-border/50 uppercase tracking-widest"
                        >
                          Currently Rented
                        </Badge>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge
                        variant="secondary"
                        className="bg-background/90 backdrop-blur-xl text-foreground capitalize drop-shadow-sm border border-border/30 shadow-sm px-3 py-1 font-semibold"
                      >
                        {cloth.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-0 flex-1 flex flex-col px-1">
                    <h3 className="text-lg font-bold text-foreground transition-colors line-clamp-1 decoration-2 underline-offset-4 group-hover:underline">
                      {cloth.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed font-medium">
                      {cloth.description}
                    </p>
                    <div className="mt-auto pt-4 flex items-baseline font-semibold">
                      <span className="text-xl text-foreground tracking-tight">
                        ${cloth.pricePerDay}
                      </span>
                      <span className="text-muted-foreground text-sm ml-1 font-medium">/ day</span>
                    </div>
                  </CardContent>
                </Card>
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
