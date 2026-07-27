document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const telefoneInput = document.getElementById('telefone');
    const tipoUsuarioSelect = document.getElementById('tipoUsuario');
    const togglePassword = document.getElementById('togglePassword');
    const errorDiv = document.getElementById('errorMessage');
    const registerButton = document.getElementById('registerButton');
    const buttonText = document.getElementById('buttonText');
    const buttonSpinner = document.getElementById('buttonSpinner');

    togglePassword.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        togglePassword.querySelector('i').className = isPassword
            ? 'fa-regular fa-eye-slash'
            : 'fa-regular fa-eye';
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nome = nameInput.value.trim();
        const email = emailInput.value.trim();
        const senha = passwordInput.value.trim();
        const telefone = telefoneInput.value.trim();
        const tipoUsuario = tipoUsuarioSelect.value;

        if (!nome || !email || !senha || !telefone) {
            showError('Preencha todos os campos.');
            return;
        }

        if (senha.length < 6) {
            showError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        if (!/^\d{10,11}$/.test(telefone)) {
            showError('Telefone deve ter 10 ou 11 dígitos (apenas números).');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha, telefone, tipoUsuario })
            });

            const data = await response.json();

            if (!response.ok) {
                showError(data.erro || 'Erro no cadastro.');
                setLoading(false);
                return;
            }

            alert('Usuário cadastrado com sucesso!');
            window.location.href = '../login/login.html';

        } catch (error) {
            console.error('Erro:', error);
            showError('Erro de conexão com o servidor. Tente novamente.');
            setLoading(false);
        }
    });

    function showError(msg) {
        errorDiv.textContent = msg;
        errorDiv.classList.add('show');
        setTimeout(() => {
            errorDiv.classList.remove('show');
        }, 5000);
    }

    function setLoading(loading) {
        registerButton.disabled = loading;
        buttonText.style.display = loading ? 'none' : 'inline';
        buttonSpinner.style.display = loading ? 'inline-block' : 'none';
    }
});