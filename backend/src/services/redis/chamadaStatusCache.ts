import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URI!);

const CACHE_TTL = 60;

export async function setChamadaStatus(id: string, status: string): Promise<void> {
  await redis.set(`chamada:${id}`, status, 'EX', 10);
}

export async function getChamadaStatus(id: string): Promise<string | null> {
  return await redis.get(`chamada:${id}`);
}