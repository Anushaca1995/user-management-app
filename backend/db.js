const sql = require('mssql');
require('dotenv').config();  


const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true', 
    trustServerCertificate: process.env.DB_TRUST_CERTIFICATE === 'true'
  }
};


const connectToDb = async () => {
  try {
    await sql.connect(dbConfig);
    console.log('Connected to the database!');
  } catch (err) {
    console.error('Error connecting to the database', err);
  }
};

module.exports = { connectToDb, sql };
