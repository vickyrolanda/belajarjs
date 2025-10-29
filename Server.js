const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DEMO_USER = {
  username: 'admin@gmail.com',
  password: 'password123'
};

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password wajib diisi' });
  }

  if (username === DEMO_USER.username && password === DEMO_USER.password) {
    return res.json({ message: 'Login berhasil' });
  } else {
    return res.status(401).json({ message: 'Kredensial tidak valid' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});