/**
 * Mensimulasikan pembuatan kunci API atau token sesi.
 * @param {object} userData - Data pengguna dari proses login.
 * @returns {Promise<string>} Sebuah Promise yang akan resolve dengan kunci yang dihasilkan.
 */
export function generateKey(userData) {
    return new Promise((resolve) => {
        console.log(`Membuat kunci untuk pengguna: ${userData.username}...`);

        // Simulasi proses pembuatan kunci yang butuh waktu
        setTimeout(() => {
            const key = `SECRET_KEY_${userData.uid}_${Date.now()}`;
            console.log("Kunci berhasil dibuat.");
            resolve(key);
        }, 1000); // Simulasi delay 1 detik
    });
}