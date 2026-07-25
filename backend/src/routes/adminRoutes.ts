import express, { Request, Response, Router } from 'express';
import { SolicitacaoAtendimento } from '../models/SolicitacaoAtendimentoModel';
import { auth } from '../middleware/auth';

const router: Router = express.Router();

function somenteAdmin(req: Request, res: Response, next: express.NextFunction): void {
  if (req.user?.tipoUsuario !== 'admin') {
    res.status(403).json({ erro: 'Acesso negado' });
    return;
  }
  next();
}

router.get('/dashboards/accessibility-heatmap', auth, somenteAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const chamados = await SolicitacaoAtendimento.find(
      { latitudeAtual: { $exists: true }, longitudeAtual: { $exists: true } },
      { latitudeAtual: 1, longitudeAtual: 1, dataAbertura: 1, status: 1 }
    );
    res.json(chamados);
  } catch (err: any) {
    res.status(500).json({ erro: err.message });
  }
});

router.get('/dashboards/critical-locations', auth, somenteAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const limite = Number(req.query.limite) || 3;

    const criticos = await SolicitacaoAtendimento.aggregate([
      { $match: { latitudeAtual: { $exists: true }, longitudeAtual: { $exists: true } } },
      {
        $group: {
          _id: {
            lat: { $round: ['$latitudeAtual', 3] },
            lng: { $round: ['$longitudeAtual', 3] },
          },
          totalChamados: { $sum: 1 },
        },
      },
      { $match: { totalChamados: { $gte: limite } } },
      { $sort: { totalChamados: -1 } },
    ]);

    res.json(criticos);
  } catch (err: any) {
    res.status(500).json({ erro: err.message });
  }
});

export default router;