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

app.listen(3000);

app.get("/perfil", auth, (req, res) => {

    res.json({
        nome: "Usuário autenticado"
    });

});