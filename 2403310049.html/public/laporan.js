// public/laporan.js
function tampilkanLaporan(key) {
    if (key) {
        // Simulasi data laporan
        const penghasilan = Math.floor(Math.random() * 10000000) + 5000000;
        console.log("\n--- Laporan Penghasilan Admin (Modul System) ---");
        console.log(`Key Akses: ${key}`);
        console.log(`Penghasilan Bulan Ini: Rp ${penghasilan.toLocaleString('id-ID')}`);
        console.log("-------------------------------------------------");
    } else {
        console.error("Akses Laporan Ditolak: Key tidak valid.");
    }
}

// **WAJIB:** Eksport fungsi menggunakan CommonJS
module.exports = { tampilkanLaporan };