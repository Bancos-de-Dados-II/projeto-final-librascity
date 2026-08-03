const API_BASE = 'http://localhost:5000';

const token = localStorage.getItem('token');
const usuarioStr = localStorage.getItem('usuario');

if (!token || !usuarioStr) {
    alert('Você precisa estar logado para acessar esta página.');
    window.location.href = '../../auth/login/login.html';
}

const usuario = JSON.parse(usuarioStr);
if (usuario.tipoUsuario.toUpperCase() !== 'SURDO') {
    alert('Apenas usuários surdos podem acessar esta página.');
    window.location.href = '../../auth/login/login.html';
}

const categorias = ['Saúde', 'Educação', 'Comércio', 'Alimentação', 'Órgão Público', 'Lazer'];
const resultadosLista = document.getElementById('resultadosLista');
const resultadosCount = document.getElementById('resultadosCount');
const categoriasContainer = document.getElementById('categoriasContainer');
const notaRange = document.getElementById('notaRange');
const notaLabel = document.getElementById('notaLabel');
const librasToggle = document.getElementById('librasToggle');
const buscarBtn = document.getElementById('buscarBtn');
const logoutBtn = document.getElementById('logoutBtn');
const botaoPanico = document.getElementById('botaoPanico');
const enderecoInput = document.getElementById('enderecoInput');
const buscarEnderecoBtn = document.getElementById('buscarEnderecoBtn');
const searchStatus = document.getElementById('searchStatus');
const reviewModal = document.getElementById('reviewModal');
const closeReviewModal = document.getElementById('closeReviewModal');
const cancelReviewBtn = document.getElementById('cancelReviewBtn');
const submitReviewBtn = document.getElementById('submitReviewBtn');
const reviewPlaceName = document.getElementById('reviewPlaceName');
const reviewComment = document.getElementById('reviewComment');
const reviewPhotoInput = document.getElementById('reviewPhotoInput');
const reviewMessage = document.getElementById('reviewMessage');
const reviewStars = document.getElementById('reviewStars');
const toastMessage = document.getElementById('toastMessage');
const cadastroEstabelecimentoForm = document.getElementById('cadastroEstabelecimentoForm');
const nomeEstabelecimento = document.getElementById('nomeEstabelecimento');
const categoriaEstabelecimento = document.getElementById('categoriaEstabelecimento');
const fotoEstabelecimentoInput = document.getElementById('fotoEstabelecimentoInput');
const previewFotoEstabelecimento = document.getElementById('previewFotoEstabelecimento');
const localizacaoEstabelecimentoTexto = document.getElementById('localizacaoEstabelecimentoTexto');
const cadastroEstabelecimentoMessage = document.getElementById('cadastroEstabelecimentoMessage');
const submitCadastroEstabelecimentoBtn = document.getElementById('submitCadastroEstabelecimentoBtn');

let map;
let markersLayer;
let selectedReviewPlace = null;
let selectedRating = 0;
let activeCoordinates = { lat: -6.8877, lng: -38.8822 };
let latestResults = [];
let selectedEstabelecimentoCoordinates = null;

function showToast(message) {
    toastMessage.textContent = message;
    toastMessage.classList.remove('hidden');
    clearTimeout(showToast.timeoutId);
    showToast.timeoutId = setTimeout(() => toastMessage.classList.add('hidden'), 3800);
}

