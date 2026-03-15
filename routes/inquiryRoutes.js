const express = require('express');
const router = express.Router();
const { createInquiry, getUserInquiries } = require('../controllers/inquiryController');
const { protect } = require('../middleware/authMiddleware');

// Both routes require the user to be logged in
router.post('/', protect, createInquiry);
router.get('/my-inquiries', protect, getUserInquiries);

module.exports = router;