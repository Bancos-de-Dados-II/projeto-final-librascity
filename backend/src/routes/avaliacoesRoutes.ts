import express, { Request, Response, Router } from 'express';
import { Avaliacao } from '../models/AvaliacaoAtendimentoModel';
import { Estabelecimento } from '../models/EstabelecimentoModel';
import { recalcularNotaMedia } from '../services/business/avaliacaoService';
import { auth } from '../middleware/auth';

const router: Router = express.Router();

router.post('/reviews', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { estabelecimentoId, nota, comentario } = req.body;

    if (!estabelecimentoId || nota === undefined) {
      res.status(400).json({ erro: 'estabelecimentoId e nota são obrigatórios' });
      return;
    }

    const estabelecimento = await Estabelecimento.findById(estabelecimentoId);
    if (!estabelecimento) {
      res.status(404).json({ erro: 'Estabelecimento não encontrado' });
      return;
    }

    const avaliacao = new Avaliacao({
      idAvaliacao: Date.now(),
      estabelecimentoId,
      nota,
      comentario: comentario || '',
      dataAvaliacao: new Date(),
    });
    await avaliacao.save();

    await recalcularNotaMedia(estabelecimentoId);

    res.status(201).json({ mensagem: 'Avaliação registrada', avaliacao });
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

export default router;