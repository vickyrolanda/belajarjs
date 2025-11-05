// report.js
/**
 * Fungsi untuk menampilkan laporan penghasilan admin.
 * Ini adalah bagian dari implementasi Module System.
 * * @param {string} key - Key yang tergenerate dari proses login.
 * @returns {Promise<string>} - Promise yang resolve dengan hasil laporan.
 */
function getAdminReport(key) {
    return new Promise((resolve, reject) => {
        console.log("-> 📊 Tahap 3: Menjalankan Fungsi Laporan...");
        
        if (key && key.startsWith("ADMIN_KEY")) {
            setTimeout(() => {
                const penghasilan = "Rp 50.000.000,-";
                const laporan = `Penghasilan Admin saat ini: **${penghasilan}**`;
                resolve(laporan);
            }, 500);
        } else {
            reject(new Error("Key tidak valid! Laporan tidak bisa diakses."));
        }
    });
}

// Export fungsi laporan
module.exports = {
    getAdminReport: getAdminReport
};