// ============================================
// IMPORT MODULE dari auth.js
// ============================================
import { verifikasiUsername, generateKey, tampilkanLaporan } from './auth.js';

// ============================================
// UI HELPER FUNCTIONS
// ============================================

/**
 * Menampilkan status message
 * @param {string} message - Pesan yang akan ditampilkan
 * @param {string} type - Tipe status: 'loading', 'success', atau 'error'
 */
function showStatus(message, type) {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
  statusEl.className = `status show ${type}`;
}

/**
 * Update status setiap step proses
 * @param {string} stepId - ID elemen step (step1, step2, step3)
 * @param {string} status - Status: 'pending', 'processing', atau 'completed'
 */
function updateStep(stepId, status) {
  const stepEl = document.getElementById(stepId);
  stepEl.className = `step ${status}`;
  
  const icon = stepEl.querySelector('.step-icon');
  if (status === 'processing') {
    icon.textContent = '⏳';
  } else if (status === 'completed') {
    icon.textContent = '✅';
  } else {
    icon.textContent = '⏳';
  }
}

/**
 * Menampilkan generated key
 * @param {string} key - Key yang di-generate
 */
function displayKey(key) {
  document.getElementById('keyValue').textContent = key;
  document.getElementById('keyDisplay').style.display = 'block';
}

/**
 * Menampilkan laporan penghasilan
 * @param {Object} data - Data laporan
 */
function displayLaporan(data) {
  const laporanContent = document.getElementById('laporanContent');
  
  // Build HTML untuk laporan
  let html = `<p><strong>Admin:</strong> ${data.admin}</p>`;
  html += `<h3>Detail Penghasilan:</h3>`;
  
  // Loop setiap bulan
  data.penghasilan.forEach(item => {
    html += `
      <div class="laporan-item">
        <span>${item.bulan}</span>
        <strong>Rp ${item.nominal.toLocaleString('id-ID')}</strong>
      </div>
    `;
  });
  
  // Total penghasilan
  html += `
    <div class="laporan-total">
      <span>TOTAL PENGHASILAN</span>
      <span>Rp ${data.total.toLocaleString('id-ID')}</span>
    </div>
  `;
  
  // Timestamp
  html += `<p style="margin-top: 15px; font-size: 12px; color: #999;">
    Timestamp: ${new Date(data.timestamp).toLocaleString('id-ID')}
  </p>`;
  
  laporanContent.innerHTML = html;
  document.getElementById('laporan').classList.add('show');
}

/**
 * Reset UI ke kondisi awal
 */
function resetUI() {
  document.getElementById('processSteps').classList.add('show');
  document.getElementById('laporan').classList.remove('show');
  document.getElementById('keyDisplay').style.display = 'none';
  updateStep('step1', 'pending');
  updateStep('step2', 'pending');
  updateStep('step3', 'pending');
}

/**
 * Reset steps yang belum completed
 */
function resetIncompleteSteps() {
  ['step1', 'step2', 'step3'].forEach(step => {
    const stepEl = document.getElementById(step);
    if (!stepEl.classList.contains('completed')) {
      updateStep(step, 'pending');
    }
  });
}

// ============================================
// MAIN LOGIN PROCESS
// ============================================

/**
 * Event listener untuk form login
 */
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Ambil nilai username
  const username = document.getElementById('username').value.trim();
  const loginBtn = document.getElementById('loginBtn');
  
  // Reset UI
  resetUI();
  
  // Disable button
  loginBtn.disabled = true;
  loginBtn.textContent = 'Memproses...';
  
  try {
    // ============================================
    // STEP 1: CALLBACK - Verifikasi Username
    // ============================================
    console.log('\n=== STEP 1: CALLBACK ===');
    updateStep('step1', 'processing');
    showStatus('Memverifikasi username...', 'loading');
    
    // Wrapper Promise untuk callback
    const verifikasiResult = await new Promise((resolve, reject) => {
      verifikasiUsername(username, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
    
    updateStep('step1', 'completed');
    showStatus(`✓ ${verifikasiResult.message}`, 'success');
    console.log('✅ Verifikasi berhasil:', verifikasiResult);
    
    // Delay untuk user experience
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // ============================================
    // STEP 2: PROMISE - Generate Key
    // ============================================
    console.log('\n=== STEP 2: PROMISE ===');
    updateStep('step2', 'processing');
    showStatus('Generating authentication key...', 'loading');
    
    const keyResult = await generateKey(verifikasiResult.username);
    
    updateStep('step2', 'completed');
    showStatus('✓ Key berhasil di-generate!', 'success');
    displayKey(keyResult.key);
    console.log('✅ Key generated:', keyResult);
    
    // Delay untuk user experience
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // ============================================
    // STEP 3: MODULE - Tampilkan Laporan
    // ============================================
    console.log('\n=== STEP 3: MODULE ===');
    updateStep('step3', 'processing');
    showStatus('Memuat laporan penghasilan...', 'loading');
    
    const laporanResult = await tampilkanLaporan(keyResult.key);
    
    updateStep('step3', 'completed');
    showStatus('✓ Laporan berhasil dimuat!', 'success');
    displayLaporan(laporanResult);
    console.log('✅ Laporan dimuat:', laporanResult);
    
    // Delay sebelum success message
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // ============================================
    // SUCCESS - Semua proses selesai
    // ============================================
    showStatus('🎉 Login berhasil! Semua proses selesai.', 'success');
    console.log('\n✅ SEMUA PROSES SELESAI!\n');
    
  } catch (error) {
    // ============================================
    // ERROR HANDLING
    // ============================================
    console.error('\n❌ ERROR:', error.message);
    showStatus(`❌ ${error.message}`, 'error');
    
    // Reset steps yang belum completed
    resetIncompleteSteps();
    
  } finally {
    // ============================================
    // CLEANUP - Enable button kembali
    // ============================================
    loginBtn.disabled = false;
    loginBtn.textContent = 'Login';
  }
});

// ============================================
// CONSOLE LOG INFO
// ============================================
console.log(`
╔════════════════════════════════════════╗
║   SISTEM LOGIN - PRA UTS              ║
║   Implementasi:                        ║
║   1. Callback (Verifikasi Username)    ║
║   2. Promise (Generate Key)            ║
║   3. Module System (Laporan)           ║
╚════════════════════════════════════════╝

📝 Gunakan username: "admin" untuk login
`);

// ============================================
// EVENT LISTENER UNTUK INPUT
// ============================================
document.getElementById('username').addEventListener('input', (e) => {
  const value = e.target.value.trim();
  
  // Highlight jika username adalah "admin"
  if (value === 'admin') {
    e.target.style.borderColor = '#2e7d32';
  } else if (value.length > 0) {
    e.target.style.borderColor = '#c62828';
  } else {
    e.target.style.borderColor = '#e0e0e0';
  }
});