const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Helper: Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Helper: Set Cookie (FIXED FOR VERCEL + RENDER)
const setCookie = (res, token) => {
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: true,       // CRITICAL: Tells browser it's HTTPS
    sameSite: 'none',   // CRITICAL: Allows Vercel to talk to Render
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// --- AUTH ACTIONS ---

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) return res.status(400).json({ error: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    const user = newUser.rows[0];
    setCookie(res, generateToken(user.id));
    res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ error: 'Server error during registration' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userQuery = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userQuery.rows.length === 0) return res.status(400).json({ error: 'Invalid email or password' });

    const user = userQuery.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    setCookie(res, generateToken(user.id));
    res.json({ 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone, 
        address: user.address, 
        profile_image: user.profile_image 
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error during login' });
  }
};

const logoutUser = (req, res) => {
  // FIXED: Kills the cookie instantly by setting the expiration date to the past
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    expires: new Date(0) 
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// --- PROFILE ACTIONS ---

const updateProfile = async (req, res) => {
  const { name, phone, address } = req.body;
  const userId = req.user.id;
  
  const profile_image = req.file ? `/uploads/${req.file.filename}` : req.body.profile_image;

  try {
    const updatedUser = await db.query(
      `UPDATE users 
       SET name = COALESCE($1, name), 
           phone = COALESCE($2, phone), 
           address = COALESCE($3, address), 
           profile_image = COALESCE($4, profile_image) 
       WHERE id = $5 
       RETURNING id, name, email, phone, address, profile_image`,
      [name, phone, address, profile_image, userId]
    );
    res.json(updatedUser.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error updating profile" });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await db.query("SELECT password_hash FROM users WHERE id = $1", [userId]);
    const isMatch = await bcrypt.compare(oldPassword, user.rows[0].password_hash);
    
    if (!isMatch) return res.status(400).json({ error: "Incorrect current password" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await db.query("UPDATE users SET password_hash = $1 WHERE id = $2", [hashedPassword, userId]);
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error changing password" });
  }
};

module.exports = { 
    registerUser, 
    loginUser, 
    logoutUser, 
    updateProfile, 
    changePassword 
};
