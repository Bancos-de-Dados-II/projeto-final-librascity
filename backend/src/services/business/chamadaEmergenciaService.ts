import { SolicitacaoAtendimento } from '../../models/SolicitacaoAtendimentoModel';
import { Usuario } from '../../models/UsuarioModel';

export async function listarChamadasUsuarioLogado(userId: string, tipoUsuario: string) {
  if (tipoUsuario === 'ADMIN') {
    return SolicitacaoAtendimento.find().sort({ dataAbertura: -1 });
  }

  if (tipoUsuario === 'surdo') {
    return SolicitacaoAtendimento.find({ idSurdo: String(userId) }).sort({ dataAbertura: -1 });
  }

  if (tipoUsuario === 'interprete' || tipoUsuario === 'INTERPRETE') {
    return SolicitacaoAtendimento.find({ idInterprete: String(userId) }).sort({ dataAbertura: -1 });
  }

  return SolicitacaoAtendimento.find({ idSurdo: String(userId) }).sort({ dataAbertura: -1 });
}

export async function listarTodasChamadasAdmin() {
  return SolicitacaoAtendimento.find().sort({ dataAbertura: -1 });
}

export async function cancelarChamado(id: string, idSurdo: string) {
  const chamado = await SolicitacaoAtendimento.findById(id);
  if (!chamado) {
    return null;
  }

  if (String(chamado.idSurdo) !== String(idSurdo)) {
    throw new Error('Apenas o usuário que abriu a chamada pode cancelá-la');
  }

  if (chamado.status !== 'AGUARDANDO') {
    throw new Error('Só é permitido cancelar chamadas com status AGUARDANDO');
  }

  chamado.status = 'CANCELADA';
  await chamado.save();

  return chamado;
}
