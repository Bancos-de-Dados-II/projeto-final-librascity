import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
  ssl: { rejectUnauthorized: false }
});

export async function syncUsuario(dados: any): Promise<void> {
  const { _id, nome, email, senha, telefone, tipo_usuario, status, foto_perfil_url, criado_em } = dados;

  const query = `
    INSERT INTO usuarios (id_mongo, nome, email, senha, telefone, tipo_usuario, status, foto_perfil_url, criado_em)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (id_mongo) DO UPDATE SET
      nome = EXCLUDED.nome,
      email = EXCLUDED.email,
      senha = EXCLUDED.senha,
      telefone = EXCLUDED.telefone,
      tipo_usuario = EXCLUDED.tipo_usuario,
      status = EXCLUDED.status,
      foto_perfil_url = EXCLUDED.foto_perfil_url,
      criado_em = EXCLUDED.criado_em
  `;
  await pool.query(query, [_id, nome, email, senha, telefone, tipo_usuario, status, foto_perfil_url, criado_em]);
  console.log(`Sincronizado no PostgreSQL: ${nome}`);
}

export async function deleteUsuario(idMongo: string): Promise<void> {
  await pool.query('DELETE FROM usuarios WHERE id_mongo = $1', [idMongo]);
  console.log(`Removido do PostgreSQL: ${idMongo}`);
}