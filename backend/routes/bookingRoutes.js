const express = require("express");
const router = express.Router();
const {
  addBookingItems,
  getBookings,
  getMyBookings,
  updateBookingToReturned,
} = require("../controllers/bookingController");
const { protect, admin, staff, checkPermission } = require("../middleware/authMiddleware");

router.route("/").post(protect, addBookingItems).get(protect, staff, checkPermission("canManageBookings"), getBookings);
router.route("/mybookings").get(protect, getMyBookings);
router.route("/:id/return").put(protect, staff, checkPermission("canManageBookings"), updateBookingToReturned);

module.exports = router;
