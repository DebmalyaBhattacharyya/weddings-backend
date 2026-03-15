const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);

module.exports = router;
// ... existing imports
const { createBooking, getMyBookings, getAllBookings } = require('../controllers/bookingController');

// Add this line (In a real app, you'd add 'isAdmin' middleware here too)
router.get('/admin/all', getAllBookings); 

module.exports = router;