const API_BASE = 'http://localhost:5000';

const token = localStorage.getItem('token');
const usuarioStr = localStorage.getItem('usuario');

if (!token || !usuarioStr) {
    alert('Você precisa estar logado para acessar esta página.');
    window.location.href = '../../auth/login/login.html';
}

const usuario = JSON.parse(usuarioStr);
if (!['INTERPRETE', 'ADMIN'].includes(usuario.tipoUsuario.toUpperCase())) {
    alert('Apenas intérpretes e administradores podem acessar esta página.');
    window.location.href = '../../auth/login/login.html';
}

const callsList = document.getElementById('callsList');
const pendentesBadge = document.getElementById('pendentesBadge');
const currentCall = document.getElementById('currentCall');
const callNome = document.getElementById('callNome');
const callLocal = document.getElementById('callLocal').querySelector('span');
const callFoto = document.getElementById('callFoto').querySelector('span');
const callContexto = document.getElementById('callContexto').querySelector('span');
const acceptBtn = document.getElementById('acceptBtn');
const logoutLink = document.getElementById('logoutLink');

let map;
let marker;

function initMap(lat, lng) {
    if (!map) {
        map = L.map('map').setView([lat, lng], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
    } else {
        map.setView([lat, lng], 14);
    }

    if (marker) map.removeLayer(marker);
    marker = L.marker([lat, lng]).addTo(map)
        .bindPopup('Localização do chamado')
        .openPopup();
}

async function carregarChamados() {
    try {
        const response = await fetch(`${API_BASE}/calls/pending`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            if (response.status === 401) {
                alert('Sessão expirada. Faça login novamente.');
                logout();
                return;
            }
            throw new Error('Erro ao carregar chamados');
        }

        const chamados = await response.json();
        renderizarChamados(chamados);

        pendentesBadge.textContent = `${chamados.length} pendente${chamados.length !== 1 ? 's' : ''}`;

        if (chamados.length > 0) {
            selecionarChamado(chamados[0]);
        } else {
            currentCall.style.display = 'none';
            if (map) {
                map.setView([-6.8877, -38.8822], 13);
                if (marker) map.removeLayer(marker);
            }
        }

        document.getElementById('hojeCount').textContent = chamados.length;
        document.getElementById('totalCount').textContent = chamados.length;

    } catch (error) {
        console.error('Erro ao carregar chamados:', error);
        callsList.innerHTML = `<p class="no-calls">Erro ao carregar chamados. Tente novamente.</p>`;
    }
}

function renderizarChamados(chamados) {
    if (chamados.length === 0) {
        callsList.innerHTML = `<p class="no-calls">Nenhum chamado pendente no momento.</p>`;
        return;
    }

    let html = '';
    chamados.forEach(chamado => {
        const nome = chamado.nomeSolicitante || 'Usuário';
        const descricao = chamado.descricao || 'Sem contexto';
        const lat = chamado.latitudeAtual || 0;
        const lng = chamado.longitudeAtual || 0;
        const tempo = chamado.tempoDecorrido || 'agora';

        html += `
            <div class="call" data-id="${chamado._id}" data-lat="${lat}" data-lng="${lng}">
                <div class="color red"></div>
                <div class="call-info">
                    <h4>${nome}</h4>
                    <p>${descricao}</p>
                    <small>
                        <i class="fa-solid fa-location-dot"></i>
                        Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}
                    </small>
                </div>
                <div class="time">
                    <i class="fa-regular fa-clock"></i>
                    ${tempo}
                </div>
                <button class="accept-btn" data-id="${chamado._id}">Aceitar</button>
            </div>
        `;
    });

    callsList.innerHTML = html;

    document.querySelectorAll('.call').forEach(el => {
        el.addEventListener('click', function(e) {
            if (e.target.classList.contains('accept-btn')) return;
            const id = this.dataset.id;
            const chamado = chamados.find(c => c._id === id);
            if (chamado) selecionarChamado(chamado);
        });

        const btn = el.querySelector('.accept-btn');
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = this.dataset.id;
            const chamado = chamados.find(c => c._id === id);
            if (chamado) aceitarChamado(chamado);
        });
    });
}

function selecionarChamado(chamado) {
    const nome = chamado.nomeSolicitante || 'Usuário';
    const descricao = chamado.descricao || 'Sem contexto';
    const lat = chamado.latitudeAtual || -6.8877;
    const lng = chamado.longitudeAtual || -38.8822;
    const fotoUrl = chamado.fotoContextoUrl || null;

    currentCall.style.display = 'flex';
    callNome.textContent = nome;
    callLocal.textContent = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
    callContexto.textContent = descricao;

    if (fotoUrl) {
        callFoto.innerHTML = `<i class="fa-regular fa-image"></i> <a href="${fotoUrl}" target="_blank">Ver foto</a>`;
    } else {
        callFoto.innerHTML = `<i class="fa-regular fa-image"></i> Sem foto`;
    }

    initMap(lat, lng);

    acceptBtn.dataset.id = chamado._id;
}

async function aceitarChamado(chamado) {
    try {
        const response = await fetch(`${API_BASE}/calls/${chamado._id}/accept`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const data = await response.json();
            alert(data.erro || 'Erro ao aceitar chamado');
            return;
        }

        const data = await response.json();
        if (data.linkWhatsapp) {
            window.open(data.linkWhatsapp, '_blank');
            carregarChamados();
        } else {
            alert('Link do WhatsApp não disponível.');
        }

    } catch (error) {
        console.error('Erro ao aceitar chamado:', error);
        alert('Erro de conexão. Tente novamente.');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '../../auth/login/login.html';
}

logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
});

document.addEventListener('DOMContentLoaded', () => {
    carregarChamados();

    setInterval(carregarChamados, 30000);
});