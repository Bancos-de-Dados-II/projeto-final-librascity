import express, { Request, Response, Router } from 'express';
import { Estabelecimento } from '../models/EstabelecimentoModel';
import { syncEstabelecimento, deleteEstabelecimento } from '../services/postgres/estabelecimentoService';
import { getCache, setCache, invalidateCache } from '../services/redis/cacheService';

const router: Router = express.Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const novo = new Estabelecimento(req.body);
    await novo.save();
    syncEstabelecimento(novo);
    await invalidateCache('proximos:*');
    res.status(201).json(novo);
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const lista = await Estabelecimento.find();
    res.json(lista);
  } catch (err: any) {
    res.status(500).json({ erro: err.message });
  }
});

router.get('/proximos', async (req: Request, res: Response): Promise<void> => {
  const { lat, lng, raio = '5000' } = req.query as {
    lat?: string;
    lng?: string;
    raio?: string;
  };

  if (!lat || !lng) {
    res.status(400).json({ erro: 'Parâmetros lat e lng são obrigatórios' });
    return;
  }

  const cacheKey = `proximos:${lat}:${lng}:${raio}`;
  try {
    let resultados = await getCache(cacheKey);
    if (resultados) {
      console.log('Cache hit - retornando do Redis');
      res.json(resultados);
      return;
    }

    console.log('Cache miss - consultando MongoDB...');
    const coordenadas: [number, number] = [parseFloat(lng), parseFloat(lat)];

    resultados = await Estabelecimento.find({
      localizacao: {
        $near: {
          $geometry: { type: 'Point', coordinates: coordenadas },
          $maxDistance: parseInt(raio, 10),
        },
      },
    });

    await setCache(cacheKey, resultados);
    console.log('Dados armazenados em cache');
    res.json(resultados);
  } catch (err: any) {
    console.error('Erro na consulta espacial:', err);
    res.status(500).json({ erro: err.message });
  }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const item = await Estabelecimento.findById(id);
    if (!item) {
      res.status(404).json({ erro: 'Não encontrado' });
      return;
    }
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ erro: err.message });
  }
});

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const atualizado = await Estabelecimento.findByIdAndUpdate(
      id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
    if (!atualizado) {
      res.status(404).json({ erro: 'Não encontrado' });
      return;
    }
    syncEstabelecimento(atualizado);
    await invalidateCache('proximos:*');
    res.json(atualizado);
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const deletado = await Estabelecimento.findByIdAndDelete(id);
    if (!deletado) {
      res.status(404).json({ erro: 'Não encontrado' });
      return;
    }
    deleteEstabelecimento(id);
    await invalidateCache('proximos:*');
    res.json({ mensagem: 'Deletado com sucesso' });
  } catch (err: any) {
    res.status(500).json({ erro: err.message });
  }
});

export default router;