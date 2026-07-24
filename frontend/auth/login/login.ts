import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { Usuario } from "../../../backend/src/models/UsuarioModel";
import dotenv from "dotenv";

dotenv.config();

export async function login(req:Request, res:Response) {

    const {
        email,
        senha
    } = req.body;

    const usuario = await Usuario.findOne({
        email
    });

    if (!usuario) {

        return res.status(401).json({

            message: "Credenciais inválidas."

        });

    }

    const senhaValida = await bcrypt.compare(
        senha,
        usuario.senha
    );

    if (!senhaValida) {

        return res.status(401).json({

            message: "Credenciais inválidas."

        });

    }
    
    const token = jwt.sign(

        {

            id: usuario.id,

            email: usuario.email,

            tipoUsuario: usuario.tipoUsuario

        },

        process.env.JWT_SECRET!,

        {

            expiresIn: "1h"

        }

    );

    return res.json({

        token,

        usuario: {

            id: usuario.id,

            nome: usuario.nome,

            email: usuario.email

        }

    });

}