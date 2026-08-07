import { Voluntario } from '../../models/VoluntarioModel';
import { Usuario } from '../../models/UsuarioModel';
import { deleteVoluntario, syncVoluntario } from '../postgres/voluntarioService';

export async function listarVoluntariosAdmin(filters: Record<string, any> = {}) {
  const query: Record<string, any> = {};
  if (filters.statusOnline !== undefined) query.statusOnline = filters.statusOnline;

  return Voluntario.find(query).sort({ idInterprete: -1 });
}

export async function buscarVoluntarioAdmin(id: string) {
  return Voluntario.findById(id);
}

export async function atualizarVoluntarioAdmin(id: string, payload: Record<string, any>) {
  const voluntario = await Voluntario.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (voluntario) {
    await syncVoluntario(voluntario);
  }
  return voluntario;
}

export async function deletarVoluntarioAdmin(id: string) {
  const voluntario = await Voluntario.findById(id);
  if (!voluntario) return null;

  const removido = await Voluntario.findByIdAndDelete(id);
  if (removido) {
    await deleteVoluntario(String(removido._id));
  }

  return removido;
}
