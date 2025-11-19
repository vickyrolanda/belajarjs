const mysql = require('mysql2');

const dbconfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'belajarjs',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbconfig);

const promisePool = pool.promise();

const testConnection = async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('koneksi database berhasil');
        connection.release();
        return true;
    } catch (error) {
        console.error('koneksi database gagal:', error);
        return false;
    }
};

module.exports = {
    pool,
    promisePool,
    testConnection
};