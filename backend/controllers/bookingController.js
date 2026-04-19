const Booking = require("../models/Booking");
const Cloth = require("../models/Cloth");

const addBookingItems = async (req, res) => {
  try {
    const { clothId, totalPrice, startDate, endDate } = req.body;

    const cloth = await Cloth.findById(clothId);
    if (!cloth) {
      return res.status(404).json({ message: "Cloth not found" });
    }

    // Advanced Business Logic: Date Overlap query
    // A cloth cannot be booked if there is an existing booking where:
    // (Existing Start < New End) AND (Existing End > New Start)
    const overlappingBookings = await Booking.find({
      cloth: clothId,
      status: "booked",
      $and: [
        { startDate: { $lt: endDate } },
        { endDate: { $gt: startDate } }
      ]
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ message: "Item is already booked for these dates." });
    }

    const booking = new Booking({
      user: req.user._id,
      cloth: clothId,
      totalPrice,
      startDate,
      endDate,
      status: "booked",
    });

    const createdBooking = await booking.save();

    // Trigger Automated Email Notification
    const { sendBookingEmail } = require("../utils/mailer");
    sendBookingEmail(req.user.email, req.user.fullName, {
      itemTitle: cloth.title,
      startDate: booking.startDate,
      endDate: booking.endDate,
      totalPrice: booking.totalPrice,
      bookingId: createdBooking._id.toString().substring(18).toUpperCase(),
    });

    res.status(201).json(createdBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate("user", "id fullName").populate("cloth", "id title pricePerDay");
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("cloth");
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateBookingToReturned = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      booking.status = "returned";
      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  addBookingItems,
  getBookings,
  getMyBookings,
  updateBookingToReturned,
};
