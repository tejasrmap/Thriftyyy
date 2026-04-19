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

// @desc    Update a cloth
// @route   PUT /api/clothes/:id
// @access  Private/Admin/Employee
const updateCloth = async (req, res) => {
  try {
    const { title, description, category, size, pricePerDay, imageUrl, availability } = req.body;
    const cloth = await Cloth.findById(req.params.id);

    if (cloth) {
      cloth.title = title || cloth.title;
      cloth.description = description || cloth.description;
      cloth.category = category || cloth.category;
      cloth.size = size || cloth.size;
      cloth.pricePerDay = pricePerDay || cloth.pricePerDay;
      cloth.imageUrl = imageUrl || cloth.imageUrl;
      if (typeof availability === "boolean") cloth.availability = availability;

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

// @desc    Delete a cloth
// @route   DELETE /api/clothes/:id
// @access  Private/Admin
const deleteCloth = async (req, res) => {
  try {
    const cloth = await Cloth.findById(req.params.id);
    if (cloth) {
      await cloth.deleteOne();
      res.json({ message: "Cloth removed" });
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
  updateCloth,
  deleteCloth,
};
