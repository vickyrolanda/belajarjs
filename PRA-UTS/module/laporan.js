function tampilLaporan(username) {
  const penghasilan = 2500000;
  return `
    <div class="laporan">
      <h3>Laporan Penghasilan</h3>
      <p><strong>Admin:</strong> ${username}</p>
      <p><strong>Total Penghasilan:</strong> Rp${penghasilan.toLocaleString("id-ID")}</p>
    </div>
  `;
}

module.exports = { tampilLaporan };
