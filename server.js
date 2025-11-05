const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk memparsing body JSON dari request
app.use(express.json());
// Middleware untuk menyajikan file statis dari direktori 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Data pengguna dummy (seharusnya di database)
const DEMO_USER = {
  username: 'admin@gmail.com',
  password: 'password123',
};

/**
 * Simulasi Proses 1: Memverifikasi kredensial pengguna
 * @param {string} username
 * @param {string} password
 * @returns {Promise<string>} Username jika berhasil
 */
function prosesLogin(username, password) {
  console.log('Proses 1: Memeriksa username dan password...');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        username === DEMO_USER.username &&
        password === DEMO_USER.password
      ) {
        resolve(username); 
      } else {
        reject('Username atau password salah');
      }
    }, 500); 
  });
}

/**
 * Simulasi Proses 2: Membuat key rahasia
 * @param {string} username
 * @returns {Promise<string>} Key rahasia
 */
function generateKey(username) {
  console.log('Proses 2: Membuat key...');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === DEMO_USER.username) {
        // FIX: Menggunakan backtick (`) untuk template literal
        const key = `KEY_RAHASIA_UNTUK_${username}`; 
        resolve(key);
      } else {
        reject('Gagal membuat key, user tidak dikenal');
      }
    }, 500);
  });
}

/**
 * Simulasi Proses 3: Mengambil data laporan
 * @param {string} key
 * @returns {Promise<string>} Laporan penghasilan
 */
function getReport(key) {
  console.log('Proses 3: Mengambil laporan penghasilan...');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (key.startsWith('KEY_RAHASIA_UNTUK_')) {
        const report = 'Penghasilan Admin: Rp 10.000.000';
        resolve(report);
      } else {
        reject('Key tidak valid, akses ditolak!');
      }
    }, 500);
  });
}

// Endpoint POST untuk login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'Username dan password wajib di isi' });
  }

  try {
    // Rantai proses asinkron
    const user = await prosesLogin(username, password);
    const key = await generateKey(user);
    const report = await getReport(key);
    
    res.status(200).json({
      success: true,
      message: 'Login Berhasil!', 
      report: report             
    });

  } catch (error) {
    console.error('Proses login gagal:', error);
    // Pastikan error yang dikirim ke klien adalah string
    res.status(401).json({ success: false, message: String(error) });
  }
});

// Endpoint GET untuk menyajikan halaman utama (index.html)
app.get('/', (req, res) => {
  // Asumsi ada file public/index.html
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Jalankan server
app.listen(PORT, () => {
  // FIX: Menggunakan backtick (`) untuk template literal
  console.log(`Server berjalan di http://localhost:${PORT}`);
});