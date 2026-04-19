import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, buttonVariants } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
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
} from "lucide-react";
import { cn } from "../lib/utils";
import axios from "axios";
import { motion } from "framer-motion";

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

    // Trigger Payment Gateway Mock Overlay
    setShowCheckout(true);
  };

  const processPaymentAndBook = async () => {
    if (!user || !date?.from || !date?.to || !cloth) return;
    setPaymentProcessing(true);

    try {
      const days = Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = days * cloth.pricePerDay;

      // 1. Create order on backend
      const { data: order } = await axios.post("/api/payments/razor", {
        amount: totalPrice,
        currency: "USD", // Note: Razorpay default is INR, but we'll use USD as seen in UI, check Razorpay account support
        receipt: `receipt_${Date.now()}`,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_live_SfQRsRpAF0JY1T", // Provided by user
        amount: order.amount,
        currency: order.currency,
        name: "Thriftyy",
        description: `Rental: ${cloth.title}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            // 2. Verify payment on backend
            const { data: verifyData } = await axios.post("/api/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyData.status === "success") {
              // 3. Save booking
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
          name: user.fullName,
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

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  if (!cloth)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Item Not Found
        </h2>
        <p className="text-gray-500 mb-6">
          The item you are looking for does not exist or has been removed.
        </p>
        <Link to="/browse" className={buttonVariants({ variant: "default" })}>
          Back to Collection
        </Link>
      </div>
    );

  const days =
    date?.from && date?.to ? differenceInDays(date.to, date.from) + 1 : 0;
  const totalPrice = days * cloth.pricePerDay;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Link
        to="/browse"
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black mb-8 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Collection
      </Link>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
        {/* Left: Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="aspect-[3/4] md:aspect-auto md:h-[calc(100vh-12rem)] md:sticky top-24 rounded-3xl overflow-hidden bg-gray-100 border border-gray-200">
            <img
              src={cloth.imageUrl}
              alt={cloth.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            {!cloth.availability && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex items-center justify-center">
                <Badge
                  variant="secondary"
                  className="px-4 py-2 text-base font-semibold bg-white text-black drop-shadow-md"
                >
                  Currently Rented
                </Badge>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right: Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col pt-4 md:pt-8"
        >
          <div className="mb-8">
            <div className="flex gap-2 mb-4">
              <Badge
                variant="secondary"
                className="px-3 py-1 bg-gray-100 text-gray-800 capitalize font-medium"
              >
                {cloth.category}
              </Badge>
              <Badge variant="outline" className="px-3 py-1 font-medium">
                Size {cloth.size}
              </Badge>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4">
              {cloth.title}
            </h1>
            <div className="flex items-end gap-2 mb-6">
              <p className="text-3xl font-semibold text-gray-900">
                ${cloth.pricePerDay}
              </p>
              <p className="text-gray-500 mb-1">/ day</p>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              {cloth.description}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-10 py-6 border-y border-gray-100">
            <div className="flex items-center gap-3 text-gray-600">
              <ShieldCheck className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium">100% Authentic</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Truck className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium">
                Free Delivery & Return
              </span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <RefreshCw className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium">Dry Cleaning Included</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
            <h3 className="font-semibold text-xl mb-6">Reserve your dates</h3>

            {!cloth.availability ? (
              <div className="text-amber-700 font-medium bg-amber-50 rounded-2xl p-6 text-center border border-amber-100">
                This item is currently out with another customer. Please check
                back later.
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    Rental Period
                  </label>
                  <Popover>
                    <PopoverTrigger
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full justify-start text-left font-normal py-6 rounded-xl border-gray-300 text-base",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-3 h-5 w-5 text-gray-500" />
                      {date?.from ? (
                        date.to ? (
                          <span className="text-gray-900 font-medium">
                            {format(date.from, "MMM dd, y")} —{" "}
                            {format(date.to, "MMM dd, y")}
                          </span>
                        ) : (
                          <span className="text-gray-900">
                            {format(date.from, "MMM dd, y")}
                          </span>
                        )
                      ) : (
                        <span>Select start and end dates</span>
                      )}
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 rounded-2xl"
                      align="start"
                    >
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                        disabled={(d) =>
                          d < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        className="rounded-2xl"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {days > 0 ? (
                  <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center border border-gray-100">
                    <span className="text-gray-600">
                      {days} days × ${cloth.pricePerDay}
                    </span>
                    <span className="font-bold text-2xl text-gray-900">
                      ${totalPrice}
                    </span>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center border border-gray-100 opacity-50">
                    <span className="text-gray-600">
                      Select dates for pricing
                    </span>
                    <span className="font-bold text-2xl text-gray-900">$0</span>
                  </div>
                )}

                <div className="pt-6 border-t border-border/50">
                  <Button
                    onClick={handleBook}
                    disabled={!date?.from || !date?.to || !cloth.availability}
                    className="w-full h-14 text-lg font-bold rounded-2xl bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-primary/20"
                  >
                    {!cloth.availability ? "Unavailable for Dates" : "Proceed to Checkout"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-border"
          >
            <div className="bg-primary p-6 text-primary-foreground flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xl tracking-tight">Secure Checkout</h3>
                <p className="text-sm opacity-80">Powered by Razorpay</p>
              </div>
              <ShieldCheck className="w-8 h-8 opacity-50" />
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 py-4 border-b border-border/50">
                <div>
                  <p className="text-sm font-semibold">{cloth.title}</p>
                  <p className="text-xs text-muted-foreground">{Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24))} Days Rental</p>
                </div>
                <p className="font-bold text-xl">
                  ${Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)) * cloth.pricePerDay}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="h-12 bg-secondary/50 rounded-lg flex items-center px-4 border border-border">
                  <span className="text-sm text-muted-foreground font-mono w-full">XXXX-XXXX-XXXX-[DEMO]</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCheckout(false)}
                  disabled={paymentProcessing}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={processPaymentAndBook}
                  disabled={paymentProcessing}
                  className="flex-1"
                >
                  {paymentProcessing ? (
                    <div className="flex items-center gap-2">
                       <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                       Processing...
                    </div>
                  ) : "Pay Now"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
