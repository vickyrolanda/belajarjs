function cekLogin(username) {
    return username.toLowerCase() === 'admin';
}

function generateKeyCallback(username, callback) {
    setTimeout(() => {
        const key = `KEY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        callback(null, key); 
    }, 1000);
}

function tampilkanLaporanPromise(key) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (key.startsWith('KEY-')) {
                const penghasilan = Math.floor(Math.random() * 50000000);
                const laporan = {
                    key: key,
                    penghasilan: `Rp${penghasilan.toLocaleString('id-ID')}`
                };
                resolve(laporan); 
            } else {
                reject(new Error("Key tidak valid untuk otorisasi laporan."));
            }
        }, 1500);
    });
}

export { cekLogin, generateKeyCallback, tampilkanLaporanPromise };