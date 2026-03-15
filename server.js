const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const db = require('./config/db'); 

const app = express();

// PERFECT CORS: This allows Vercel to log in securely
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://wedding-frontend-flax.vercel.app' 
  ],
  credentials: true 
}));

app.use(express.json()); 
app.use(cookieParser());

// CRITICAL FIX: This allows your frontend to see the profile images
app.use('/uploads', express.static('uploads'));

// Routes
const vendorRoutes = require('./routes/vendorRoutes');
const authRoutes = require('./routes/authRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const bookingRoutes = require('./routes/bookingRoutes'); // ADDED: Bookings Route

app.use('/api/vendors', vendorRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/bookings', bookingRoutes); // ADDED: Bookings URL path

app.get('/', (req, res) => {
  res.send('Wedding Services API is fully operational...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
