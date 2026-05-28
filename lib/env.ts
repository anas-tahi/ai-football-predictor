import { z } from "zod";

const envSchema = z.object({
  FOOTBALL_DATA_API_KEY: z.string().optional(),
  NEWSAPI_KEY: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  CRON_SECRET: z.string().optional(),
});

const parsed = envSchema.safeParse({
  FOOTBALL_DATA_API_KEY: process.env.FOOTBALL_DATA_API_KEY,
  NEWSAPI_KEY: process.env.NEWSAPI_KEY,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  CRON_SECRET: process.env.CRON_SECRET,
});

if (!parsed.success) {
  throw new Error(`Invalid environment variables: ${parsed.error.message}`);
}

export const env = parsed.data;

export const featureFlags = {
  hasFootballApiKey: Boolean(env.FOOTBALL_DATA_API_KEY),
  hasNewsApiKey: Boolean(env.NEWSAPI_KEY),
  hasRedis: Boolean(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN),
};
