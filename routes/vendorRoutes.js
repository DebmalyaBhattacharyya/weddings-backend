const express = require('express');
const router = express.Router();
const { getAllVendors, getVendorById } = require('../controllers/vendorController');

// Route to get all vendors
router.get('/', getAllVendors);

// Route to get a specific vendor by ID
router.get('/:id', getVendorById);

module.exports = router;