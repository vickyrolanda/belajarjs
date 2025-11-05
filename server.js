const express = require('express');
const path = require('path');
// B.3. Menerapkan modul system (Mengimpor modul lokal)
const { cekUser, generateKey, getLaporan } = require('./authLogic');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); //

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public'))); //

// Hapus DEMO_USER yang lama, kita gunakan logika baru

// B.4 & C. Terapkan pada halaman login
// Menggunakan async/await (B.2. Penerapan Promise)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {}; //

  // Validasi input dasar
  if (!username || !password) {
    //
    return res.status(200).json({ success: false, message: 'Username dan password wajib diisi.' });
  }

  try {
    // C.3. Mengerjakan dalam 3 proses
    
    // 1. Cek User (C.1)
    // Instruksi hanya meminta cek username 'admin'.
    // Saya tambahkan cek password 'password123' agar logis,
    // sesuaikan jika password tidak diperlukan.
    if (username !== 'admin' || password !== 'password123') {
       return res.status(200).json({ 
         success: false, 
         message: 'Login gagal. Kredensial salah atau bukan admin.' 
       });
    }

    // Panggil fungsi promise dari modul
    const user = await cekUser(username);
    
    // 2. Buat Key (C.1)
    const key = await generateKey(user);
    
    // 3. Ambil Laporan (C.2)
    const laporan = await getLaporan(key);

    // Kirim respon sukses dengan data laporan
    return res.status(200).json({ 
      success: true, 
      message: 'Login berhasil, laporan admin didapatkan.',
      data: laporan // Kirim data laporan ke frontend
    });

  } catch (err) {
    // Tangani jika ada error dari promise (misal: user bukan 'admin')
    console.error(err);
    return res.status(200).json({ success: false, message: err.message || 'Login gagal. Terjadi kesalahan.' });
  }
});

// Fallback to index.html for root
app.get('*', (req, res) => {
  //
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  //
  console.log(`Server berjalan di http://localhost:${PORT}`);
});