function initMap(lat = activeCoordinates.lat, lng = activeCoordinates.lng) {
    if (!map) {
        map = L.map('map').setView([lat, lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        markersLayer = L.layerGroup().addTo(map);

        map.on('click', event => {
            selectedEstabelecimentoCoordinates = {
                lat: event.latlng.lat,
                lng: event.latlng.lng
            };
            localizacaoEstabelecimentoTexto.textContent = `Latitude: ${selectedEstabelecimentoCoordinates.lat.toFixed(5)} | Longitude: ${selectedEstabelecimentoCoordinates.lng.toFixed(5)}`;
        });
    } else {
        map.setView([lat, lng], 13);
    }
}

function createMarkerIcon(color, label) {
    return L.divIcon({
        className: 'custom-marker',
        html: `<span class="marker-circle marker-${color}">${label}</span>`,
        iconSize: [42, 42],
        iconAnchor: [21, 42]
    });
}

function getRatingColor(nota) {
    if (nota >= 4) return 'green';
    if (nota >= 2.5) return 'yellow';
    return 'red';
}

function criarPopupHtml(item) {
    const notaLabel = item.notaMedia ? item.notaMedia.toFixed(1) : 'Sem nota';
    const atende = item.atendeLIBRAS === false ? 'Não' : 'Sim';
    return `
        <div class="popup-card">
            <strong>${item.nome}</strong>
            <p>${item.categoria || 'Geral'}</p>
            <p>Nota: ⭐ ${notaLabel}</p>
            <p>Atende em LIBRAS: <strong>${atende}</strong></p>
            <button class="popup-review" data-id="${item._id}">Avaliar</button>
        </div>
    `;
}

async function buscarEndereco(term) {
    if (!term) return null;
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(term)}`;
        const response = await fetch(url);
        const data = await response.json();
        if (!data || data.length === 0) return null;
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    } catch (error) {
        console.warn('Erro na busca de endereço', error);
        return null;
    }
}

function atualizarMarcadores(estabelecimentos) {
    markersLayer.clearLayers();
    if (!estabelecimentos.length) return;

    estabelecimentos.forEach(item => {
        const [lng, lat] = item.localizacao.coordinates;
        const cor = getRatingColor(item.notaMedia || 0);
        const marker = L.marker([lat, lng], {
            icon: createMarkerIcon(cor, item.notaMedia ? item.notaMedia.toFixed(1) : '?')
        });

        marker.bindPopup(criarPopupHtml(item));
        marker.on('popupopen', () => {
            document.querySelectorAll('.popup-review').forEach(button => {
                button.addEventListener('click', () => openReviewModal(button.dataset.id));
            });
        });
        markersLayer.addLayer(marker);
    });
}

function estebelecimentosbadgeText(total) {
    if (total === 0) return 'Nenhum';
    if (total === 1) return '1 local';
    return `${total} locais`;
}

function atualizarResultados(estabelecimentos) {
    resultadosCount.textContent = `${estabelecimentos.length} local${estabelecimentos.length === 1 ? '' : 'es'} encontrados`;
    document.getElementById('resultsBadge').textContent = estebelecimentosbadgeText(estabelecimentos.length);

    if (!estabelecimentos.length) {
        resultadosLista.innerHTML = '<p class="no-results">Nenhum estabelecimento encontrado com os filtros selecionados.</p>';
        return;
    }

    resultadosLista.innerHTML = estabelecimentos.map(item => {
        const nota = item.notaMedia ? item.notaMedia.toFixed(1) : 'Sem nota';
        const atende = item.atendeLIBRAS === false ? 'Não' : 'LIBRAS';
        return `
            <div class="resultado-item" data-id="${item._id}">
                <div class="resultado-info">
                    <h3>${item.nome}</h3>
                    <p>${item.categoria || 'Geral'}</p>
                    <small>${item.endereco || 'Endereço não informado'}</small>
                </div>
                <div class="resultado-meta">
                    <span class="badge secondary">${atende}</span>
                    <strong>⭐ ${nota}</strong>
                    <button class="popup-review btn-secondary" data-id="${item._id}">Avaliar</button>
                </div>
            </div>
        `;
    }).join('');

    document.querySelectorAll('.resultado-item').forEach(card => {
        card.addEventListener('click', event => {
            if (event.target.closest('.popup-review')) return;
            const id = card.dataset.id;
            const item = latestResults.find(place => place._id === id);
            if (item) {
                const [lng, lat] = item.localizacao.coordinates;
                map.setView([lat, lng], 15);
            }
        });
    });

    document.querySelectorAll('.popup-review').forEach(button => {
        button.addEventListener('click', () => openReviewModal(button.dataset.id));
    });
}

async function buscarEstabelecimentos(lat = activeCoordinates.lat, lng = activeCoordinates.lng) {
    const categoriasSelecionadas = Array.from(document.querySelectorAll('.categoria-btn.active')).map(btn => btn.dataset.categoria);
    const notaMinima = parseFloat(notaRange.value);
    const atendeLIBRAS = librasToggle.checked;

    if (!map) initMap(lat, lng);
    map.setView([lat, lng], 13);
    searchStatus.textContent = 'Buscando estabelecimentos...';

    try {
        const response = await fetch(`${API_BASE}/estabelecimentos/proximos?lat=${lat}&lng=${lng}&raio=10000`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            throw new Error('Não foi possível carregar os estabelecimentos.');
        }

        let estabelecimentos = await response.json();
        
        estabelecimentos = estabelecimentos.filter(item => {
            const nota = item.notaMedia || 0;
            const aceita = atendeLIBRAS ? item.atendeLIBRAS !== false : true;
            const categoriaOk = categoriasSelecionadas.length === 0 || categoriasSelecionadas.includes(item.categoria);
            return nota >= notaMinima && aceita && categoriaOk;
        });

        latestResults = estabelecimentos;
        atualizarResultados(estabelecimentos);
        atualizarMarcadores(estabelecimentos);
        searchStatus.textContent = `Mostrando ${estabelecimentos.length} locais.`;
    } catch (error) {
        console.error(error);
        resultadosLista.innerHTML = '<p class="no-results">Erro ao buscar estabelecimentos. Tente novamente.</p>';
        searchStatus.textContent = 'Erro ao carregar estabelecimentos.';
    }
}

function abrirModal() {
    reviewModal.classList.remove('hidden');
}

function fecharModal() {
    reviewModal.classList.add('hidden');
    selectedReviewPlace = null;
    selectedRating = 0;
    [...reviewStars.children].forEach(button => button.classList.remove('active'));
    reviewComment.value = '';
    reviewPhotoInput.value = '';
    reviewMessage.textContent = '';
}

function openReviewModal(placeId) {
    const place = latestResults.find(item => item._id === placeId);
    if (!place) {
        showToast('Não foi possível encontrar o estabelecimento.');
        return;
    }
    selectedReviewPlace = place;
    reviewPlaceName.textContent = place.nome;
    abrirModal();
}

function setRating(value) {
    selectedRating = value;
    [...reviewStars.children].forEach(button => {
        const rating = Number(button.dataset.value);
        button.classList.toggle('active', rating <= value);
    });
}

async function enviarAvaliacao() {
    if (!selectedReviewPlace) return;
    if (selectedRating === 0) {
        reviewMessage.textContent = 'Selecione uma nota antes de enviar.';
        return;
    }

    reviewMessage.textContent = 'Enviando avaliação...';
    submitReviewBtn.disabled = true;

    try {
        let fotoUrl = null;
        if (reviewPhotoInput.files.length > 0) {
            fotoUrl = await uploadImage(reviewPhotoInput.files[0]);
        }

        const payload = {
            estabelecimentoId: selectedReviewPlace._id,
            nota: selectedRating,
            comentario: reviewComment.value.trim()
        };
        if (fotoUrl) payload.fotoUrl = fotoUrl;

        const response = await fetch(`${API_BASE}/places/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok) {
            reviewMessage.textContent = data.erro || 'Erro ao enviar avaliação.';
            return;
        }

        reviewMessage.textContent = 'Avaliação enviada com sucesso!';
        showToast('Avaliação registrada. Obrigado!');
        fecharModal();
    } catch (error) {
        console.error(error);
        reviewMessage.textContent = 'Erro ao enviar avaliação. Tente novamente.';
    } finally {
        submitReviewBtn.disabled = false;
    }
}

