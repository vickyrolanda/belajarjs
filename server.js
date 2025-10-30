const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Simple in-memory check (demo only)
// For real apps, NEVER hardcode creds and ALWAYS hash passwords & use a DB.
const DEMO_USER = {
  username: 'user@example.com',
  password: 'password123'
};

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(200).json({ success: false, message: 'Username dan password wajib diisi.' });
  }

  // Simple match (case sensitive)
  if (username === DEMO_USER.username && password === DEMO_USER.password) {
    return res.status(200).json({ success: true, message: 'Login berhasil.' });
  }

  return res.status(200).json({ success: false, message: 'Login gagal. Periksa kembali kredensial Anda.' });
});

// Fallback to index.html for root
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
