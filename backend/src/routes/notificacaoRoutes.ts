import express, { Request, Response, Router } from 'express';
import { Notificacao } from '../models/NotificacaoModel';
import { auth } from '../middleware/auth';
import { Usuario } from '../models/UsuarioModel';
import { notificacoesEnviadas, notificacoesRecebidas } from '../services/business/notificacaoService';

const router: Router = express.Router();

router.get('/recebidas/:id', auth, async (req: Request, res: Response) => {
    try
    {
        const { id } = req.params;
        const result = await notificacoesRecebidas(id as string);

        res.json(result);
    }

    catch (err: any)
    {
        res.status(500).json({ erro: err.message });
    }
});

router.get('/enviadas/:id', auth, async (req: Request, res: Response) => {
    try
    {
        const { id } = req.params;
        const result = await notificacoesEnviadas(id as string);

        res.json(result);
    }

    catch (err: any)
    {
        res.status(500).json({ erro: err.message });
    }
});

export default router;