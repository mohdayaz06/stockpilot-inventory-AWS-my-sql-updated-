const fs = require('fs');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl:
    process.env.DB_SSL === 'true'
      ? {
          ca: fs.readFileSync('/etc/ssl/certs/rds/global-bundle.pem'),
          rejectUnauthorized: true,
        }
      : false,
});

const connectDB = async () => {
  const connection = await pool.getConnection();
  console.log(`[db] Connected to ${process.env.DB_HOST}/${process.env.DB_NAME}`);
  connection.release();
};

module.exports = { pool, connectDB };
