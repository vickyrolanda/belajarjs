const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const DEMO_USER = {
  username: 'admin',
  password: '123'
};

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username dan password wajib diisi'
    });
  }

  if (username === DEMO_USER.username && password === DEMO_USER.password) {
    return res.json({
      success: true,
      message: 'Login berhasil'
    });
  } else {
    return res.status(401).json({
      success: false,
      message: 'Kredensial tidak valid'
    });
  }
});

function showReport(username) {

  return `Laporan untuk ${username}: Pendapatan bulan ini Rp 25.000.000. Semua sistem berjalan lancar ✅`;
}

app.get('/api/report', (req, res) => {
  const { username, key } = req.query;

  if (!username || !key) {
    return res.status(400).json({
      success: false,
      message: 'Data tidak lengkap'
    });
  }

  const report = showReport(username);
  res.json({
    success: true,
    report
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
