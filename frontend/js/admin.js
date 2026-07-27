const API_BASE = 'http://localhost:5000';

const token = localStorage.getItem('token');
const usuarioStr = localStorage.getItem('usuario');

if (!token || !usuarioStr) {
    alert('Você precisa estar logado para acessar esta página.');
    window.location.href = '../../auth/login/login.html';
}

const usuario = JSON.parse(usuarioStr);
if (usuario.tipoUsuario.toUpperCase() !== 'ADMIN') {
    alert('Apenas administradores podem acessar esta página.');
    window.location.href = '../../auth/login/login.html';
}

const callsList = document.getElementById('callsList');
const refreshBtn = document.getElementById('refreshBtn');
const logoutLink = document.getElementById('logoutLink');

const totalChamados = document.getElementById('totalChamados');
const totalUsuarios = document.getElementById('totalUsuarios');
const totalEstabelecimentos = document.getElementById('totalEstabelecimentos');
const totalHoras = document.getElementById('totalHoras');

let map;

function initMap() {
    map = L.map('map').setView([-6.8877, -38.8822], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
}

function atualizarMapa(chamados) {
    if (!map) initMap();

    map.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
            map.removeLayer(layer);
        }
    });

    if (!chamados || chamados.length === 0) {
        L.marker([-6.8877, -38.8822])
            .addTo(map)
            .bindPopup('Nenhum chamado registrado.');
        return;
    }

    chamados.forEach(chamado => {
        const lat = chamado.latitudeAtual;
        const lng = chamado.longitudeAtual;
        if (!lat || !lng) return;

        const popupContent = `
            <b>${chamado.nomeSolicitante || 'Usuário'}</b><br>
            Status: ${chamado.status}<br>
            Data: ${new Date(chamado.dataAbertura).toLocaleString()}
        `;

        L.circleMarker([lat, lng], {
            radius: 8,
            color: '#d72b2b',
            fillColor: '#d72b2b',
            fillOpacity: 0.8
        })
        .addTo(map)
        .bindPopup(popupContent);
    });

    if (chamados.length > 0) {
        const group = L.featureGroup();
        map.eachLayer((layer) => {
            if (layer instanceof L.CircleMarker) {
                group.addLayer(layer);
            }
        });
        if (group.getLayers().length > 0) {
            map.fitBounds(group.getBounds(), { padding: [50, 50] });
        }
    }
}

async function carregarDashboard() {
    try {
        const chamadosResponse = await fetch(`${API_BASE}/admin/dashboards/accessibility-heatmap`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!chamadosResponse.ok) throw new Error('Erro ao carregar chamados');
        const chamados = await chamadosResponse.json();

        atualizarMapa(chamados);
        renderizarChamados(chamados);

        totalChamados.textContent = chamados.length;
        totalUsuarios.textContent = '42';
        totalEstabelecimentos.textContent = '15';
        totalHoras.textContent = '18h';

    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        callsList.innerHTML = `<p class="no-calls">Erro ao carregar dados. Tente novamente.</p>`;
    }
}

function renderizarChamados(chamados) {
    if (!chamados || chamados.length === 0) {
        callsList.innerHTML = `<p class="no-calls">Nenhum chamado registrado.</p>`;
        return;
    }

    const sorted = [...chamados].sort((a, b) => new Date(b.dataAbertura) - new Date(a.dataAbertura));
    const recentes = sorted.slice(0, 10);

    let html = '';
    recentes.forEach(chamado => {
        const nome = chamado.nomeSolicitante || 'Usuário';
        const status = chamado.status || 'Desconhecido';
        const data = new Date(chamado.dataAbertura).toLocaleString();
        const lat = chamado.latitudeAtual || '';
        const lng = chamado.longitudeAtual || '';

        html += `
            <div class="call">
                <div class="call-info">
                    <h4>
                        ${nome}
                        <span class="badge">${status}</span>
                    </h4>
                    <p><i class="fa-solid fa-location-dot"></i> Lat: ${lat}, Lng: ${lng}</p>
                    <small><i class="fa-regular fa-calendar"></i> ${data}</small>
                </div>
            </div>
        `;
    });

    callsList.innerHTML = html;
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
    initMap();
    carregarDashboard();

    refreshBtn.addEventListener('click', carregarDashboard);

    setInterval(carregarDashboard, 60000);
});