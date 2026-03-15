const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const seedVendors = async () => {
  const vendors = [
    {
      business_name: 'Lumiere Studios',
      category: 'Photography',
      description: 'Award-winning wedding photography specializing in candid and cinematic shots.',
      price_range: '$2,000 - $5,000',
      location: 'New York, NY',
      cover_image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop'
    },
    {
      business_name: 'The Grand Estate',
      category: 'Venue',
      description: 'A luxurious 19th-century estate with breathtaking gardens for your perfect day.',
      price_range: '$10,000 - $25,000',
      location: 'Hudson Valley, NY',
      cover_image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop'
    },
    {
      business_name: 'Petals & Promises',
      category: 'Decor',
      description: 'Bespoke floral arrangements and venue styling that brings your vision to life.',
      price_range: '$1,500 - $4,000',
      location: 'Brooklyn, NY',
      cover_image_url: 'https://images.unsplash.com/photo-1521656693074-0ef32e80a5d5?q=80&w=1000&auto=format&fit=crop'
    },
    {
      business_name: 'Velvet Media',
      category: 'Videography',
      description: 'Cinematic wedding films that capture the emotion and magic of your celebration.',
      price_range: '$3,000 - $6,000',
      location: 'Manhattan, NY',
      cover_image_url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1000&auto=format&fit=crop'
    }
  ];

  try {
    console.log('Clearing old vendors...');
    await pool.query('DELETE FROM vendors');

    console.log('Inserting new vendors...');
    for (const vendor of vendors) {
      await pool.query(
        `INSERT INTO vendors (business_name, category, description, price_range, location, cover_image_url) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [vendor.business_name, vendor.category, vendor.description, vendor.price_range, vendor.location, vendor.cover_image_url]
      );
    }
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedVendors();