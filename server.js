const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const { promisePool, testConnection } = require('./config/database');
const session = require('express-session');

app.use(express.json());

app.use(session({
  secret: 'belajarjs-secret-key-2025',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}));

app.use(express.static(path.join(__dirname, 'public')));

const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  next();
};

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

    req.session.user = {
      id: user.id,
      username: user.username,
      name: user.name
    };

    return res.status(200).json({
      success: true,
      message: `Login berhasil! Selamat datang, ${user.username}.`,
      redirect: '/dashboard'
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

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Gagal logout' });
    }
    res.json({ success: true, message: 'Logout berhasil' });
  });
});

app.get('/api/check-session', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

app.get('/dashboard', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); 
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    testConnection();
});