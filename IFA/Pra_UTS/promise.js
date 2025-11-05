// promise.js
export function generateKey() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const key = Math.random().toString(36).substring(2, 10).toUpperCase();
      if (key) resolve(key);
      else reject("Gagal membuat key.");
    }, 1000);
  });
}
