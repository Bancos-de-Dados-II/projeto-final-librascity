import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";

import {auth} from "./middleware/auth"

const app = express();

app.use(cors());
app.use(express.json());

const SECRET = "";

app.post("/login", (req, res) => {

    const { email, password } = req.body;

    const token = jwt.sign(
        {
            email
        },
        SECRET,
        {
            expiresIn: "1h"
        }
    );

    res.json({
        token
    });

});

app.post("/register", async (req, res) => {

    const { name, email, password } = req.body;

    res.status(201).json({
        message: "Usuário criado com sucesso!"
    });

});

app.listen(3000);

app.get("/perfil", auth, (req, res) => {

    res.json({
        nome: "Usuário autenticado"
    });

});