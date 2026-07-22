import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = "";

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

        jwt.verify(token, SECRET);

        next();

    } catch {

        return res.sendStatus(403);

    }

}