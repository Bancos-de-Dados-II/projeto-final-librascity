import { NextFunction, Request, Response } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  console.error('Erro:', err?.stack || err?.message || err);
  const status = err?.status || 500;
  res.status(status).json({ erro: err?.message || 'Erro interno do servidor' });
}
