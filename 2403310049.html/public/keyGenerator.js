// public/keyGenerator.js
const generateKey = (username) => {
    return new Promise((resolve, reject) => {
        console.log("Memulai proses pembuatan Key...");
        
        setTimeout(() => {
            if (username === "admin") {
                const secretKey = Math.random().toString(36).substring(2, 10).toUpperCase();
                console.log(`Key berhasil tergenerate.`);
                resolve(secretKey); // Resolve Promise
            } else {
                reject(new Error("Gagal generate Key: Bukan Admin.")); // Reject Promise
            }
        }, 1500);
    });
};

// **WAJIB:** Eksport fungsi menggunakan CommonJS
module.exports = { generateKey };