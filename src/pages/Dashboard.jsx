import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowRight, Calendar, Hash, ExternalLink, ShieldCheck, Heart, Sparkles, Wind, Sun, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import axios from "axios";
import { Button } from "../components/ui/button";

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get("/api/bookings/user");
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center grain-texture"><div className="w-12 h-12 border-4 border-earth-sage border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen pt-40 pb-20 px-6 page-transition bg-background grain-texture">
      {/* Header Bento */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 organic-card p-12 md:p-16 bg-white shadow-[12px_12px_0px_rgba(69,26,3,0.05)]"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-earth-sage text-earth-linen rounded-2xl flex items-center justify-center shadow-lg">
                <Leaf className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-earth-sage">Member Profile Node</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter text-earth-bark leading-none">
               Greetings, <br/> <span className="text-earth-clay italic">{user?.fullName.split(' ')[0]}.</span>
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 organic-card p-12 flex flex-col justify-between group hover:organic-card-hover bg-earth-bark text-earth-linen border-transparent shadow-[12px_12px_0px_rgba(69,26,3,0.1)]"
          >
            <div className="flex justify-between items-start">
               <ShoppingBag className="w-10 h-10 text-earth-linen/20" />
               <div className="bg-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">Active Archive</div>
            </div>
            <div>
               <h2 className="text-7xl font-display font-black tracking-tighter">{bookings.length}</h2>
               <p className="text-earth-linen/40 text-[10px] font-black uppercase tracking-widest mt-4 leading-loose">Pieces in Curated Rotation</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-16">
        <div className="flex items-center justify-between px-4">
           <h3 className="text-3xl font-display font-black text-earth-bark tracking-tight">Lease Manifest.</h3>
           <Link to="/browse" className="text-[11px] font-black uppercase tracking-widest text-earth-clay hover:text-earth-bark transition-colors flex items-center gap-3">
              Explore Library <ArrowRight className="w-5 h-5" />
           </Link>
        </div>

        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {bookings.map((booking, idx) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="organic-card group hover:organic-card-hover bg-white p-4">
                   <div className="aspect-[4/5] relative overflow-hidden rounded-[30px_10px_30px_10px]">
                      <img 
                        src={booking.cloth?.imageUrl} 
                        alt={booking.cloth?.title} 
                        className="w-full h-full object-cover transition-transform duration-[1s] group-hover:scale-110" 
                      />
                      <div className="absolute top-6 left-6 bg-earth-saffron text-earth-linen px-5 py-2 rounded-xl text-[10px] font-black shadow-lg">
                        ₹{booking.totalPrice}
                      </div>
                      <div className={cn(
                        "absolute bottom-6 left-6 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl",
                        booking.status === "booked" ? "bg-earth-sage text-earth-linen" : "bg-earth-bark text-earth-linen/40"
                      )}>
                        {booking.status}
                      </div>
                   </div>
                   <div className="p-8 space-y-8">
                      <div>
                        <h4 className="text-2xl font-display font-black text-earth-bark uppercase tracking-tighter">{booking.cloth?.title}</h4>
                        <p className="text-earth-bark/30 text-[10px] font-black uppercase tracking-[0.3em] mt-2">MANIFEST REF: {booking._id.slice(-8).toUpperCase()}</p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-8 border-t border-earth-bark/5">
                         <div className="flex items-center gap-4 text-earth-bark/40">
                            <Calendar className="w-5 h-5 text-earth-clay" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                               {format(new Date(booking.startDate), "MMM d")} — {format(new Date(booking.endDate), "MMM d")}
                            </span>
                         </div>
                         <div className="w-12 h-12 rounded-full bg-earth-linen flex items-center justify-center text-earth-bark/40 group-hover:bg-earth-clay group-hover:text-earth-linen transition-all duration-500">
                            <ArrowUpRight className="w-6 h-6" />
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="organic-card py-40 text-center space-y-10 bg-white/50 border-dashed border-earth-bark/10">
             <div className="w-24 h-24 bg-earth-linen rounded-[2.5rem] flex items-center justify-center mx-auto border border-earth-bark/5 shadow-inner">
                <Hash className="w-12 h-12 text-earth-bark/10" />
             </div>
             <div className="space-y-4">
                <h3 className="text-5xl font-display font-black text-earth-bark tracking-tight">Empty Archive.</h3>
                <p className="text-earth-bark/40 text-[11px] font-black uppercase tracking-[0.4em] max-w-xs mx-auto leading-relaxed">Your personal archival rotation has not been initiated yet.</p>
             </div>
             <Link to="/browse">
               <Button className="clay-button h-20 px-12 text-xs uppercase tracking-widest shadow-2xl">
                  Initialize First Lease
               </Button>
             </Link>
          </div>
        )}
      </div>

      {/* Earthy Features Section */}
      <div className="max-w-7xl mx-auto mt-32">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="organic-card p-12 flex items-center gap-10 group hover:organic-card-hover bg-white/60">
               <div className="w-24 h-24 bg-earth-sage/10 text-earth-sage flex items-center justify-center rounded-[2rem] border border-earth-sage/5">
                  <ShieldCheck className="w-10 h-10" />
               </div>
               <div>
                  <h4 className="text-2xl font-display font-black text-earth-bark">Secured Legacy</h4>
                  <p className="text-earth-bark/40 text-[10px] font-black uppercase tracking-widest mt-2 leading-loose">Premium Archival Protection Insurance</p>
               </div>
            </div>
            <div className="organic-card p-12 flex items-center gap-10 group hover:organic-card-hover bg-white/60">
               <div className="w-24 h-24 bg-earth-saffron/10 text-earth-saffron flex items-center justify-center rounded-[2rem] border border-earth-saffron/5">
                  <Sun className="w-10 h-10" />
               </div>
               <div>
                  <h4 className="text-2xl font-display font-black text-earth-bark">Studio Concierge</h4>
                  <p className="text-earth-bark/40 text-[10px] font-black uppercase tracking-widest mt-2 leading-loose">24/7 Specialist Archive Support</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
