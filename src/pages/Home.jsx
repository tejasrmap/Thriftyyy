import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Star, Sparkles, ShoppingBag, Heart, ShieldCheck, Globe, Zap, Layers, Wind, Sun } from "lucide-react";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

export function Home() {
  return (
    <div className="flex flex-col min-h-screen page-transition bg-background grain-texture">
      {/* Organic Hero Section */}
      <section className="relative min-h-screen flex items-center pt-40 pb-20 overflow-hidden">
        {/* Background Organic Shapes */}
        <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] bg-earth-sage/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-earth-clay/5 blur-[100px] rounded-full" />

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-3 px-6 py-2 bg-earth-sage/10 rounded-full border border-earth-sage/10"
              >
                <Leaf className="w-4 h-4 text-earth-sage" />
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-earth-sage">Conscious Wardrobe</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-display font-black text-7xl md:text-[9rem] leading-[0.85] tracking-tight text-earth-bark"
              >
                Grounded <br />
                <span className="text-[#991B1B] italic">Fashion.</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-earth-bark/60 text-lg md:text-2xl font-medium max-w-xl leading-relaxed"
              >
                Thriftyy is a curated archive of high-end archival pieces. Earth-conscious, high-quality, and deeply personal.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap items-center gap-8"
              >
                <Link
                  to="/browse"
                  className="clay-button h-24 px-16 text-lg uppercase tracking-widest flex items-center gap-4"
                >
                  Enter Archive <ArrowRight className="w-6 h-6" />
                </Link>
                
                <div className="flex items-center gap-6">
                   <div className="text-4xl font-display font-black text-earth-sage">10k+</div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-earth-bark/40 max-w-[80px]">
                      Archived Masterpieces
                   </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
              className="relative"
            >
               <div className="organic-card aspect-[4/5.5] p-6 relative z-10 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop" 
                    className="w-full h-full object-cover rounded-[30px_10px_30px_10px]"
                    alt="Organic Fashion"
                  />
                  <div className="absolute inset-0 bg-earth-clay/5 pointer-events-none" />
               </div>
               
               {/* Decorative Blobs */}
               <div className="absolute -top-12 -right-12 w-40 h-40 bg-earth-saffron/10 rounded-full blur-2xl -z-10" />
               <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-earth-sage/10 rounded-full blur-2xl -z-10" />
               
               <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute top-1/4 -right-12 bg-white p-8 rounded-[2rem] shadow-2xl border border-earth-bark/5 z-20"
               >
                  <Sun className="w-8 h-8 text-earth-saffron" />
               </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Textured Value Section */}
      <section className="py-40 px-6 bg-earth-bark text-earth-linen relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none grain-texture" />
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-20">
            <div className="space-y-8">
               <div className="w-16 h-16 bg-earth-sage text-earth-linen flex items-center justify-center rounded-2xl">
                  <Globe className="w-8 h-8" />
               </div>
               <h3 className="text-4xl font-display font-black tracking-tight">Earth First.</h3>
               <p className="text-earth-linen/40 font-medium leading-relaxed">Our circular model reduces textile waste by 90% compared to traditional retail. Quality that lasts generations.</p>
            </div>
            <div className="space-y-8">
               <div className="w-16 h-16 bg-earth-clay text-earth-linen flex items-center justify-center rounded-2xl">
                  <Heart className="w-8 h-8" />
               </div>
               <h3 className="text-4xl font-display font-black tracking-tight">Hand Picked.</h3>
               <p className="text-earth-linen/40 font-medium leading-relaxed">Every piece is authenticated and manually inspected for structural integrity and timeless aesthetic value.</p>
            </div>
            <div className="space-y-8">
               <div className="w-16 h-16 bg-earth-saffron text-earth-linen flex items-center justify-center rounded-2xl">
                  <ShieldCheck className="w-8 h-8" />
               </div>
               <h3 className="text-4xl font-display font-black tracking-tight">Secured Legacy.</h3>
               <p className="text-earth-linen/40 font-medium leading-relaxed">Secure bookings and premium insurance coverage for every archival rental. Your peace of mind is our priority.</p>
            </div>
         </div>
      </section>

      {/* Feature Grid - Organic */}
      <section className="py-40 px-6">
         <div className="max-w-7xl mx-auto space-y-32">
            <div className="flex flex-col md:flex-row items-center gap-20">
               <div className="flex-1 organic-card aspect-square p-4">
                  <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover rounded-[35px_15px_35px_15px]" alt="" />
               </div>
               <div className="flex-1 space-y-12">
                  <div className="w-16 h-2 bg-earth-clay" />
                  <h2 className="text-6xl md:text-8xl font-display font-black text-earth-bark tracking-tight leading-[0.9]">The Fine <br/> <span className="text-earth-sage italic">Edit.</span></h2>
                  <p className="text-earth-bark/60 text-xl font-medium leading-relaxed max-w-lg">We don't just host clothes; we curate stories. Access rare designer drops and vintage essentials with a single tap.</p>
                  <Button className="clay-button h-20 px-12 text-xs uppercase tracking-widest">View Catalog</Button>
               </div>
            </div>
         </div>
      </section>

      {/* Saffron CTA */}
      <section className="py-40 px-6 text-center bg-earth-saffron/10 border-y border-earth-bark/5 relative">
         <div className="max-w-4xl mx-auto space-y-16">
            <h2 className="text-7xl md:text-[10rem] font-display font-black text-earth-bark tracking-tighter leading-none">Join the <br/> <span className="text-earth-clay">Collective.</span></h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-10 pt-10">
               <Link to="/signup" className="clay-button h-24 px-20 text-lg uppercase tracking-widest flex items-center justify-center">Get Access</Link>
               <Link to="/browse" className="bg-white text-earth-bark border border-earth-bark/10 h-24 px-20 text-lg uppercase tracking-widest rounded-[2rem] flex items-center justify-center transition-all hover:bg-earth-linen">Browse</Link>
            </div>
         </div>
      </section>

      {/* Footer - Earthy */}
      <footer className="py-24 border-t border-earth-bark/5">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-earth-bark text-earth-linen flex items-center justify-center rounded-[1.2rem] font-display font-black text-xl shadow-lg">T</div>
               <span className="font-display font-black text-2xl tracking-tighter text-earth-bark uppercase">Thriftyy</span>
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-earth-bark/20">© 2026 Earth-Minded Fashion Collective • Studio Archive</p>
            <div className="flex gap-12">
               {['Instagram', 'Terms', 'Journal'].map(link => (
                 <a key={link} href="#" className="text-[11px] font-black uppercase tracking-widest text-earth-bark/40 hover:text-earth-clay transition-colors">{link}</a>
               ))}
            </div>
         </div>
      </footer>
    </div>
  );
}
