import fs from 'fs';
import path from 'path';
import { NextFunction, Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';

const uploadDir = path.resolve(__dirname, '../../uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void
  ) => {
    callback(null, uploadDir);
  },
  filename: (
    _req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void
  ) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e6)}${extension}`;
    callback(null, safeName);
  }
});

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
): void => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(extension) || !allowedMimeTypes.includes(file.mimetype)) {
    callback(new Error('Tipo de imagem inválido. Use apenas JPG, JPEG, PNG ou GIF.'));
    return;
  }

  callback(null, true);
};

const uploadInstance = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

export const uploadSingle = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  uploadInstance.single('imagem')(req, res, (error: any) => {
    if (error) {
      if (error instanceof multer.MulterError) {
        res.status(400).json({ erro: error.message });
        return;
      }

      res.status(400).json({ erro: error.message || 'Falha no upload da imagem.' });
      return;
    }

    next();
  });
};
