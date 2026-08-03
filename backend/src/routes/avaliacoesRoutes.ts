import express, { NextFunction, Request, Response, Router } from 'express';
import { Avaliacao } from '../models/AvaliacaoAtendimentoModel';
import { Estabelecimento } from '../models/EstabelecimentoModel';
import { recalcularNotaMedia } from '../services/business/avaliacaoService';
import { auth } from '../middleware/auth';
import { avaliacaoSchema, validate } from '../middleware/validation';

const router: Router = express.Router();

router.post('/reviews', auth, validate(avaliacaoSchema), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { estabelecimentoId, nota, comentario } = req.body;

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
    next(err);
  }
});

export default router;