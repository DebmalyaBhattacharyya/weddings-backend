const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = (req, res, next) => {
  // Get token from the secure cookie
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token provided' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the user ID to the request
    next(); // Move to the next function
  } catch (err) {
    res.status(401).json({ error: 'Not authorized, token failed' });
  }
};

module.exports = { protect };