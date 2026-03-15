const db = require('../config/db');

// Create a new booking
exports.createBooking = async (req, res) => {
  const { package_name, addons, total_price, event_date, event_location } = req.body;
  const userId = req.user.id; // From protect middleware

  try {
    const newBooking = await db.query(
      "INSERT INTO bookings (user_id, package_name, addons, total_price, event_date, event_location) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [userId, package_name, addons, total_price, event_date, event_location]
    );
    res.status(201).json(newBooking.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

// Get bookings for the logged-in user
exports.getMyBookings = async (req, res) => {
  const userId = req.user.id;
  try {
    const bookings = await db.query("SELECT * FROM bookings WHERE user_id = $1 ORDER BY event_date DESC", [userId]);
    res.json(bookings.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};
// Get ALL bookings for the Admin Dashboard
exports.getAllBookings = async (req, res) => {
  try {
    const allBookings = await db.query(`
      SELECT b.*, u.name as client_name, u.email as client_email 
      FROM bookings b 
      JOIN users u ON b.user_id = u.id 
      ORDER BY b.created_at DESC
    `);
    res.json(allBookings.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch all bookings" });
  }
};