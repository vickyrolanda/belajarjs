/**
 * Mensimulasikan proses login ke server.
 * @param {string} username - Username yang dimasukkan pengguna.
 * @returns {Promise<object>} Sebuah Promise yang akan resolve dengan data pengguna jika berhasil,
 * atau reject dengan pesan error jika gagal.
 */
export function login(username) {
  return new Promise((resolve, reject) => {
    console.log("Mengautentikasi pengguna...");

    // Simulasi panggilan jaringan yang butuh waktu
    setTimeout(() => {
      if (username === "admin") {
        console.log("Autentikasi berhasil.");
        // Jika berhasil, penuhi Promise dengan data pengguna
        resolve({ uid: "xyz123", username: "admin" });
      } else {
        console.log("Autentikasi gagal.");
        // Jika gagal, tolak Promise dengan pesan error
        reject("Username salah. Silakan coba lagi.");
      }
    }, 1500); // Simulasi delay 1.5 detik
  });
}