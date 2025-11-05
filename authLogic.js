// File: authLogic.js
// (Penerapan Soal B.2. Promise)

// C.1. Gunakan identitas "admin"
function cekUser(username) {
  console.log("Mengecek user...");
  return new Promise((resolve, reject) => {
    setTimeout(() => { // Simulasi proses async
      if (username === 'admin') {
        console.log("User 'admin' terverifikasi.");
        resolve({ id: 1, user: 'admin' });
      } else {
        reject(new Error('Hanya "admin" yang diizinkan.'));
      }
    }, 500);
  });
}

// C.1. ...jalankan proses selanjutnya buat key.
function generateKey(user) {
  console.log("Membuat key untuk:", user.user);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const key = `KEY-${user.id}-${Date.now()}`;
      console.log("Key terbuat:", key);
      resolve(key);
    }, 500);
  });
}

// C.2. ...ijinkan fungsi laporan dijalankan...
function getLaporan(key) {
  console.log("Mendapatkan laporan dengan key...");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // C.2. ...isi fungsi laporan untuk menampilkan penghasilan dari admin.
      const laporan = {
        dibuat: new Date().toISOString(),
        penghasilan: 1000000,
        user: 'admin',
        message: "Ini adalah penghasilan dari admin."
      };
      console.log("Laporan didapatkan.");
      resolve(laporan);
    }, 500);
  });
}

// B.3. Penerapan modul system (Mengekspor fungsi)
module.exports = {
  cekUser,
  generateKey,
  getLaporan
};