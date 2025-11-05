// auth.js - exports a login function that returns a Promise and optionally calls a callback
export function login(username, password, callback) {
  return new Promise((resolve, reject) => {
    // Simulate async validation (e.g., DB call)
    setTimeout(() => {
      // Requirement: identitas admin sebagai username
      if (username === 'admin') {
        const user = { username: 'admin', role: 'admin' };
        // Call callback only if provided
        if (typeof callback === 'function') callback(null, user);
        resolve(user);
        return;
      }

      // invalid user
      const err = new Error('Username salah. Hanya "admin" yang diterima.');
      if (typeof callback === 'function') callback(err);
      reject(err);
    }, 400);
  });
}
