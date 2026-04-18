const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Cloth = require("./models/Cloth");
const User = require("./models/User");

dotenv.config();

const mongooseConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected for Seeding");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
};

const INITIAL_CLOTHES = [
  {
    title: "Elegant Evening Gown",
    description: "A beautiful evening gown for formal events.",
    category: "formal",
    size: "M",
    pricePerDay: 45,
    availability: true,
    imageUrl: "https://picsum.photos/seed/gown/400/600",
  },
  {
    title: "Classic Tuxedo",
    description: "Black tuxedo perfect for weddings.",
    category: "wedding",
    size: "L",
    pricePerDay: 60,
    availability: true,
    imageUrl: "https://picsum.photos/seed/tux/400/600",
  },
  {
    title: "Summer Party Dress",
    description: "Light and breezy dress for summer parties.",
    category: "party",
    size: "S",
    pricePerDay: 30,
    availability: true,
    imageUrl: "https://picsum.photos/seed/dress/400/600",
  },
];

const seedDB = async () => {
  await mongooseConnect();
  
  try {
    // Clear existing to avoid duplicates
    await Cloth.deleteMany();
    await User.deleteMany();
    console.log("🧹 Cleared existing DB records");

    // Insert new data
    await Cloth.insertMany(INITIAL_CLOTHES);
    console.log("👕 Injected initial Cloth catalog");

    console.log("🌱 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    process.exit(0);
  }
};

seedDB();
