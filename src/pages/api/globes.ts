import type { APIRoute } from 'astro';
import { redis, TTL, globeKey, imgKey, cleanId, type Globe } from '../../lib/globes';

export const prerender = false;

const json = (body: unknown, status = 200, cache = 'no-store') =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': cache } });

const ALPHA = 'abcdefghijkmnpqrstuvwxyz23456789'; // no l/o/0/1, easy to read aloud
const newId = () => Array.from(crypto.getRandomValues(new Uint8Array(8)), b => ALPHA[b & 31]).join('');

// GET /api/globes?id=<id>  ->  { g }
export const GET: APIRoute = async ({ url }) => {
  const id = cleanId(url.searchParams.get('id'));
  if (!id) return json({ error: 'missing id' }, 400);
  try {
    const row = await redis.get<Globe>(globeKey(id));
    if (!row) return json({ error: 'not found' }, 404);
    return json({ g: row.g }, 200, 'public, max-age=60, s-maxage=3600');
  } catch {
    return json({ error: 'unavailable' }, 503);
  }
};

// POST /api/globes  { g, img? }  ->  { id }
export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const text = await request.text();
    if (text.length > 160_000) return json({ error: 'too large' }, 413);
    const body = JSON.parse(text);
    const g = body?.g;
    // shape check: { v, s: [...settings, message, ...], i: [items] }
    if (!g || typeof g !== 'object' || !Array.isArray(g.s) || !Array.isArray(g.i)) return json({ error: 'bad globe' }, 400);
    if (JSON.stringify(g).length > 12_000 || g.i.length > 200) return json({ error: 'bad globe' }, 400);
    const img = typeof body.img === 'string' && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(body.img) && body.img.length < 140_000 ? body.img : null;

    // gentle rate limit: 40 globes per address per hour
    let ip = 'anon';
    try { ip = clientAddress || 'anon'; } catch {}
    const rl = `globe:rl:${ip}`;
    const n = await redis.incr(rl);
    if (n === 1) await redis.expire(rl, 3600);
    if (n > 40) return json({ error: 'slow down' }, 429);

    let id = '';
    for (let tries = 0; tries < 4 && !id; tries++) {
      const candidate = newId();
      const ok = await redis.set(globeKey(candidate), { g, at: Date.now() } satisfies Globe, { nx: true, ex: TTL });
      if (ok) id = candidate;
    }
    if (!id) return json({ error: 'try again' }, 503);
    if (img) await redis.set(imgKey(id), img.slice(img.indexOf(',') + 1), { ex: TTL });
    return json({ id });
  } catch {
    return json({ error: 'bad request' }, 400);
  }
};
