document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const errorDiv = document.getElementById('errorMessage');
    const loginButton = document.getElementById('loginButton');
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

        const email = emailInput.value.trim();
        const senha = passwordInput.value.trim();

        if (!email || !senha) {
            showError('Preencha todos os campos.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            const data = await response.json();

            if (!response.ok) {
                showError(data.erro || 'Credenciais inválidas.');
                setLoading(false);
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));

            const tipo = data.usuario.tipoUsuario.toUpperCase();
            if (tipo === 'SURDO') {
                window.location.href = '../../pages/surdo/surdo.html';
            } else if (tipo === 'INTERPRETE') {
                window.location.href = '../../pages/interprete/interprete.html';
            } else if (tipo === 'ADMIN') {
                window.location.href = '../../pages/admin/admin.html';
            } else {
                showError('Tipo de usuário não reconhecido.');
                setLoading(false);
            }

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
        loginButton.disabled = loading;
        buttonText.style.display = loading ? 'none' : 'inline';
        buttonSpinner.style.display = loading ? 'inline-block' : 'none';
    }
});