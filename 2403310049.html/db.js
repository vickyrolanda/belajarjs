// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'yogi' // HARUS 'yogi'
});

connection.connect(error => {
  if (error) {
    console.error('Gagal terhubung ke database MySQL:', error.stack);
    process.exit(1);
  }
  console.log('Berhasil terhubung ke database MySQL (phpMyAdmin) dengan ID koneksi:', connection.threadId);
});

module.exports = connection;