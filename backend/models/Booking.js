const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cloth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cloth",
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Number,
      required: true,
    },
    endDate: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["booked", "returned", "cancelled"],
      default: "booked",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
