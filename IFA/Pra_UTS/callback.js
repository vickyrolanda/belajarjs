// callback.js
export function login(username, callback) {
  setTimeout(() => {
    if (username === "Admin") {
      callback(null, true);
    } else {
      callback("❌ Username salah! Harus 'Admin'.", false);
    }
  }, 1000);
}
