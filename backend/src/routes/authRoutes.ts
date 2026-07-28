import express, { Request, Response, Router } from 'express';
import { registerUser, loginUser } from '../services/business/authService';
import { auth } from '../middleware/auth';
import { Usuario } from '../models/UsuarioModel';
import { syncUsuario } from '../services/postgres/usuarioService';

const router: Router = express.Router();

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, email, senha, tipoUsuario, telefone, fotoPerfilUrl } = req.body;

    if (!nome || !email || !senha || !tipoUsuario) {
      res.status(400).json({ erro: 'nome, email, senha e tipoUsuario são obrigatórios' });
      return;
    }

    const usuario = await registerUser(nome, email, senha, tipoUsuario, telefone, fotoPerfilUrl);
    syncUsuario(usuario);

    res.status(201).json({ mensagem: 'Usuário criado com sucesso!', id: usuario._id });
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      res.status(400).json({ erro: 'Email e senha são obrigatórios' });
      return;
    }

    const resultado = await loginUser(email, senha);
    res.json(resultado);
  } catch (err: any) {
    res.status(401).json({ erro: err.message });
  }
});

router.get('/perfil', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const usuario = await Usuario.findById(req.user?.id).select('-senha');
    if (!usuario) {
      res.status(404).json({ erro: 'Usuário não encontrado' });
      return;
    }
    res.json(usuario);
  } catch (err: any) {
    res.status(500).json({ erro: err.message });
  }
});

router.put('/logout', auth, async (_req: Request, res: Response): Promise<void> => {
  res.json({ mensagem: 'Logout realizado com sucesso' });
});

export default router;
