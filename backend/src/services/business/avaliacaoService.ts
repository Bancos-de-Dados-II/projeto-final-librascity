import { Estabelecimento } from '../../models/EstabelecimentoModel';
import { Avaliacao } from '../../models/AvaliacaoAtendimentoModel';

export async function recalcularNotaMedia(estabelecimentoId: string): Promise<void> {
  const idNum = Number(estabelecimentoId);
  if (isNaN(idNum)) {
    throw new Error('ID do estabelecimento inválido');
  }

  const avaliacoes = await Avaliacao.find({ idAtendimento: idNum });
  const total = avaliacoes.length;

  if (total === 0) {
    await Estabelecimento.findByIdAndUpdate(estabelecimentoId, { notaMedia: 0 });
    return;
  }

  const soma = avaliacoes.reduce((acc, a) => acc + a.nota, 0);
  const media = soma / total;
  await Estabelecimento.findByIdAndUpdate(estabelecimentoId, { notaMedia: media });
}