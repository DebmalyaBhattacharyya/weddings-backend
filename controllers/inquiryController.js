const db = require('../config/db');

// Submit a new inquiry (Contact Form)
const createInquiry = async (req, res) => {
  const { vendor_id, event_date, message } = req.body;
  const user_id = req.user.id; // Comes from our auth middleware!

  try {
    const newInquiry = await db.query(
      'INSERT INTO inquiries (user_id, vendor_id, event_date, message) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, vendor_id, event_date, message]
    );
    res.status(201).json(newInquiry.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
};

// Get inquiries for the logged-in user's dashboard
const getUserInquiries = async (req, res) => {
  const user_id = req.user.id;

  try {
    // JOIN to get vendor details along with the inquiry
    const result = await db.query(
      `SELECT i.id, i.event_date, i.message, i.status, i.created_at, 
              v.business_name, v.category 
       FROM inquiries i 
       JOIN vendors v ON i.vendor_id = v.id 
       WHERE i.user_id = $1 
       ORDER BY i.created_at DESC`,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
};

module.exports = { createInquiry, getUserInquiries };