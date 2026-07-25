import express, { Request, Response, Router } from 'express';
import { Vonluntario } from '../models/VoluntarioModel';
import { auth } from '../middleware/auth';

const router: Router = express.Router();

router.put('/status', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { online } = req.body;

    if (typeof online !== 'boolean') {
      res.status(400).json({ erro: 'Campo "online" deve ser true ou false' });
      return;
    }

    const voluntario = await Vonluntario.findOneAndUpdate(
      { idUsuario: req.user?.id },
      { statusOnline: online },
      { new: true, upsert: false }
    );

    if (!voluntario) {
      res.status(404).json({ erro: 'Cadastro de voluntário/intérprete não encontrado para este usuário' });
      return;
    }

    res.json(voluntario);
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

export default router;
