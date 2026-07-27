document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.erro || 'Erro no login');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      const tipo = data.usuario.tipoUsuario.toUpperCase();

      if (tipo === 'SURDO') {
        window.location.href = '../../pages/mapa-inclusivo/mapa-inclusivo.html';
      } else if (tipo === 'INTERPRETE' || tipo === 'ADMIN') {
        window.location.href = '../../pages/interprete/interprete.html';
      } else {
        alert('Tipo de usuário não reconhecido. Contate o suporte.');
      }

    } catch (error) {
      console.error('Erro:', error);
      alert('Erro de conexão com o servidor.');
    }
  });
});