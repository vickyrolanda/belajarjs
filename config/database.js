const mysql = require('mysql2');

// Konfigurasi database dikembangkan untuk projek Task and Journal Organizer
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'task_journal_db', // Nama database diubah agar sesuai dengan projek
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Buat connection pool
const pool = mysql.createPool(dbConfig);

// Promisify pool untuk menggunakan fitur async/await pada server.js
const promisePool = pool.promise();

// Fungsi test koneksi yang dipanggil saat server start
const testConnection = async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('Koneksi Database TaskJournal Berhasil!');
        connection.release();
        return true;
    } catch (error) {
        console.error('Koneksi Database Gagal:', error.message);
        console.log('Pastikan MySQL sudah jalan dan database "task_journal_db" sudah dibuat.');
        return false;
    }
};

module.exports = { pool, promisePool, testConnection };