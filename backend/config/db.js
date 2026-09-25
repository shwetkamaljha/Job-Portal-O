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
  ssl: { rejectUnauthorized: false }, // Aiven requires SSL
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const promisePool = pool.promise();

// One-time auto-migration: creates the tables if they don't exist yet.
// Safe to run every time the server starts (CREATE TABLE IF NOT EXISTS).
async function ensureSchema() {
  try {
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('seeker', 'employer') NOT NULL DEFAULT 'seeker',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employer_id INT NOT NULL,
        title VARCHAR(150) NOT NULL,
        company VARCHAR(150) NOT NULL,
        location VARCHAR(150) NOT NULL,
        salary VARCHAR(50) DEFAULT NULL,
        job_type VARCHAR(50) DEFAULT 'Full-time',
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_id INT NOT NULL,
        user_id INT NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_application (job_id, user_id)
      )
    `);

    console.log('✅ Schema check complete: users, jobs, applications tables ready.');
  } catch (err) {
    console.error('❌ Failed to create tables:', err.message);
  }
}

// Fail fast with a clear message if the DB isn't reachable
pool.getConnection(async (err, connection) => {
  if (err) {
    console.error('❌ MySQL connection error:', err.message);
    console.error('   Check your backend/.env file and make sure MySQL is running.');
  } else {
    console.log('✅ Connected to MySQL database:', process.env.DB_NAME || 'job_portal');
    connection.release();
    await ensureSchema();
  }
});

module.exports = promisePool;




// const mysql = require('mysql2');
// require('dotenv').config();

// // Connection pool (better than a single connection for a real server:
// // it reconnects automatically and handles concurrent requests safely)
// const pool = mysql.createPool({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'job_portal',
//   port: process.env.DB_PORT || 3306,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// // Fail fast with a clear message if the DB isn't reachable
// pool.getConnection((err, connection) => {
//   if (err) {
//     console.error('❌ MySQL connection error:', err.message);
//     console.error('   Check your backend/.env file and make sure MySQL is running.');
//   } else {
//     console.log('✅ Connected to MySQL database:', process.env.DB_NAME || 'job_portal');
//     connection.release();
//   }
// });

// module.exports = pool.promise();
