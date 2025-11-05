// callback_demo.js
function loginCallback(username, cb) {
    setTimeout(() => {
        if (username === "admin") {
            cb(null, "ADMIN_KEY_12345");
        } else {
            cb(new Error("Login gagal!"), null);
        }
    }, 1000);
}

function laporanCallback(key, cb) {
    if (key && key.startsWith("ADMIN_KEY")) {
        cb(null, "Laporan Penghasilan: Rp 50.000.000,-");
    } else {
        cb(new Error("Key invalid!"), null);
    }
}

// Penggunaan (Callback Hell/Pyramid of Doom)
loginCallback("admin", (err, key) => {
    if (err) {
        console.error("Callback Login Gagal:", err.message);
        return;
    }
    console.log("Callback Login Sukses, Key:", key);
    
    laporanCallback(key, (errLaporan, hasil) => {
        if (errLaporan) {
            console.error("Callback Laporan Gagal:", errLaporan.message);
            return;
        }
        console.log("Callback Laporan Sukses:", hasil);
    });
});