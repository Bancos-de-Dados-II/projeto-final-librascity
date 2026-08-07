import express, { NextFunction, Request, Response, Router } from 'express';
import { Avaliacao } from '../models/AvaliacaoAtendimentoModel';
import { Estabelecimento } from '../models/EstabelecimentoModel';
import { recalcularNotaMedia } from '../services/business/avaliacaoService';
import { auth } from '../middleware/auth';
import { avaliacaoSchema, avaliacaoUpdateSchema, validate } from '../middleware/validation';
import { listarAvaliacoes, buscarAvaliacao, atualizarAvaliacaoAdminOuAutor, deletarAvaliacaoAdminOuAutor } from '../services/business/avaliacaoBusinessService';

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
      usuarioId: String(req.user?.id),
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

router.get('/reviews', auth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filtros = {
      estabelecimentoId: req.query.estabelecimentoId,
      usuarioId: req.query.usuarioId,
      nota: req.query.nota,
    };

    const avaliacoes = await listarAvaliacoes(filtros);
    res.json(avaliacoes);
  } catch (err: any) {
    next(err);
  }
});

router.get('/reviews/:id', auth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = String(req.params.id);
    const avaliacao = await buscarAvaliacao(id);
    if (!avaliacao) {
      res.status(404).json({ erro: 'Avaliação não encontrada' });
      return;
    }

    res.json(avaliacao);
  } catch (err: any) {
    next(err);
  }
});

router.put('/reviews/:id', auth, validate(avaliacaoUpdateSchema), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = String(req.params.id);
    const avaliacao = await atualizarAvaliacaoAdminOuAutor(id, req.body, req.user);
    if (!avaliacao) {
      res.status(404).json({ erro: 'Avaliação não encontrada' });
      return;
    }

    res.json({ mensagem: 'Avaliação atualizada', avaliacao });
  } catch (err: any) {
    next(err);
  }
});

router.delete('/reviews/:id', auth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = String(req.params.id);
    const avaliacao = await deletarAvaliacaoAdminOuAutor(id, req.user);
    if (!avaliacao) {
      res.status(404).json({ erro: 'Avaliação não encontrada' });
      return;
    }

    res.json({ mensagem: 'Avaliação removida', avaliacao });
  } catch (err: any) {
    next(err);
  }
});

export default router;