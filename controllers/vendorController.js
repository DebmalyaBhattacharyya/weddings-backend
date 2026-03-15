const db = require('../config/db');

const getAllVendors = async (req, res) => {
  try {
    // Pagination logic
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await db.query(
      'SELECT * FROM vendors ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    // Get total count for frontend pagination math
    const countResult = await db.query('SELECT COUNT(*) FROM vendors');
    const totalVendors = parseInt(countResult.rows[0].count);

    res.json({
      vendors: result.rows,
      totalPages: Math.ceil(totalVendors / limit),
      currentPage: page
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error while fetching vendors' });
  }
};

const getVendorById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM vendors WHERE id = $1', [id]);
    
    if (result.rows.length === 0) return res.status(404).json({ error: 'Vendor not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error while fetching vendor' });
  }
};

module.exports = { getAllVendors, getVendorById };