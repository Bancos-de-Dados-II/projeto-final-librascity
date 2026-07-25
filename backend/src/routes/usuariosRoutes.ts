import express, { Request, Response, Router } from 'express';
import { Usuario } from '../models/UsuarioModel';
import { auth } from '../middleware/auth';

const router: Router = express.Router();

router.put('/:id/location', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      res.status(400).json({ erro: 'latitude e longitude são obrigatórios' });
      return;
    }

    if (String(req.user?.id) !== String(id)) {
      res.status(403).json({ erro: 'Você não pode atualizar a localização de outro usuário' });
      return;
    }

    const usuario = await Usuario.findByIdAndUpdate(
      id,
      { latitude, longitude, dataAtualizacaoLocalizacao: new Date() },
      { new: true }
    ).select('-senha');

    if (!usuario) {
      res.status(404).json({ erro: 'Usuário não encontrado' });
      return;
    }

    res.json(usuario);
  } catch (err: any) {
    res.status(500).json({ erro: err.message });
  }
});

export default router;