const output = document.getElementById('output');
const callbackBtn = document.getElementById('callbackBtn');

function verifyUsername(username, cb) {
  setTimeout(() => {
    if (username === 'admin') cb(null, { user: 'admin' });
    else cb(new Error('❌ Username salah'));
  }, 500);
}

function generateKey(user, cb) {
  setTimeout(() => {
    const key = 'KEY-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    cb(null, key);
  }, 500);
}

function showReport(key, cb) {
  setTimeout(() => {
    const report = {
      owner: 'admin',
      earnings: 1750000
    };
    cb(null, report);
  }, 500);
}

callbackBtn.addEventListener('click', () => {
  const username = document.getElementById('username').value;
  output.textContent = '⏳ Memproses (Callback)...';

  verifyUsername(username, (err, userRes) => {
    if (err) return (output.textContent = err.message);
    generateKey(userRes.user, (err2, key) => {
      if (err2) return (output.textContent = '❌ Gagal generate key');
      showReport(key, (err3, report) => {
        if (err3) return (output.textContent = '❌ Gagal menampilkan laporan');
        output.textContent =
          `✅ Login Berhasil (Callback)\n` +
          `Key: ${key}\n` +
          `Laporan untuk: ${report.owner}\n` +
          `Penghasilan: Rp ${report.earnings.toLocaleString()}`;
      });
    });
  });
});
