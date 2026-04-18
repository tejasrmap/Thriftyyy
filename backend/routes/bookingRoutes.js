const express = require("express");
const router = express.Router();
const {
  addBookingItems,
  getBookings,
  getMyBookings,
  updateBookingToReturned,
} = require("../controllers/bookingController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").post(protect, addBookingItems).get(protect, admin, getBookings);
router.route("/mybookings").get(protect, getMyBookings);
router.route("/:id/return").put(protect, admin, updateBookingToReturned);

module.exports = router;
