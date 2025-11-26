const express = require('express');
const path = require('path');
const session = require('express-session');
const { promisePool, testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Session middleware
app.use(session({
  secret: 'belajarjs-secret-key-2025', // Ganti dengan secret key yang lebih aman di production
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000, // 24 jam
    httpOnly: true
  }
}));

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware untuk cek apakah user sudah login
const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  next();
};

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
      
      // Simpan user ke session
      req.session.user = {
        id: user.id,
        username: user.username,
        name: user.name
      };
      
      return res.status(200).json({ 
        success: true, 
        message: `Login berhasil! Selamat datang, ${user.name}`,
        redirect: '/dashboard'
      });
    } else {
      return res.status(200).json({ 
        success: false, 
        message: 'Login gagal. Username atau password salah.' 
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

// Endpoint logout
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Gagal logout' });
    }
    res.json({ success: true, message: 'Logout berhasil' });
  });
});

// Endpoint untuk cek session (opsional)
app.get('/api/check-session', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// Route untuk dashboard (dilindungi)
app.get('/dashboard', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
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
