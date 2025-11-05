const promiseBtn = document.getElementById('promiseBtn');

function verifyUsernameAsync(username) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'admin') resolve({ user: 'admin' });
      else reject(new Error('❌ Username salah'));
    }, 400);
  });
}

function generateKeyAsync(user) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const key = 'KEY-' + Math.random().toString(36).substr(2, 8).toUpperCase();
      resolve(key);
    }, 400);
  });
}

function showReportAsync(key) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        owner: 'admin',
        earnings: 2500000
      });
    }, 400);
  });
}

promiseBtn.addEventListener('click', async () => {
  const username = document.getElementById('username').value;
  output.textContent = '⏳ Memproses (Promise)...';

  try {
    const user = await verifyUsernameAsync(username);
    const key = await generateKeyAsync(user.user);
    const report = await showReportAsync(key);

    output.textContent =
      `✅ Login Berhasil (Promise)\n` +
      `Key: ${key}\n` +
      `Laporan untuk: ${report.owner}\n` +
      `Penghasilan: Rp ${report.earnings.toLocaleString()}`;
  } catch (err) {
    output.textContent = err.message;
  }
});
