// Shared Upstash helpers for the Maison Hiver snow globes (lylahuang.com/xmas).
import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: import.meta.env.KV_REST_API_URL,
  token: import.meta.env.KV_REST_API_TOKEN,
});

export const TTL = 60 * 60 * 24 * 180; // globes live for 180 days
export const globeKey = (id: string) => `globe:${id}`;
export const imgKey = (id: string) => `globe:img:${id}`;
export const cleanId = (raw: unknown) => String(raw || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12);

export type Globe = { g: unknown; at: number };
