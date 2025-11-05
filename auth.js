function verifikasiUsername(username, callback) {
  console.log("Memverifikasi username...");
  
  // Simulasi proses asynchronous
  setTimeout(() => {
    if (username === "admin") {
      callback(null, { 
        success: true, 
        message: "Username valid",
        username: username 
      });
    } else {
      callback(new Error("Username tidak valid. Gunakan 'admin'"), null);
    }
  }, 1000);
}

/**
 * 2. PROMISE - Generate Key
 * Fungsi untuk generate key setelah username terverifikasi
 */
function generateKey(username) {
  console.log("Generating key untuk user:", username);
  
  return new Promise((resolve, reject) => {
    // Simulasi proses asynchronous
    setTimeout(() => {
      if (username === "admin") {
        const key = Math.random().toString(36).substring(2, 15) + 
                     Math.random().toString(36).substring(2, 15);
        resolve({
          success: true,
          key: key,
          timestamp: new Date().toISOString()
        });
      } else {
        reject(new Error("Gagal generate key: username tidak valid"));
      }
    }, 1000);
  });
}

/**
 * 3. MODULE SYSTEM - Fungsi Laporan
 * Export fungsi untuk menampilkan laporan penghasilan
 */
function tampilkanLaporan(key) {
  console.log("Mengakses laporan dengan key:", key);
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (key) {
        const laporan = {
          admin: "admin",
          penghasilan: [
            { bulan: "Januari", nominal: 15000000 },
            { bulan: "Februari", nominal: 18000000 },
            { bulan: "Maret", nominal: 16500000 },
            { bulan: "April", nominal: 20000000 }
          ],
          total: 69500000,
          timestamp: new Date().toISOString()
        };
        resolve(laporan);
      } else {
        reject(new Error("Key tidak valid"));
      }
    }, 1000);
  });
}

// Export modules
export { verifikasiUsername, generateKey, tampilkanLaporan };