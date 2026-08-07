import { Usuario } from '../../models/UsuarioModel';
import { Avaliacao } from '../../models/AvaliacaoAtendimentoModel';
import { SolicitacaoAtendimento } from '../../models/SolicitacaoAtendimentoModel';
import { deleteUsuario, syncUsuario } from '../postgres/usuarioService';

export async function listarUsuariosAdmin(filters: Record<string, any> = {}, skip = 0, limit = 50) {
  const query: Record<string, any> = {};

  if (filters.tipoUsuario) query.tipoUsuario = filters.tipoUsuario;
  if (filters.status) query.status = filters.status;

  const [usuarios, total] = await Promise.all([
    Usuario.find(query).skip(skip).limit(limit).select('-senha').sort({ dataCadast: -1 }),
    Usuario.countDocuments(query)
  ]);

  return { usuarios, total };
}

export async function buscarUsuarioAdmin(id: string) {
  return Usuario.findById(id).select('-senha');
}

export async function atualizarUsuarioAdmin(id: string, payload: Record<string, any>) {
  const usuario = await Usuario.findByIdAndUpdate(
    id,
    payload,
    { new: true, runValidators: true }
  ).select('-senha');

  if (usuario) {
    await syncUsuario(usuario);
  }

  return usuario;
}

export async function deletarUsuarioAdmin(id: string) {
  const usuario = await Usuario.findById(id);
  if (!usuario) return null;

  await Avaliacao.deleteMany({ usuarioId: String(id) });
  await SolicitacaoAtendimento.deleteMany({
    $or: [{ idSurdo: String(id) }, { idInterprete: String(id) }]
  });

  const removido = await Usuario.findByIdAndDelete(id);
  if (removido) {
    await deleteUsuario(String(removido._id));
  }

  return removido;
}
