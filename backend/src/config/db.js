const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'stockpilot',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : false,
});

const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`[db] MySQL connected successfully to ${process.env.DB_HOST || 'localhost'}/${process.env.DB_NAME || 'stockpilot'}`);
    connection.release();
  } catch (error) {
    console.error(`[db] Failed to connect to MySQL: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { pool, connectDB };
