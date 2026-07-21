const express = require('express');
const router = express.Router();
const Estabelecimento = require('../models/Estabelecimento');

// Temporário: Funções de sincronização e cache (stubs)
const syncEstabelecimento = async (dados) => {
  console.log('🔹 [STUB] syncEstabelecimento chamado com:', dados.nome);
};
const deleteEstabelecimento = async (id) => {
  console.log('🔹 [STUB] deleteEstabelecimento chamado para ID:', id);
};
const getCache = async (key) => {
  console.log('🔹 [STUB] getCache chamado para chave:', key);
  return null;
};
const setCache = async (key, value) => {
  console.log('🔹 [STUB] setCache chamado para chave:', key);
};
const invalidateCache = async (pattern) => {
  console.log('🔹 [STUB] invalidateCache chamado para padrão:', pattern);
};

router.post('/', async (req, res) => {
  try {
    const novo = new Estabelecimento(req.body);
    await novo.save();
    syncEstabelecimento(novo);
    await invalidateCache('proximos:*');
    res.status(201).json(novo);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const lista = await Estabelecimento.find();
    res.json(lista);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.get('/proximos', async (req, res) => {
  const { lat, lng, raio = 5000 } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ erro: 'Parâmetros lat e lng são obrigatórios' });
  }
  const cacheKey = `proximos:${lat}:${lng}:${raio}`;
  try {
    let resultados = await getCache(cacheKey);
    if (resultados) {
      console.log('Cache hit - retornando do Redis');
      return res.json(resultados);
    }
    console.log('Cache miss - consultando MongoDB...');
    const coordenadas = [parseFloat(lng), parseFloat(lat)];
    resultados = await Estabelecimento.find({
      localizacao: {
        $near: {
          $geometry: { type: 'Point', coordinates: coordenadas },
          $maxDistance: parseInt(raio)
        }
      }
    });
    await setCache(cacheKey, resultados);
    console.log('Dados armazenados em cache (stub)');
    res.json(resultados);
  } catch (err) {
    console.error('Erro na consulta espacial:', err);
    res.status(500).json({ erro: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Estabelecimento.findById(req.params.id);
    if (!item) return res.status(404).json({ erro: 'Não encontrado' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const atualizado = await Estabelecimento.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!atualizado) return res.status(404).json({ erro: 'Não encontrado' });
    syncEstabelecimento(atualizado);
    await invalidateCache('proximos:*');
    res.json(atualizado);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletado = await Estabelecimento.findByIdAndDelete(req.params.id);
    if (!deletado) return res.status(404).json({ erro: 'Não encontrado' });
    deleteEstabelecimento(req.params.id);
    await invalidateCache('proximos:*');
    res.json({ mensagem: 'Deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;