async function uploadImage(file) {
    const formData = new FormData();
    formData.append('imagem', file);

    const response = await fetch(`${API_BASE}/uploads/media`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.erro || 'Falha no upload da imagem');
    }

    return data.url_imagem || null;
}

async function acionarPanico() {
    if (!navigator.geolocation) {
        alert('Geolocalização não disponível. Ative o GPS.');
        return;
    }

    botaoPanico.disabled = true;
    botaoPanico.textContent = 'Aguarde...';

    try {
        const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            });
            
        });

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        let fotoUrl = null;

        if (reviewPhotoInput.files.length > 0) {
            fotoUrl = await uploadImage(reviewPhotoInput.files[0]);
        }

        const response = await fetch(`${API_BASE}/calls/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ latitudeAtual: lat, longitudeAtual: lng, fotoContextoUrl: fotoUrl })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.erro || 'Erro ao acionar botão de pânico.');
        }

        showToast('Chamado acionado. Aguardando intérprete...');
        iniciarPolling(data.id);
    } catch (error) {
        console.error(error);
        alert('Erro ao acionar o botão de pânico. Tente novamente.');
    } finally {
        botaoPanico.disabled = false;
        botaoPanico.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Botão de Pânico';
    }
}

function iniciarPolling(chamadoId) {
    let tentativas = 0;
    const maxTentativas = 30;

    const interval = setInterval(async () => {
        tentativas += 1;
        try {
            const response = await fetch(`${API_BASE}/calls/${chamadoId}/status`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                if (tentativas >= maxTentativas) clearInterval(interval);
                return;
            }
            const data = await response.json();
            if (data.status === 'EM_CURSO') {
                clearInterval(interval);
                showToast('Intérprete encontrado!');
                if (data.linkWhatsapp) {
                    window.open(data.linkWhatsapp, '_blank');
                }
                return;
            }
            if (data.status === 'FINALIZADA' || data.status === 'CANCELADA') {
                clearInterval(interval);
                showToast('Chamado finalizado.');
                return;
            }
            searchStatus.textContent = 'Aguardando intérprete...';
        } catch (error) {
            console.error('Erro no polling', error);
        }
        if (tentativas >= maxTentativas) {
            clearInterval(interval);
            showToast('Tempo esgotado. Nenhum intérprete disponível.');
        }
    }, 5000);
}

function mostrarPreviewImagem(file) {
    if (!file) {
        previewFotoEstabelecimento.classList.add('hidden');
        previewFotoEstabelecimento.removeAttribute('src');
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        previewFotoEstabelecimento.src = reader.result;
        previewFotoEstabelecimento.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

async function cadastrarEstabelecimentoComImagem(event) {
    event.preventDefault();

    if (!selectedEstabelecimentoCoordinates) {
        cadastroEstabelecimentoMessage.textContent = 'Clique no mapa para definir a localização do estabelecimento.';
        return;
    }

    const nome = nomeEstabelecimento.value.trim();
    const categoria = categoriaEstabelecimento.value.trim();
    const imagemFile = fotoEstabelecimentoInput.files[0];

    if (!nome || !categoria) {
        cadastroEstabelecimentoMessage.textContent = 'Preencha nome e categoria para continuar.';
        return;
    }

    submitCadastroEstabelecimentoBtn.disabled = true;
    cadastroEstabelecimentoMessage.textContent = 'Enviando imagem...';

    try {
        let fotoUrl = '';
        if (imagemFile) {
            fotoUrl = await uploadImage(imagemFile);
        }

        const payload = {
            nome,
            categoria,
            fotoUrl,
            localizacao: {
                type: 'Point',
                coordinates: [selectedEstabelecimentoCoordinates.lng, selectedEstabelecimentoCoordinates.lat]
            }
        };

        cadastroEstabelecimentoMessage.textContent = 'Cadastrando estabelecimento...';
        const response = await fetch(`${API_BASE}/estabelecimentos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.erro || 'Erro ao cadastrar estabelecimento');
        }

        cadastroEstabelecimentoMessage.textContent = 'Estabelecimento cadastrado com sucesso!';
        showToast('Estabelecimento cadastrado com sucesso.');
        cadastroEstabelecimentoForm.reset();
        previewFotoEstabelecimento.classList.add('hidden');
        previewFotoEstabelecimento.removeAttribute('src');
        localizacaoEstabelecimentoTexto.textContent = 'Clique no mapa para capturar latitude/longitude.';
        selectedEstabelecimentoCoordinates = null;
        await buscarEstabelecimentos(activeCoordinates.lat, activeCoordinates.lng);
    } catch (error) {
        console.error(error);
        cadastroEstabelecimentoMessage.textContent = error.message || 'Erro ao cadastrar estabelecimento.';
    } finally {
        submitCadastroEstabelecimentoBtn.disabled = false;
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '../../auth/login/login.html';
}

