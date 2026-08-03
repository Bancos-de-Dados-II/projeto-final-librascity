import "express";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
                tipoUsuario: string;
            };
            file?: Express.Multer.File;
        }
    }
}

export {};