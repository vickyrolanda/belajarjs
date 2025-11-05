document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginBtn').addEventListener('click', handleLogin);
});

async function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    displayResult('');
    displayMessage('Mengirim permintaan ke Server Node.js...', 'gray');

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            displayMessage('Proses Selesai! Menampilkan Laporan dari Server...', 'blue');

            const reportText = `${data.message}\nKey Tergenerate: ${data.laporan.key}\nTotal Penghasilan Admin: ${data.laporan.penghasilan}`;
            displayResult(reportText);

        } else {
            displayMessage(`ERROR SERVER: ${data.message}`, 'red');
            displayResult(`Error Code: ${response.status}`);
        }

    } catch (error) {
        displayMessage(`ERROR KONEKSI: Tidak dapat mencapai server.`, 'red');
        console.error('Fetch Error:', error);
    }
}

function displayMessage(msg, color) {
    const msgElement = document.getElementById('message');
    msgElement.innerHTML = `Status: <strong>${msg}</strong>`;
    msgElement.style.backgroundColor = color === 'blue' ? '#e5f3ff' : (color === 'red' ? '#fbe9e9' : '#eee');
    msgElement.style.color = color === 'blue' ? '#3498db' : (color === 'red' ? '#e74c3c' : '#333');
}

function displayResult(res) {
    document.getElementById('result').textContent = res;
}