const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
    registerUser, 
    loginUser, 
    logoutUser, 
    updateProfile, 
    changePassword 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// 1. Multer Storage Engine (Saves to backend/uploads/)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, "user-" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// 2. Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// 3. Profile & Security (Protected)
router.put('/update-profile', protect, upload.single('profile_image'), updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;