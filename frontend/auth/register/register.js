document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;
    const telefone = document.getElementById('telefone').value;
    const tipoUsuario = document.getElementById('tipoUsuario').value;

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, telefone, tipoUsuario })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.erro || 'Erro no cadastro');
        return;
      }

      alert('Usuário cadastrado com sucesso!');
      window.location.href = '../login/login.html';

    } catch (error) {
      console.error('Erro:', error);
      alert('Erro de conexão com o servidor.');
    }
  });
});