const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const DEMO_USER = {
  username: 'admin@gmail.com',
  password: 'password123'
};

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};

  // Jika salah satu kosong
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password wajib di isi' });
  }

  // Cek benar
  if (username === DEMO_USER.username && password === DEMO_USER.password) {
    return res.status(200).json({ success: true, message: 'Login berhasil' });
  }

  // Salah
  res.status(401).json({ success: false, message: 'Username atau password salah' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // ✅ BENER
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
