import express, { Request, Response, Router } from 'express';
import { auth } from '../middleware/auth';
import { uploadSingle } from '../middleware/upload';

const router: Router = express.Router();

router.post('/media', auth, uploadSingle, (req: Request, res: Response): void => {
  try {
    if (!req.file) {
      res.status(400).json({ erro: 'Nenhuma imagem enviada' });
      return;
    }

    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(201).json({ url_imagem: url });
  } catch (err: any) {
    res.status(500).json({ erro: err.message });
  }
});

export default router;
