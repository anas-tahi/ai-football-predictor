import { Redis } from "@upstash/redis";
import { env, featureFlags } from "@/lib/env";

type JsonValue = Record<string, unknown> | unknown[] | string | number | boolean | null;

const redis = featureFlags.hasRedis
  ? new Redis({
      url: env.UPSTASH_REDIS_REST_URL!,
      token: env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

export async function getCached<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  try {
    return (await redis.get<T>(key)) ?? null;
  } catch {
    return null;
  }
}

export async function setCached(key: string, value: JsonValue, ttlSeconds?: number) {
  if (!redis) return;
  try {
    if (ttlSeconds) {
      await redis.set(key, value, { ex: ttlSeconds });
      return;
    }
    await redis.set(key, value);
  } catch {
    return;
  }
}

export async function withCache<T>(
  key: string,
  ttl: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const cached = await getCached<T>(key);
  if (cached) return cached;
  const fresh = await fetcher();
  await setCached(key, fresh as JsonValue, ttl);
  return fresh;
}