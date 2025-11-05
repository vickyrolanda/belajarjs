// main.js - Penerapan Skenario Login
// Impor modul yang diperlukan
const auth = require('./auth');
const report = require('./report');

const TARGET_USERNAME = "admin"; // Identitas sesuai petunjuk soal

console.log("--- START: Skenario Login Admin ---");

// Rantai Promise: auth.login -> report.getAdminReport
auth.login(TARGET_USERNAME)
    .then(key => {
        // Setelah login sukses dan key tergenerate (Tahap 1 & 2),
        // lanjutkan ke fungsi laporan
        return report.getAdminReport(key); 
    })
    .then(hasilLaporan => {
        // Laporan sukses dijalankan (Tahap 3)
        console.log("--- Skenario Sukses Selesai ---");
        console.log(`\nHasil Akhir Laporan: ${hasilLaporan}`);
    })
    .catch(error => {
        // Tangani jika ada kegagalan di tahap manapun
        console.log("--- Skenario Gagal ---");
        console.error(`\nERROR: ${error.message}`);
    });