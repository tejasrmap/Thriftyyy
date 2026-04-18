const Cloth = require("../models/Cloth");

// @desc    Fetch all catalog items
// @route   GET /api/clothes
// @access  Public
const getClothes = async (req, res) => {
  try {
    const clothes = await Cloth.find({});
    res.json(clothes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Fetch single cloth
// @route   GET /api/clothes/:id
// @access  Public
const getClothById = async (req, res) => {
  try {
    const cloth = await Cloth.findById(req.params.id);
    if (cloth) {
      res.json(cloth);
    } else {
      res.status(404).json({ message: "Cloth not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a cloth
// @route   POST /api/clothes
// @access  Private/Admin
const createCloth = async (req, res) => {
  try {
    const { title, description, category, size, pricePerDay, imageUrl } = req.body;

    const cloth = new Cloth({
      title,
      description,
      category,
      size,
      pricePerDay,
      imageUrl,
    });

    const createdCloth = await cloth.save();
    res.status(201).json(createdCloth);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Toggle availability
// @route   PUT /api/clothes/:id/status
// @access  Private/Admin
const updateClothStatus = async (req, res) => {
  try {
    const cloth = await Cloth.findById(req.params.id);

    if (cloth) {
      cloth.availability = req.body.availability;
      const updatedCloth = await cloth.save();
      res.json(updatedCloth);
    } else {
      res.status(404).json({ message: "Cloth not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getClothes,
  getClothById,
  createCloth,
  updateClothStatus,
};
