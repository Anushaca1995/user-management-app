const sql = require('mssql');
require('dotenv').config();  // Load environment variables from .env file

// Database connection configuration from .env
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true', // Convert string 'true' to boolean true
    trustServerCertificate: process.env.DB_TRUST_CERTIFICATE === 'true'
  }
};

// Function to connect to the database
const connectToDb = async () => {
  try {
    await sql.connect(dbConfig);
    console.log('Connected to the database!');
  } catch (err) {
    console.error('Error connecting to the database', err);
  }
};

module.exports = { connectToDb, sql };
