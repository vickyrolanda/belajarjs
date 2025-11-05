/**
 * Mensimulasikan pengambilan laporan yang dilindungi.
 * @param {string} apiKey - Kunci yang didapat setelah login berhasil.
 * @returns {Promise<string>} Sebuah Promise yang resolve dengan data laporan.
 */
export function getLaporan(apiKey) {
    return new Promise((resolve, reject) => {
        console.log("Mengambil data laporan...");
        if (!apiKey) {
            return reject("Akses ditolak. Kunci tidak valid.");
        }

        // Simulasi pengambilan data dari server
        setTimeout(() => {
            const penghasilan = "Rp 50.000.000";
            console.log("Laporan berhasil didapatkan.");
            resolve(`Laporan Penghasilan Bulan Ini: ${penghasilan}`);
        }, 800);
    });
}