import express, { NextFunction, Request, Response, Router } from 'express';
import { Voluntario } from '../models/VoluntarioModel';
import { Usuario } from '../models/UsuarioModel';
import { auth } from '../middleware/auth';
import { syncVoluntario } from '../services/postgres/voluntarioService';
import { statusOnlineSchema, validate, voluntarioSchema } from '../middleware/validation';

const router: Router = express.Router();

router.post('/onboarding', auth, validate(voluntarioSchema), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { experiencia, disponibilidade } = req.body;

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

    syncVoluntario(voluntario);

    await voluntario.save();
    res.status(201).json({ mensagem: 'Cadastro de voluntário realizado com sucesso', voluntario });
  } catch (err: any) {
    next(err);
  }
});

router.put('/status', auth, validate(statusOnlineSchema), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { online } = req.body;

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
    next(err);
  }
});

export default router;