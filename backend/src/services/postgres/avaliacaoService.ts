import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
  ssl: { rejectUnauthorized: false }
});

export async function syncAvaliacao(dados: any): Promise<void> {
  const { _id, estabelecimentoId, usuarioId, nota, comentario, dataAvaliacao } = dados;

  const query = `
    INSERT INTO avaliacoes (id_mongo, id_estabelecimento_mongo, id_usuario_mongo, nota, comentario, data_avaliacao)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (id_mongo) DO UPDATE SET
      id_estabelecimento_mongo = EXCLUDED.id_estabelecimento_mongo,
      id_usuario_mongo = EXCLUDED.id_usuario_mongo,
      nota = EXCLUDED.nota,
      comentario = EXCLUDED.comentario,
      data_avaliacao = EXCLUDED.data_avaliacao
  `;

  await pool.query(query, [_id, estabelecimentoId, usuarioId, nota, comentario, dataAvaliacao]);
  console.log(`Sincronizado no PostgreSQL: ${_id}`);
}

export async function deleteAvaliacao(idMongo: string): Promise<void> {
  await pool.query('DELETE FROM avaliacoes WHERE id_mongo = $1', [idMongo]);
  console.log(`Removido do PostgreSQL: ${idMongo}`);
}
