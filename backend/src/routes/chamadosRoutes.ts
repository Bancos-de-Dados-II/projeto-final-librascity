import express, { Request, Response, Router } from 'express';
import { SolicitacaoAtendimento } from '../models/SolicitacaoAtendimentoModel';
import { Usuario } from '../models/UsuarioModel';
import { gerarLinkWhatsApp } from '../services/business/whatsappService';
import { auth } from '../middleware/auth';

const router: Router = express.Router();

router.post('/request', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { latitudeAtual, longitudeAtual, fotoContextoUrl } = req.body;

    if (latitudeAtual === undefined || longitudeAtual === undefined) {
      res.status(400).json({ erro: 'latitudeAtual e longitudeAtual são obrigatórios' });
      return;
    }

    const chamado = new SolicitacaoAtendimento({
      idSolicitacao: Date.now(),
      idSurdo: String(req.user?.id),
      tipoAtend: 'EMERGENCIA',
      status: 'AGUARDANDO',
      prioridade: 'ALTA',
      latitudeAtual,
      longitudeAtual,
      fotoContextoUrl,
    });

    await chamado.save();
    res.status(201).json({ id: chamado._id, status: chamado.status });
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

router.get('/:id/status', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const chamado = await SolicitacaoAtendimento.findById(req.params.id);
    if (!chamado) {
      res.status(404).json({ erro: 'Chamado não encontrado' });
      return;
    }

    if (chamado.status === 'EM_CURSO' && chamado.idInterprete) {
      const interprete = await Usuario.findById(chamado.idInterprete);
      const link = interprete ? gerarLinkWhatsApp(String(interprete.telefone)) : null;
      res.json({ status: chamado.status, linkWhatsapp: link });
      return;
    }

    res.json({ status: chamado.status });
  } catch (err: any) {
    res.status(500).json({ erro: err.message });
  }
});

router.get('/pending', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const pendentes = await SolicitacaoAtendimento.find({ status: 'AGUARDANDO' })
      .sort({ dataAbertura: 1 });
    res.json(pendentes);
  } catch (err: any) {
    res.status(500).json({ erro: err.message });
  }
});

router.put('/:id/accept', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const chamado = await SolicitacaoAtendimento.findById(req.params.id);
    if (!chamado) {
      res.status(404).json({ erro: 'Chamado não encontrado' });
      return;
    }

    if (chamado.status !== 'AGUARDANDO') {
      res.status(409).json({ erro: 'Chamado já foi aceito ou não está mais disponível' });
      return;
    }

    chamado.idInterprete = String(req.user?.id);
    chamado.status = 'EM_CURSO';
    chamado.dataHoraAceite = new Date();
    await chamado.save();

    const solicitante = await Usuario.findById(chamado.idSurdo);
    const link = solicitante ? gerarLinkWhatsApp(String(solicitante.telefone)) : null;

    res.json({
      mensagem: 'Chamado aceito',
      chamado,
      whatsappSolicitante: solicitante?.telefone,
      linkWhatsapp: link,
    });
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

router.put('/:id/complete', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const chamado = await SolicitacaoAtendimento.findById(req.params.id);
    if (!chamado) {
      res.status(404).json({ erro: 'Chamado não encontrado' });
      return;
    }

    chamado.status = 'FINALIZADA';
    chamado.dataHoraFim = new Date();
    await chamado.save();

    res.json({ mensagem: 'Atendimento concluído', chamado });
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

export default router;