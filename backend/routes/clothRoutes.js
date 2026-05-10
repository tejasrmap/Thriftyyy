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
const { protect, admin, staff, checkPermission } = require("../middleware/authMiddleware");

router.route("/").get(getClothes).post(protect, staff, checkPermission("canManageInventory"), createCloth);

router
  .route("/:id")
  .get(getClothById)
  .put(protect, staff, checkPermission("canManageInventory"), updateCloth)
  .delete(protect, admin, deleteCloth);

router.route("/:id/status").put(protect, staff, checkPermission("canManageInventory"), updateClothStatus);

module.exports = router;
