const { Pool } = require('pg');
require('dotenv').config();

// Create a new PostgreSQL pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Function to query the PostgreSQL database
async function query(text, params) {
  const start = Date.now();
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    const duration = Date.now() - start;
    //console.log('Executed query:', { text, duration, rows: res.rowCount });
    return res;
  } finally {
    client.release(); // Release the client back to the pool
  }
}

module.exports = {
  query
};