function criarCategorias() {
    categoriasContainer.innerHTML = categorias.map(cat => `
        <button type="button" class="categoria-btn" data-categoria="${cat}">${cat}</button>
    `).join('');

    document.querySelectorAll('.categoria-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            buscarEstabelecimentos();
        });
    });
}

reviewStars.addEventListener('click', event => {
    const button = event.target.closest('.star');
    if (!button) return;
    setRating(Number(button.dataset.value));
});

closeReviewModal.addEventListener('click', fecharModal);
cancelReviewBtn.addEventListener('click', fecharModal);
submitReviewBtn.addEventListener('click', enviarAvaliacao);
cadastroEstabelecimentoForm.addEventListener('submit', cadastrarEstabelecimentoComImagem);
fotoEstabelecimentoInput.addEventListener('change', event => mostrarPreviewImagem(event.target.files[0]));

buscarBtn.addEventListener('click', () => buscarEstabelecimentos(activeCoordinates.lat, activeCoordinates.lng));
buscarEnderecoBtn.addEventListener('click', async () => {
    const term = enderecoInput.value.trim();
    if (!term) {
        showToast('Digite um endereço para buscar.');
        return;
    }
    const local = await buscarEndereco(term);
    if (!local) {
        showToast('Endereço não encontrado.');
        return;
    }
    activeCoordinates = local;
    initMap(local.lat, local.lng);
    buscarEstabelecimentos(local.lat, local.lng);
});

enderecoInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        event.preventDefault();
        buscarEnderecoBtn.click();
    }
});

notaRange.addEventListener('input', () => {
    notaLabel.textContent = notaRange.value;
});

logoutBtn.addEventListener('click', logout);
botaoPanico.addEventListener('click', acionarPanico);

window.openReviewModal = openReviewModal;

/* marcador do map */

(async function init() {
    navigator.geolocation.getCurrentPosition(async (pos) => {

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        activeCoordinates = { lat, lng };

        initMap(lat, lng);

        atualizarLocalizacaoUsuario(lat, lng);

        await buscarEstabelecimentos(lat, lng);

    }, () => {

        initMap();
        buscarEstabelecimentos();

    });

    criarCategorias();
    notaLabel.textContent = notaRange.value;

})();

let userMarker = null;

function atualizarLocalizacaoUsuario(lat, lng) {

    if (userMarker) {
        map.removeLayer(userMarker);
    }

    userMarker = L.marker([lat, lng], {
        icon: L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41]
        })
    })
    .addTo(map)
    .bindPopup("Você está aqui");
}