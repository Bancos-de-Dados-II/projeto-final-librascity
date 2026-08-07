import express, { Request, Response, Router, NextFunction } from 'express';
import { SolicitacaoAtendimento } from '../models/SolicitacaoAtendimentoModel';
import { auth } from '../middleware/auth';
import { Usuario } from '../models/UsuarioModel';
import { listarUsuariosAdmin, buscarUsuarioAdmin, atualizarUsuarioAdmin, deletarUsuarioAdmin } from '../services/business/usuarioService';

const router: Router = express.Router();

function somenteAdmin(req: Request, res: Response, next: express.NextFunction): void {
  if (req.user?.tipoUsuario !== 'ADMIN') {
    res.status(403).json({ erro: 'Acesso negado' });
    return;
  }
  next();
}

router.get('/usuarios', auth, somenteAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filtros = {
      tipoUsuario: req.query.tipoUsuario,
      status: req.query.status,
    };

    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 50);
    const skip = (page - 1) * limit;

    const resultado = await listarUsuariosAdmin(filtros, skip, limit);
    res.json(resultado);
  } catch (err: any) {
    next(err);
  }
});

router.get('/usuarios/:id', auth, somenteAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = String(req.params.id);
    const usuario = await buscarUsuarioAdmin(id);
    if (!usuario) {
      res.status(404).json({ erro: 'Usuário não encontrado' });
      return;
    }

    res.json(usuario);
  } catch (err: any) {
    next(err);
  }
});

router.put('/usuarios/:id', auth, somenteAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = String(req.params.id);
    const { nome, tipoUsuario, status, email, telefone, fotoPerfilUrl } = req.body;
    const payload: Record<string, any> = {};

    if (nome !== undefined) payload.nome = nome;
    if (tipoUsuario !== undefined) payload.tipoUsuario = tipoUsuario;
    if (status !== undefined) payload.status = status;
    if (email !== undefined) payload.email = email;
    if (telefone !== undefined) payload.telefone = telefone;
    if (fotoPerfilUrl !== undefined) payload.fotoPerfilUrl = fotoPerfilUrl;

    const usuario = await atualizarUsuarioAdmin(id, payload);
    if (!usuario) {
      res.status(404).json({ erro: 'Usuário não encontrado' });
      return;
    }

    res.json({ mensagem: 'Usuário atualizado', usuario });
  } catch (err: any) {
    next(err);
  }
});

router.delete('/usuarios/:id', auth, somenteAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = String(req.params.id);
    const usuario = await deletarUsuarioAdmin(id);
    if (!usuario) {
      res.status(404).json({ erro: 'Usuário não encontrado' });
      return;
    }

    res.json({ mensagem: 'Usuário removido', usuario });
  } catch (err: any) {
    next(err);
  }
});

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