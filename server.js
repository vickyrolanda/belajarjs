const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Middleware untuk menyajikan file statis (HTML, CSS, client-side JS)
// Express akan secara otomatis mencari 'index.html' di direktori ini.
app.use(express.static(path.join(__dirname, 'public')));

// Jalankan server
app.listen(port, () => {
  console.log(`Server Express berjalan di http://localhost:${port}`);
  console.log("Buka browser Anda dan navigasi ke alamat tersebut.");
});