// Module untuk laporan penghasilan
export function generateReport(key) {
    return new Promise((resolve, reject) => {
        if (!key) {
            reject(new Error('Key diperlukan untuk mengakses laporan'));
            return;
        }

        // Simulasi mengambil data penghasilan
        setTimeout(() => {
            const report = {
                periode: 'November 2025',
                penghasilan: {
                    total: 15000000,
                    rincian: [
                        { kategori: 'Penjualan Produk', jumlah: 8000000 },
                        { kategori: 'Jasa Konsultasi', jumlah: 5000000 },
                        { kategori: 'Komisi Partner', jumlah: 2000000 }
                    ]
                }
            };
            resolve(report);
        }, 1000);
    });
}