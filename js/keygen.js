// Module untuk generate key
export function generateKey(username) {
    return new Promise((resolve, reject) => {
        if (!username) {
            reject(new Error('Username diperlukan untuk generate key'));
            return;
        }

        // Simulasi proses generate key
        setTimeout(() => {
            const key = btoa(`${username}-${Date.now()}`);
            resolve({
                key: key,
                timestamp: new Date().toISOString()
            });
        }, 1500);
    });
}