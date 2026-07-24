/// <reference path="../@types/express/index.d.ts" />
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
    id: number;
    email: string;
    tipoUsuario: string;
}

export function auth(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.sendStatus(401);
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as TokenPayload;

        req.user = decoded;

        next();

    } catch {
        return res.sendStatus(403);
    }
}