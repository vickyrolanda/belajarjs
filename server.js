const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const { promisePool, testConnection } = require('./config/database');

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(200).json({ success: false, message: 'Username dan password wajib diisi' });
  }

  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

  if (rows.length > 0) {
    const user = rows[0];
    return res.status(200).json({
      success: true,
      message: `Login berhasil! Selamat datang, ${user.username}.`
    });
  } else {
    return res.status(200).json({
      success: false,
      message: 'Login gagal! Username atau password salah.'
    });
  }
  } catch (error) {
    console.error('Database error', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server. Silakan coba lagi.'
    });
  }
});

app.get('', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); 
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    testConnection();
});