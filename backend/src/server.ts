import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import cors from 'cors';
import { Pool } from 'pg';
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro no MongoDB:', err));

const pgPool = new Pool({
  connectionString: process.env.POSTGRES_URI,
  ssl: { rejectUnauthorized: false }
});

pgPool.on('error', (err) => {
  console.error('Erro inesperado no PostgreSQL:', err.message);
});

pgPool.connect()
  .then((client) => {
    console.log('Conectado ao PostgreSQL');
    client.release();
  })
  .catch(err => console.error('Erro no PostgreSQL:', err.message));

const redis = new Redis(process.env.REDIS_URL!);
redis.ping()
  .then(() => console.log('Conectado ao Redis'))
  .catch(err => console.error('Erro no Redis:', err));

import authRoutes from './routes/authRoutes';
import usuariosRoutes from './routes/usuariosRoutes';
import uploadRoutes from './routes/uploadRoutes';
import estabelecimentosRoutes from './routes/estabelecimentosRoutes';
import avaliacoesRoutes from './routes/avaliacoesRoutes';
import chamadosRoutes from './routes/chamadosRoutes';
import interpreteRoutes from './routes/interpreteRoutes';
import adminRoutes from './routes/adminRoutes';
import notificacaoRoutes from './routes/notificacaoRoutes';
import { errorHandler } from './middleware/errorHandler';

app.use('/', authRoutes);
app.use('/users', usuariosRoutes);
app.use('/uploads', uploadRoutes);
app.use('/estabelecimentos', estabelecimentosRoutes);
app.use('/places', avaliacoesRoutes);
app.use('/calls', chamadosRoutes);
app.use('/interpreter', interpreteRoutes);
app.use('/admin', adminRoutes);
app.use('/notificacao', notificacaoRoutes);

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});