import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URI!);

const CACHE_TTL = 60;

export async function getCache<T>(key: string): Promise<T | null> {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}

export async function setCache<T>(key: string, value: T): Promise<void> {
  await redis.set(key, JSON.stringify(value), 'EX', CACHE_TTL);
}

export async function invalidateCache(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(keys);
    console.log(`Cache invalidado: ${keys.length} chaves`);
  }
}