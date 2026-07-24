import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { Usuario } from "../../../backend/src/models/UsuarioModel";

export async function register(req: Request, res: Response) {

    try {

        const {
            nome,
            email,
            senha,
            telefone
        } = req.body;

        const usuarioExiste = await Usuario.findOne({
            email
        });

        if (usuarioExiste) {
            return res.status(400).json({
                message: "E-mail já cadastrado."
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const ultimoUsuario = await Usuario.findOne()
            .sort({ id: -1 });

        const novoUsuario = await Usuario.create({

            id: ultimoUsuario
                ? ultimoUsuario.id + 1
                : 1,

            nome,

            email,

            senha: senhaHash,

            telefone,

            tipoUsuario: "usuario",

            status: "ativo"

        });

        return res.status(201).json({

            message: "Usuário criado.",

            usuario: {

                id: novoUsuario.id,

                nome: novoUsuario.nome,

                email: novoUsuario.email

            }

        });

    } catch (error) {

        return res.status(500).json({
            message: "Erro interno."
        });

    }

}