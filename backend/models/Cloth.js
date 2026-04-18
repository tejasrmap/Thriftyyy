const mongoose = require("mongoose");

const clothSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["casual", "formal", "party", "wedding"],
    },
    size: {
      type: String,
      required: true,
      enum: ["S", "M", "L", "XL"],
    },
    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cloth", clothSchema);
