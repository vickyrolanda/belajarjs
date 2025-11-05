// server.js (di root folder)

// 1. **DEKLARASI WAJIB EXPRESS** (Harus di Paling Atas)
const express = require('express');
const app = express(); // <-- Baris ini mendeklarasikan 'app'
const path = require('path'); 
const PORT = 3000; // Definisikan PORT

// 2. REQUIRE MODUL TUGAS (dari folder public)
const { loginUser } = require('./public/login'); 
const { generateKey } = require('./public/keyGenerator'); 
const { tampilkanLaporan } = require('./public/laporan'); 


// 3. MIDDLEWARE DAN SERVE STATIC FILES
// Middleware untuk melayani file dari folder public
app.use(express.static(path.join(__dirname, 'public')));


// 4. ENDPOINT TUGAS (Menggunakan 'app' yang sudah dideklarasikan)
app.get('/run-task', (req, res) => {
    // Jalankan logika tugas di sisi server
    
    let logs = []; // Untuk menyimpan log yang dikirim ke browser

    loginUser("admin", "adminpass", (error, username) => {
        if (error) {
            logs.push(`Error: ${error.message}`);
            return res.status(500).json({ status: 'failed', logs: logs });
        }
        logs.push(`Login Sukses untuk ${username}`);

        generateKey(username)
            .then((key) => {
                logs.push("Laporan berhasil diakses dan ditampilkan di console server.");
                tampilkanLaporan(key); // Ini akan mencetak di Terminal Server
                
                res.json({ status: 'success', logs: logs, key: key });
            })
            .catch((err) => {
                logs.push(`Error Key: ${err.message}`);
                res.status(500).json({ status: 'failed', logs: logs });
            });
    });
});


// 5. LISTENER (Menjalankan Server)
app.listen(PORT, () => {
    console.log(`Server Express berjalan di http://localhost:${PORT}`);
    console.log("Buka browser Anda dan navigasi ke alamat tersebut.");
});

// Pastikan baris app.get('/run-task', ...) berada SETELAH const app = express();