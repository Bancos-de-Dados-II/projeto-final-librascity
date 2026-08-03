import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const usuarioRegisterSchema = z.object({
  nome: z.string().min(1, 'nome é obrigatório'),
  email: z.string().email('email inválido'),
  senha: z.string().min(1, 'senha é obrigatória'),
  telefone: z.string().optional(),
  tipoUsuario: z.string().min(1, 'tipoUsuario é obrigatório'),
  fotoPerfilUrl: z.string().url('fotoPerfilUrl deve ser uma URL válida').optional().or(z.literal('')),
});

export const estabelecimentoSchema = z.object({
  nome: z.string().min(1, 'nome é obrigatório'),
  categoria: z.string().optional(),
  fotoUrl: z.string().url('fotoUrl deve ser uma URL válida').optional().or(z.literal('')),
  localizacao: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
});

export const estabelecimentoUpdateSchema = estabelecimentoSchema.partial();

export const avaliacaoSchema = z.object({
  estabelecimentoId: z.string().min(1, 'estabelecimentoId é obrigatório'),
  nota: z.number().int().min(1).max(5),
  comentario: z.string().optional().or(z.literal('')),
});

export const solicitacaoAtendimentoSchema = z.object({
  latitudeAtual: z.number({ message: 'latitudeAtual deve ser um número' }),
  longitudeAtual: z.number({ message: 'longitudeAtual deve ser um número' }),
  fotoContextoUrl: z.string().url('fotoContextoUrl deve ser uma URL válida').optional().or(z.literal('')),
});

export const voluntarioSchema = z.object({
  experiencia: z.string().min(1, 'experiencia é obrigatória'),
  disponibilidade: z.string().min(1, 'disponibilidade é obrigatória'),
});

export const statusOnlineSchema = z.object({
  online: z.boolean({ message: 'online deve ser um booleano' }),
});

export const validate = (schema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({ errors: result.error.issues });
      return;
    }

    req.body = result.data;
    next();
  };
};
