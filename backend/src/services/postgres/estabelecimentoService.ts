import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
  ssl: { rejectUnauthorized: false }
});

export async function syncEstabelecimento(dados: any): Promise<void> {
  const { _id, nome, categoria, notaMedia, localizacao } = dados;
  const lng = localizacao.coordinates[0];
  const lat = localizacao.coordinates[1];

  const query = `
    INSERT INTO estabelecimentos (id_mongo, nome, categoria, latitude, longitude, nota_media)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (id_mongo) DO UPDATE SET
      nome = EXCLUDED.nome,
      categoria = EXCLUDED.categoria,
      latitude = EXCLUDED.latitude,
      longitude = EXCLUDED.longitude,
      nota_media = EXCLUDED.nota_media
  `;
  await pool.query(query, [_id, nome, categoria, lat, lng, notaMedia]);
  console.log(`Sincronizado no PostgreSQL: ${nome}`);
}

export async function deleteEstabelecimento(idMongo: string): Promise<void> {
  await pool.query('DELETE FROM estabelecimentos WHERE id_mongo = $1', [idMongo]);
  console.log(`Removido do PostgreSQL: ${idMongo}`);
}