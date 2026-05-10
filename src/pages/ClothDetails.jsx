import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { format, differenceInDays } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ShieldCheck,
  Truck,
  RefreshCw,
  Star,
  Info,
  ArrowRight,
  Heart,
  Globe
} from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export function ClothDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cloth, setCloth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState();
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    const fetchCloth = async () => {
      try {
        const { data } = await axios.get(`/api/clothes/${id}`);
        setCloth(data);
      } catch (error) {
        console.error("Failed to load cloth details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCloth();
  }, [id]);

  const handleBook = () => {
    if (!user) {
      navigate("/signin");
      return;
    }
    if (!date?.from || !date?.to || !cloth) return;
    setShowCheckout(true);
  };

  const processPaymentAndBook = async () => {
    if (!user || !date?.from || !date?.to || !cloth) return;
    setPaymentProcessing(true);

    try {
      const days = Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const totalPrice = days * cloth.pricePerDay;

      const { data: order } = await axios.post("/api/payments/razor", {
        amount: totalPrice,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_live_SfQRsRpAF0JY1T",
        amount: order.amount,
        currency: order.currency,
        name: "Thriftyy",
        description: `Rental: ${cloth.title}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            const { data: verifyData } = await axios.post("/api/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyData.status === "success") {
              setBookingLoading(true);
              await axios.post("/api/bookings", {
                clothId: cloth._id,
                startDate: date.from.getTime(),
                endDate: date.to.getTime(),
                totalPrice,
              });

              setCloth({ ...cloth, availability: false });
              setShowCheckout(false);
              navigate("/dashboard");
            }
          } catch (err) {
            console.error("Verification failed", err);
            alert("Payment verification failed. Please contact support.");
          } finally {
            setBookingLoading(false);
            setPaymentProcessing(false);
          }
        },
        prefill: {
          name: user.displayName,
          email: user.email,
        },
        theme: {
          color: "#000000",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        alert("Payment failed: " + response.error.description);
        setPaymentProcessing(false);
      });
      rzp1.open();
    } catch (error) {
      console.error(error);
      alert("Failed to initiate payment. Please try again.");
      setPaymentProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-brand-ivory flex items-center justify-center"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border-2 border-black/5 border-t-black rounded-full" /></div>;
  if (!cloth) return <div className="min-h-screen bg-brand-ivory flex items-center justify-center text-black">Piece not found</div>;

  const days = date?.from && date?.to ? differenceInDays(date.to, date.from) + 1 : 0;
  const totalPrice = days * cloth.pricePerDay;

  return (
    <div className="min-h-screen bg-brand-ivory text-black pt-32 pb-20 page-transition">
      <div className="noise-overlay" />
      
      <div className="max-w-7xl mx-auto px-10">
        <Link 
          to="/browse" 
          className="inline-flex items-center gap-3 text-black/40 hover:text-black transition-colors mb-16 text-[10px] font-bold uppercase tracking-[0.3em]"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          {/* Gallery View */}
          <div className="lg:col-span-7 space-y-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-black/5 shadow-2xl relative group bg-white"
            >
              <img
                src={cloth.imageUrl}
                alt={cloth.title}
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-10 right-10 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-2 border border-black/5 shadow-sm">
                 <Star className="w-4 h-4 text-brand-gold fill-current" />
                 <span className="text-sm font-black">4.9</span>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-3 gap-8">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="aspect-square rounded-[2rem] overflow-hidden border border-black/5 bg-white opacity-60 hover:opacity-100 transition-opacity cursor-pointer shadow-sm">
                    <img src={cloth.imageUrl} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Detail" />
                 </div>
               ))}
            </div>
          </div>

          {/* Product Dossier */}
          <div className="lg:col-span-5 lg:sticky lg:top-40 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center gap-4 mb-8">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold border-b-2 border-brand-gold pb-1">
                    {cloth.category}
                 </span>
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30">
                    Size {cloth.size}
                 </span>
                 {cloth.availability ? (
                    <div className="flex items-center gap-2 ml-auto">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Available</span>
                    </div>
                 ) : (
                    <span className="text-red-500 text-[9px] font-black uppercase tracking-widest ml-auto">In Rotation</span>
                 )}
              </div>
              
              <h1 className="text-6xl md:text-8xl font-display font-black uppercase tracking-tighter leading-[0.9] mb-10">
                {cloth.title}
              </h1>
              
              <p className="text-black/50 text-xl leading-relaxed mb-12 font-medium">
                {cloth.description}
              </p>

              <div className="p-10 rounded-[3rem] bg-white border border-black/5 shadow-2xl space-y-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-black/30 text-[9px] font-black uppercase tracking-[0.2em] mb-2">Daily Rental</p>
                    <p className="text-5xl font-black tracking-tighter text-black">₹{cloth.pricePerDay} <span className="text-lg text-black/20 font-medium">INR</span></p>
                  </div>
                  <div className="text-right">
                    <ShieldCheck className="w-10 h-10 text-brand-gold/20 ml-auto mb-2" />
                    <p className="text-[9px] font-black text-black/40 uppercase tracking-widest">Verified Piece</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-black/40">Rental Window</p>
                  <Popover>
                    <PopoverTrigger render={
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full h-18 bg-white border-earth-bark/10 rounded-[1.5rem] px-8 text-left font-bold text-earth-bark",
                          !date && "text-earth-bark/30"
                        )}
                      >
                        <CalendarIcon className="mr-4 h-5 w-5 text-earth-clay" />
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "LLL dd, y")} -{" "}
                              {format(date.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(date.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a lease duration</span>
                        )}
                      </Button>
                    } />
                    <PopoverContent className="w-auto p-0 border-black/5 bg-white shadow-2xl rounded-3xl overflow-hidden" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                        disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                        className="bg-white text-black p-6"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {days > 0 && (
                  <div className="bg-brand-ivory p-6 rounded-2xl flex justify-between items-center border border-black/5">
                    <span className="text-black/40 text-[10px] font-black uppercase tracking-[0.2em]">
                      {days} Days × ₹{cloth.pricePerDay}
                    </span>
                    <span className="font-black text-2xl text-black">
                      ₹{totalPrice}
                    </span>
                  </div>
                )}

                <Button
                  className="w-full h-24 rounded-full bg-black text-white font-black text-xl uppercase tracking-[0.2em] hover:bg-brand-gold hover:scale-[1.02] active:scale-95 transition-all shadow-2xl disabled:opacity-30"
                  onClick={handleBook}
                  disabled={bookingLoading || !cloth.availability}
                >
                  {bookingLoading ? "Archiving..." : (cloth.availability ? "Reserve Piece" : "In Rotation")}
                </Button>
              </div>

              <div className="mt-16 grid grid-cols-3 gap-10">
                 {[
                   { icon: Truck, text: "Boutique Delivery" },
                   { icon: RefreshCw, text: "Curated Cleaning" },
                   { icon: Globe, text: "Circular Luxury" }
                 ].map((item, i) => (
                   <div key={i} className="flex flex-col items-center text-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white border border-black/5 flex items-center justify-center shadow-sm">
                         <item.icon className="w-5 h-5 text-brand-gold" />
                      </div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-black/30 leading-tight">{item.text}</p>
                   </div>
                 ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
      {showCheckout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white w-full max-w-lg rounded-[3rem] shadow-[0_100px_200px_-50px_rgba(0,0,0,0.3)] overflow-hidden border border-black/5"
          >
            <div className="bg-brand-ivory p-10 flex justify-between items-center border-b border-black/5">
              <div>
                <h3 className="font-display font-black text-3xl tracking-tighter uppercase">Studio Checkout</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold">Boutique Collective</p>
              </div>
              <Heart className="w-12 h-12 text-brand-gold/10" />
            </div>
            
            <div className="p-10 space-y-10">
              <div className="flex justify-between items-center py-8 border-b border-black/5">
                <div>
                  <p className="text-lg font-black text-black uppercase tracking-tighter">{cloth.title}</p>
                  <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest">{days} Day Lease</p>
                </div>
                <p className="font-black text-3xl text-black">
                  ₹{totalPrice}
                </p>
              </div>

              <div className="flex gap-6">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowCheckout(false)}
                  disabled={paymentProcessing}
                  className="flex-1 h-20 rounded-3xl border border-black/10 text-black hover:bg-black/5 font-black uppercase text-[10px] tracking-widest"
                >
                  Discard
                </Button>
                <Button 
                  onClick={processPaymentAndBook}
                  disabled={paymentProcessing}
                  className="flex-1 h-20 rounded-3xl bg-black text-white font-black uppercase tracking-widest text-[10px] hover:bg-brand-gold transition-all shadow-xl"
                >
                  {paymentProcessing ? (
                    <div className="flex items-center gap-3">
                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                       Validating
                    </div>
                  ) : "Confirm & Pay"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </div>
  );
}

