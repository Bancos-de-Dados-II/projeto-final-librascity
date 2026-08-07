import { Avaliacao } from '../../models/AvaliacaoAtendimentoModel';
import { Estabelecimento } from '../../models/EstabelecimentoModel';
import { recalcularNotaMedia } from './avaliacaoService';

export async function listarAvaliacoes(filters: Record<string, any> = {}) {
  const query: Record<string, any> = {};

  if (filters.estabelecimentoId) query.estabelecimentoId = filters.estabelecimentoId;
  if (filters.usuarioId) query.usuarioId = filters.usuarioId;
  if (filters.nota) query.nota = Number(filters.nota);

  return Avaliacao.find(query).sort({ dataAvaliacao: -1 });
}

export async function buscarAvaliacao(id: string) {
  return Avaliacao.findById(id);
}

export async function atualizarAvaliacaoAdminOuAutor(id: string, payload: Record<string, any>, usuario?: any) {
  const avaliacao = await Avaliacao.findById(id);
  if (!avaliacao) return null;

  const tokenUserId = String(usuario?.id ?? '');
  const isAdmin = usuario?.tipoUsuario === 'ADMIN';

  if (!isAdmin && String(avaliacao.usuarioId ?? '') !== tokenUserId) {
    throw new Error('Você só pode alterar a sua própria avaliação');
  }

  Object.assign(avaliacao, payload);
  await avaliacao.save();

  await recalcularNotaMedia(String(avaliacao.estabelecimentoId));
  return avaliacao;
}

export async function deletarAvaliacaoAdminOuAutor(id: string, usuario?: any) {
  const avaliacao = await Avaliacao.findById(id);
  if (!avaliacao) return null;

  const tokenUserId = String(usuario?.id ?? '');
  const isAdmin = usuario?.tipoUsuario === 'ADMIN';

  if (!isAdmin && String(avaliacao.usuarioId ?? '') !== tokenUserId) {
    throw new Error('Você só pode remover a sua própria avaliação');
  }

  const estabelecimentoId = String(avaliacao.estabelecimentoId);
  await Avaliacao.findByIdAndDelete(id);
  await recalcularNotaMedia(estabelecimentoId);

  return avaliacao;
}
