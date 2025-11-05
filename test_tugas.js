// test_tugas.js (Harus di ROOT FOLDER)

// WAJIB: Memanggil modul dari dalam folder 'public'
const { loginUser } = require('./public/login'); 
const { generateKey } = require('./public/keyGenerator'); 
const { tampilkanLaporan } = require('./public/laporan'); 

console.log("--- START: TEST TUGAS CALLBACK, PROMISE, MODUL SYSTEM ---");

// 1. Panggil Fungsi Login (Callback)
loginUser("admin", "adminpass", (error, username) => {
    if (error) {
        console.error(error.message);
        return; 
    }
    
    // 2. Jika Callback sukses, lanjutkan ke Promise (generateKey)
    generateKey(username)
        .then((key) => {
            // 3. Jika Promise resolve, jalankan Modul Laporan (tampilkanLaporan)
            tampilkanLaporan(key);
        })
        .catch((err) => {
            console.error(err.message);
        });
});