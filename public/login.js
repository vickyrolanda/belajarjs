// public/login.js
function loginUser(username, password, callback) {
    console.log(`\n➡️ Mencoba login dengan username: ${username}`);
    
    // Simulasi Asinkron login (1 detik)
    setTimeout(() => {
        if (username === "admin" && password === "adminpass") {
            console.log("✅ Login Admin Berhasil.");
            callback(null, username); // Sukses
        } else {
            callback(new Error("❌ Login Gagal: Username atau Password salah."), null); // Gagal
        }
    }, 1000);
}

// **WAJIB:** Eksport fungsi menggunakan CommonJS
module.exports = { loginUser };