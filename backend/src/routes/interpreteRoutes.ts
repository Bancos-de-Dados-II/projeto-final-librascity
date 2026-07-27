import express, { Request, Response, Router } from 'express';
import { Voluntario } from '../models/VoluntarioModel';
import { Usuario } from '../models/UsuarioModel';
import { auth } from '../middleware/auth';

const router: Router = express.Router();

router.post('/onboarding', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { experiencia, disponibilidade } = req.body;

    if (!experiencia || !disponibilidade) {
      res.status(400).json({ erro: 'experiencia e disponibilidade são obrigatórios' });
      return;
    }

    const usuario = await Usuario.findById(req.user?.id);
    if (!usuario) {
      res.status(404).json({ erro: 'Usuário não encontrado' });
      return;
    }

    if (usuario.tipoUsuario !== 'interprete') {
      res.status(403).json({ erro: 'Somente usuários do tipo intérprete podem se cadastrar como voluntário' });
      return;
    }

    const jaExiste = await Voluntario.findOne({ idUsuario: String(req.user?.id) });
    if (jaExiste) {
      res.status(409).json({ erro: 'Este usuário já possui cadastro de voluntário', voluntario: jaExiste });
      return;
    }

    const voluntario = new Voluntario({
      idUsuario: String(req.user?.id),
      idInterprete: Date.now(),
      experiencia,
      disponibilidade,
      statusOnline: false,
    });

    await voluntario.save();
    res.status(201).json({ mensagem: 'Cadastro de voluntário realizado com sucesso', voluntario });
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

router.put('/status', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { online } = req.body;

    if (typeof online !== 'boolean') {
      res.status(400).json({ erro: 'Campo "online" deve ser true ou false' });
      return;
    }

    const voluntario = await Voluntario.findOneAndUpdate(
      { idUsuario: String(req.user?.id) },
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