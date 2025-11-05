const form = ducoment.querySelector('#loginForm');
const messageBox = document.querySelector('#message');

function setMessage(text, type = 'info') {
    messageBox.textContent = text;
    messageBox.className = '';
    messageBox.classList.add('massage', type);
}

form.addEventListener('submit),' async (event) => {
    event.preventDefault();
    setMessage('Memproses...' 'info');

    const fromData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/login',{
            method: 'POST',
            headers: {
                'content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        } );

        const data = await response.json();
        if (data.succes){
            setMessage(data.message || 'Login berhasil.' 'succes');
        } else{
            setMessage(data.message || 'Terjadi kesalahan','error');
            }
    } catch (error){
        console.error('Error:',error);
        setMessage('Gagal terhubung ke server.', 'error');
    }
});