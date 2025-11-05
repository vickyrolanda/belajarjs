const form = document.querySelector('#loginForm');
const messageBox = document.querySelector('#message');
const reportBox = document.querySelector('#report-box');


function setMessage(text, type = 'info') {
    messageBox.textContent = text;
    messageBox.className = ''; 
    messageBox.classList.add('message', type); 
}


function setReport(text, type = 'info') {
    reportBox.textContent = text;
    reportBox.className = ''; 
    reportBox.classList.add('message', type); 
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    setMessage('Memproses...', 'info');
    reportBox.textContent = ''; 
    reportBox.className = '';   

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        
        if (data.success) {
            setMessage(data.message, 'success');
            setReport(data.report, 'success');  
        } else {
            setMessage(data.message, 'error'); 
        }
    } catch (error) {
        console.error('Error:', error);
        setMessage('Gagal terhubung ke server.', 'error');
    } 
});