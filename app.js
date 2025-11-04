const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// Ini akan menyajikan SEMUA file di dalam folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

const DEMO_USER = {
  username: 'admin@gmail.com',
  password: 'password123'
};

// Ini adalah API endpoint Anda
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi' });
  }

  if (username === DEMO_USER.username && password === DEMO_USER.password) {
    res.status(200).json({ success: true, message: 'Login berhasil' });
  } else {
    res.status(401).json({ success: false, message: 'Username atau password salah' });
  }
});

// Rute ini sekarang ditangani oleh express.static
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});