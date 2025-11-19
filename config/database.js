const mysql = require('mysql2');

// Konfigurasi database
const dbConfig = {
  host: 'localhost',   
  user: 'root',          
  password: '',          
  database: 'belajarjs',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Buat connection pool
const pool = mysql.createPool(dbConfig);

// Promisify pool untuk async/await
const promisePool = pool.promise();

// Test koneksi database
const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('Koneksi database berhasil!');
    connection.release();
    return true;
  } catch (error) {
    console.error('Koneksi database gagal:', error.message);
    return false;
  }
};

module.exports = {
  pool,
  promisePool,
  testConnection
};