import express, { Request, Response, Router } from 'express';
import { auth } from '../middleware/auth';

const router: Router = express.Router();

router.post('/media', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { nomeArquivo, tipo } = req.body;

    if (!nomeArquivo) {
      res.status(400).json({ erro: 'nomeArquivo é obrigatório' });
      return;
    }

    const urlSimulada = `https://storage.librascity.fake/${Date.now()}-${nomeArquivo}`;

    res.status(201).json({
      url_imagem: urlSimulada,
      tipo: tipo || 'image',
    });
  } catch (err: any) {
    res.status(500).json({ erro: err.message });
  }
});

export default router;
