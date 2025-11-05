// auth.js
/**
 * Fungsi untuk simulasi proses login dengan username "admin".
 * Ini adalah bagian dari implementasi Module System.
 * * @param {string} username - Username yang dimasukkan.
 * @returns {Promise<string>} - Promise yang resolve dengan key jika sukses, 
 * atau reject dengan error jika gagal.
 */
function login(username) {
    return new Promise((resolve, reject) => {
        console.log("-> 🔑 Tahap 1: Memulai Otentikasi...");
        
        // Simulasi jeda waktu atau panggilan API
        setTimeout(() => {
            if (username === "admin") {
                const key = "ADMIN_KEY_12345"; // Key yang tergenerate
                console.log(`-> ✅ Tahap 2: Pengguna "${username}" berhasil login & Key tergenerate.`);
                resolve(key);
            } else {
                reject(new Error("Username salah! Akses ditolak."));
            }
        }, 1000); // Jeda 1 detik
    });
}

// Export fungsi login agar dapat digunakan di main.js
module.exports = {
    login: login
};