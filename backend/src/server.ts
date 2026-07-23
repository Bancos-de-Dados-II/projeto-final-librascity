import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Pool } from 'pg';
import Redis from 'ioredis';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import { auth } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro no MongoDB:', err));

const pgPool = new Pool({
  connectionString: process.env.POSTGRES_URI,
  ssl: { rejectUnauthorized: false }
});
pgPool.connect()
  .then(() => console.log('Conectado ao PostgreSQL'))
  .catch(err => console.error('Erro no PostgreSQL:', err.message));

const redis = new Redis(process.env.REDIS_URI!);
redis.ping()
  .then(() => console.log('Conectado ao Redis'))
  .catch(err => console.error('Erro no Redis:', err));

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }
  const token = jwt.sign(
    { email },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '1h' }
  );
  res.json({ token });
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }
  res.status(201).json({ message: 'Usuário criado com sucesso!' });
});

app.get('/perfil', auth, (req, res) => {
  res.json({ nome: 'Usuário autenticado', email: req.body.email });
});

import estabelecimentosRoutes from './routes/estabelecimentos';
app.use('/estabelecimentos', estabelecimentosRoutes);

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});