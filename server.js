const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Setup Database
const db = new Database('login.db');

// Buat tabel users jika belum ada
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

// Insert data demo jika tabel masih kosong
const countUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
if (countUsers.count === 0) {
  const insert = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
  insert.run('user@example.com', 'password123');
  insert.run('admin@example.com', 'admin123');
  console.log('Data demo berhasil ditambahkan ke database');
}

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(200).json({ success: false, message: 'Username dan password wajib diisi.' });
  }

  // Cek data di database
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);

  if (user) {
    return res.status(200).json({ success: true, message: 'Login berhasil.' });
  }

  return res.status(200).json({ success: false, message: 'Login gagal. Username atau password salah.' });
});

// Fallback to index.html for root
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
