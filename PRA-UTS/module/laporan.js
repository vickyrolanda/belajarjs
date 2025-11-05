function tampilLaporan(username, callback) {
  const penghasilan = 2500000;
  const laporanHTML = `
    <div class="laporan">
      <h3>Laporan Penghasilan</h3>
      <p><strong>Admin:</strong> ${username}</p>
      <p><strong>Total Penghasilan:</strong> Rp${penghasilan.toLocaleString("id-ID")}</p>
    </div>
  `;
  callback(laporanHTML); // jalankan callback setelah laporan siap
}

module.exports = { tampilLaporan };
