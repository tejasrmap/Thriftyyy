import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchBookings = async () => {
      try {
        const { data } = await axios.get("/api/bookings/mybookings");
        setBookings(data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold mb-4">Sign in required</h2>
        <p className="text-gray-500 mb-8">
          Please sign in to view your bookings.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
          My Bookings
        </h1>
        <p className="text-lg text-gray-500">
          Manage your current and past rentals.
        </p>
      </div>

      {bookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200"
        >
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <ShoppingBag className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            No active rentals
          </h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            You haven't rented any clothes yet. Discover our collection of
            designer pieces perfectly curated for any occasion.
          </p>
          <Link
            to="/browse"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-colors shadow-lg"
          >
            Explore Collection <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking, idx) => (
            <motion.div
              key={booking._id || booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-48 h-48 bg-gray-100 flex-none relative">
                    {booking.cloth?.imageUrl ? (
                      <img
                        src={booking.cloth.imageUrl}
                        alt={booking.cloth.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {booking.cloth?.title || "Item Unavailable"}
                          </h3>
                          <p className="text-sm text-gray-500 font-mono">
                            Order #{(booking._id || booking.id).slice(-8).toUpperCase()}
                          </p>
                        </div>
                        <Badge
                          variant={
                            booking.status === "booked"
                              ? "default"
                              : "secondary"
                          }
                          className={`capitalize px-3 py-1 shadow-none ${booking.status === "booked" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}`}
                        >
                          {booking.status}
                        </Badge>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4 inline-block mb-4">
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          Rental Period
                        </p>
                        <p className="text-gray-600 text-sm">
                          {format(new Date(booking.startDate), "MMM dd, yyyy")}{" "}
                          — {format(new Date(booking.endDate), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-between items-end mt-4">
                      <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </span>
                      <span className="font-bold text-3xl text-gray-900">
                        ${booking.totalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
