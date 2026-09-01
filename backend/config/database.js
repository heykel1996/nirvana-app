const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nirvana_mep',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : false,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000
});

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('[DB] ✅ Database connected successfully');
    console.log('[DB] Host:', process.env.DB_HOST);
    console.log('[DB] Database:', process.env.DB_NAME);
    connection.release();
  })
  .catch(err => {
    console.error('[DB] ❌ Database connection failed:', err.message);
  });

module.exports = pool;