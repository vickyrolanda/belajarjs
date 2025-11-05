/**
 * Contoh Penerapan Callback
 */
function prosesLoginCallback(username, password, callback) {
  console.log("Proses 1: Mencoba Login menggunakan Callback...");

  // Simulasi operasi asinkron (misalnya, cek ke database)
  setTimeout(() => {
    const USER_BENAR = "admin";

    if (username === USER_BENAR && password === "12345") {
      // Panggil callback dengan error null (berhasil)
      console.log(`✅ Login BERHASIL untuk user: ${username}`);
      callback(null, { userId: username, token: "key-sementara-abc" });
    } else {
      // Panggil callback dengan objek Error (gagal)
      console.log(`❌ Login GAGAL untuk user: ${username}`);
      callback(new Error("Username atau password salah"), null);
    }
  }, 1000); // Penundaan 1 detik
}

// --- Contoh Penggunaan Callback ---
// prosesLoginCallback("admin", "12345", (error, data) => {
//     if (error) {
//         console.error(`🚨 Error: ${error.message}`);
//         return;
//     }
//     console.log(`🔑 Data diterima setelah login:`, data);
// });
