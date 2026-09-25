const mysql = require('mysql2');
require('dotenv').config();

// Connection pool (better than a single connection for a real server:
// it reconnects automatically and handles concurrent requests safely)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'job_portal',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Fail fast with a clear message if the DB isn't reachable
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ MySQL connection error:', err.message);
    console.error('   Check your backend/.env file and make sure MySQL is running.');
  } else {
    console.log('✅ Connected to MySQL database:', process.env.DB_NAME || 'job_portal');
    connection.release();
  }
});

module.exports = pool.promise();
