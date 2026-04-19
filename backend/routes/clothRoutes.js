const express = require("express");
const router = express.Router();
const {
  getClothes,
  getClothById,
  createCloth,
  updateClothStatus,
  updateCloth,
  deleteCloth,
} = require("../controllers/clothController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").get(getClothes).post(protect, admin, createCloth);

router
  .route("/:id")
  .get(getClothById)
  .put(protect, updateCloth)
  .delete(protect, admin, deleteCloth);

router.route("/:id/status").put(protect, admin, updateClothStatus);

module.exports = router;
