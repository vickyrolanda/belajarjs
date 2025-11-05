// keygen.js - generates a key for a user and returns a Promise
export function generateKey(user, callback) {
  return new Promise((resolve) => {
    // Simulate async key generation
    setTimeout(() => {
      // Simple key: base64 of username + timestamp
      const payload = `${user.username}:${Date.now()}`;
      const key = btoa(payload);
      if (typeof callback === 'function') callback(key);
      resolve(key);
    }, 700);
  });
}
