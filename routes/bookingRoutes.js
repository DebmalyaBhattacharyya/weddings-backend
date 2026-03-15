const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Import all controller functions exactly ONCE
const { createBooking, getMyBookings, getAllBookings } = require('../controllers/bookingController');

// --- ROUTES ---

// 1. Create a new booking (Must be logged in)
router.post('/', protect, createBooking);

// 2. Get my personal bookings (Must be logged in)
router.get('/my-bookings', protect, getMyBookings);

// 3. Get ALL bookings (Admin only - for the dashboard)
router.get('/admin/all', getAllBookings); 

// Export the router exactly ONCE at the very bottom
module.exports = router;
