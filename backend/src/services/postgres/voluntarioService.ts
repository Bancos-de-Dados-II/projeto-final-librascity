import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
  ssl: { rejectUnauthorized: false }
});

export async function syncVoluntario(dados: any): Promise<void> {
  const { idUsuario, _id, experiencia, statusOnline, disponibilidade, criado_em } = dados;

  const query = `
    INSERT INTO voluntarios (id_mongo, id_usuario_mongo, experiencia, disponibilidade, status_online, criado_em)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (id_mongo) DO UPDATE SET
      id_usuario_mongo = EXCLUDED.id_usuario_mongo,
      experiencia = EXCLUDED.experiencia,
      disponibilidade = EXCLUDED.disponibilidade,
      status_online = EXCLUDED.status_online,
      criado_em = EXCLUDED.criado_em
  `;
  await pool.query(query, [_id, idUsuario, experiencia, disponibilidade, statusOnline, criado_em]);
  console.log(`Sincronizado no PostgreSQL: ${_id}`);
}

export async function deleteVoluntario(idMongo: string): Promise<void> {
  await pool.query('DELETE FROM voluntarios WHERE id_mongo = $1', [idMongo]);
  console.log(`Removido do PostgreSQL: ${idMongo}`);
}