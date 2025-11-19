const express = require('express');
const path = require('path');
const { promisePool, testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Login endpoint dengan database MySQL
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(200).json({ success: false, message: 'Username dan password wajib diisi.' });
  }

  try {
    // Query user dari database
    const [rows] = await promisePool.execute(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

    if (rows.length > 0) {
      const user = rows[0];
      return res.status(200).json({ 
        success: true, 
        message: `Login berhasil! Selamat datang, ${user.username}` 
      });
    } else {
      return res.status(200).json({ 
        success: false, 
        message: 'Login gagal. Email atau password salah.' 
      });
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan server. Silakan coba lagi.' 
    });
  }
});

// Fallback to index.html for root
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, async () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  
  // Test koneksi database saat server start
  await testConnection();
});
