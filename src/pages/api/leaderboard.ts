import type { APIRoute } from 'astro';
import { Redis } from '@upstash/redis';

export const prerender = false;

const redis = new Redis({
  url: import.meta.env.KV_REST_API_URL,
  token: import.meta.env.KV_REST_API_TOKEN,
});

const KEY = 'duck:leaderboard';

export const GET: APIRoute = async () => {
  try {
    const raw = (await redis.zrange(KEY, 0, 4, { rev: true, withScores: true })) as (string | number)[];
    const out: { initials: string; score: number }[] = [];
    for (let i = 0; i < raw.length; i += 2) {
      out.push({ initials: String(raw[i]).split('#')[0], score: Number(raw[i + 1]) });
    }
    return new Response(JSON.stringify(out), {
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    });
  } catch (err) {
    return new Response(JSON.stringify([]), { headers: { 'content-type': 'application/json' } });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { initials, score } = await request.json();
    const cleanInitials = String(initials || 'AAA')
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .slice(0, 3)
      .padEnd(3, 'A');
    const cleanScore = Math.max(0, Math.min(500, Math.floor(Number(score) || 0)));
    if (cleanScore <= 0) return new Response('bad score', { status: 400 });

    const member = `${cleanInitials}#${Date.now()}`;
    await redis.zadd(KEY, { score: cleanScore, member });
    // Keep only top 50
    await redis.zremrangebyrank(KEY, 0, -51);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'failed' }), { status: 500 });
  }
};
