import type { APIRoute } from 'astro';
import { redis, imgKey, cleanId } from '../../lib/globes';

export const prerender = false;

// GET /api/globe-img?id=<id>  ->  the globe's share picture (link previews in chats)
export const GET: APIRoute = async ({ url, redirect }) => {
  const id = cleanId(url.searchParams.get('id'));
  try {
    const b64 = id ? await redis.get<string>(imgKey(id)) : null;
    if (!b64) return redirect('/xmas/og.jpg', 302);
    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    return new Response(bytes, { headers: { 'content-type': 'image/jpeg', 'cache-control': 'public, max-age=86400, s-maxage=604800, immutable' } });
  } catch {
    return redirect('/xmas/og.jpg', 302);
  }
};
