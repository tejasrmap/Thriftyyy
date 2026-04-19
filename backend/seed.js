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
    title: "Dior Shadow Vest",
    description: "Premium velvet finish with architectural silhouette. A statement piece for gallery openings or high-fashion events.",
    category: "formal",
    size: "M",
    pricePerDay: 150,
    availability: true,
    imageUrl: "https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?q=80&w=2000&auto=format&fit=crop",
  },
  {
    title: "Saint Laurent Tuxedo",
    description: "Peak lapel tuxedo in grain de poudre wool. The ultimate choice for black-tie affairs and weddings.",
    category: "wedding",
    size: "L",
    pricePerDay: 200,
    availability: true,
    imageUrl: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=2000&auto=format&fit=crop",
  },
  {
    title: "Balenciaga Oversized Coat",
    description: "Dramatic proportions and heavy wool blend. Perfect for making an entrance at winter party circuits.",
    category: "party",
    size: "L",
    pricePerDay: 180,
    availability: true,
    imageUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2000&auto=format&fit=crop",
  },
  {
    title: "Gucci Flora Silk Gown",
    description: "Ethereal silk chiffon with iconic flora print. A timeless masterpiece for summer galas.",
    category: "formal",
    size: "S",
    pricePerDay: 220,
    availability: true,
    imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2000&auto=format&fit=crop",
  },
  {
    title: "Prada Nylon Parka",
    description: "Technical elegance with re-nylon fabric. Versatile for elevated casual outings and weekend archives.",
    category: "casual",
    size: "M",
    pricePerDay: 95,
    availability: true,
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2000&auto=format&fit=crop",
  }
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

    // Insert Admin User
    await User.create({
      fullName: "Master Admin",
      email: "admin@thriftyy.com",
      password: "admin123",
      role: "admin"
    });
    console.log("🔑 Created default Admin: admin@thriftyy.com / admin123");

    console.log("🌱 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    process.exit(0);
  }
};

seedDB();
