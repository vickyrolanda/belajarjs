function generateKey(username) {
  return `${username}_${Date.now()}`;
}

function showReport(username) {
  return `Laporan penghasilan ${username}: Rp 10.000.000`;
}

module.exports = { generateKey, showReport };
