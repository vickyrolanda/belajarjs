// report.js - validates key and returns report data (admin earnings)
export function getReport(key, user, callback) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const decoded = atob(key || '');
        const parts = decoded.split(':');
        const usernameInKey = parts[0];
        if (usernameInKey === user.username) {
          // Example earnings data
          const report = { earnings: 2500000, currency: 'IDR' };
          if (typeof callback === 'function') callback(null, report);
          resolve(report);
          return;
        }
        const err = new Error('Key tidak valid untuk user ini');
        if (typeof callback === 'function') callback(err);
        reject(err);
      } catch (e) {
        if (typeof callback === 'function') callback(e);
        reject(e);
      }
    }, 350);
  });
}
