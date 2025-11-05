// Module untuk autentikasi
export function checkLogin(username, password) {
    return new Promise((resolve, reject) => {
        // Simulasi pengecekan database dengan timeout
        setTimeout(() => {
            if (username === 'admin' && password.length >= 4) {
                resolve({
                    status: true,
                    message: 'Login berhasil',
                    username: username
                });
            } else {
                reject({
                    status: false,
                    message: 'Username atau password salah'
                });
            }
        }, 1000);
    });
}