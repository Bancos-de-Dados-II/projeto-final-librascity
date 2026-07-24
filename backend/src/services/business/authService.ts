import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Usuario } from '../../models/UsuarioModel';

export async function registerUser(
  nome: string,
  email: string,
  senha: string,
  tipoUsuario: string,   
  telefone?: number,
  fotoPerfilUrl?: string
) {
  const existing = await Usuario.findOne({ email });
  if (existing) {
    throw new Error('Email já cadastrado');
  }

  const salt = await bcrypt.genSalt(10);
  const senhaHash = await bcrypt.hash(senha, salt);

  const usuario = new Usuario({
    nome,
    email,
    senha: senhaHash,
    tipoUsuario,           
    telefone: telefone || 0,
    fotoPerfilUrl: fotoPerfilUrl || '',
    status: 'ATIVO',
    dataCadast: new Date()
  });

  await usuario.save();
  return usuario;
}

export async function loginUser(email: string, senha: string) {
  const usuario = await Usuario.findOne({ email }).select('+senha');
  if (!usuario) {
    throw new Error('Credenciais inválidas');
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) {
    throw new Error('Credenciais inválidas');
  }

  const token = jwt.sign(
    {
      id: usuario._id,
      email: usuario.email,
      tipoUsuario: usuario.tipoUsuario
    },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '7d' }
  );

  return {
    token,
    usuario: {
      id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      tipoUsuario: usuario.tipoUsuario,
      status: usuario.status
    }
  };
}