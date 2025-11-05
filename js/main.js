import { login } from './auth.js';
import { generateKey } from './keygen.js';
import { getReport } from './report.js';

const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const logEl = document.getElementById('log');
const controls = document.getElementById('controls');
const reportBtn = document.getElementById('reportBtn');

let currentUser = null;
let currentKey = null;

function setLog(msg) {
  logEl.textContent = msg;
}

loginForm.addEventListener('submit', (ev) => {
  ev.preventDefault();
  setLog('Memproses login...');
  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  // Demonstrate: login returns Promise AND will call callback only when invoked
  login(username, password, (err, user) => {
    // This callback runs only when login decides to call it
    if (err) {
      console.warn('callback login error', err);
      return;
    }
    console.log('callback login success', user);
  })
    .then((user) => {
      currentUser = user;
      setLog('Login berhasil untuk ' + user.username + '. Membuat key...');

      // Generate key (returns Promise) and pass a callback that will only run when key is ready
      return generateKey(user, (key) => {
        console.log('callback key generated:', key);
      });
    })
    .then((key) => {
      currentKey = key;
      setLog('Key dibuat. Anda sekarang dapat melihat laporan.');
      controls.style.display = 'block';
    })
    .catch((err) => {
      setLog('Gagal: ' + (err && err.message ? err.message : err));
      controls.style.display = 'none';
      currentKey = null;
      currentUser = null;
    });
});

reportBtn.addEventListener('click', () => {
  setLog('Mengambil laporan...');
  // The report callback only executes when the module calls it
  getReport(currentKey, currentUser, (err, report) => {
    if (err) {
      console.warn('callback report error', err);
      return;
    }
    console.log('callback report data', report);
  })
    .then((report) => {
      setLog(`Laporan Admin (${currentUser.username}): Penghasilan ${report.earnings.toLocaleString()} ${report.currency}`);
    })
    .catch((err) => {
      setLog('Gagal mengambil laporan: ' + (err && err.message ? err.message : err));
    });
});

// Small convenience: pre-fill username with 'admin' to make testing easier
usernameInput.value = 'admin';
