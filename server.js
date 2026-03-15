const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // NEW
require('dotenv').config();
const db = require('./config/db'); 

const app = express();

// UPDATED CORS: We must specify the frontend origin to allow secure cookies
app.use(cors({
  origin: [
    'http://localhost:5173', // Keep local for your own testing
    'https://wedding-frontend-flax.vercel.app' // Your live Vercel URL
  ],
  credentials: true 
}));

app.use(express.json()); 
app.use(cookieParser()); // NEW: Parses cookies into req.cookies

// Routes
const vendorRoutes = require('./routes/vendorRoutes');
const authRoutes = require('./routes/authRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes'); // NEW

app.use('/api/vendors', vendorRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/inquiries', inquiryRoutes); // NEW

app.get('/', (req, res) => {
  res.send('Wedding Services API is fully operational...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
