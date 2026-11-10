import type { APIRoute } from 'astro';
import { redis, globeKey, cleanId, type Globe } from '../../../lib/globes';
// The app's HTML is bundled into this function at build time (fetching our own domain
// from inside the function failed on Vercel).
import template from '../../../../public/xmas/app.html?raw';

export const prerender = false;

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

// GET /xmas/g/<id> — the snow globe app with a saved globe built in, plus link-preview tags
// so WhatsApp / iMessage / socials show the globe's own picture.
export const GET: APIRoute = async ({ params, url, request }) => {
  // On Vercel `url` says localhost; the real public host is in the forwarded headers.
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const origin = host ? `https://${host}` : url.origin;
  const id = cleanId(params.id);
  let html: string = template;
  // (app.html already carries <base href="/xmas/"> so its relative asset paths resolve)

  let row: Globe | null = null;
  try { row = id ? await redis.get<Globe>(globeKey(id)) : null; } catch {}
  if (!row) {
    return new Response(html, { status: 404, headers: { 'content-type': 'text/html; charset=utf-8' } });
  }

  const page = `${origin}/xmas/g/${id}`;
  const meta = [
    `<meta property="og:title" content="Someone made you a snow globe" />`,
    `<meta property="og:description" content="Open it, give it a shake. There's a note inside." />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${esc(page)}" />`,
    `<meta property="og:image" content="${esc(`${origin}/api/globe-img?id=${id}`)}" />`,
    `<meta property="og:image:width" content="480" /><meta property="og:image:height" content="480" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join('\n');
  // JSON inside a script tag: escape "<" so a message can never close the tag
  const data = `<script>window.__GLOBE__ = ${JSON.stringify(row.g).replace(/</g, '\\u003c')};</script>`;
  html = html
    .replace(/<meta (property="og:[^"]+"|name="twitter:card")[^>]*>\s*/g, '')
    .replace(/<title>[^<]*<\/title>/, '<title>A snow globe for you</title>')
    .replace('</head>', `${meta}\n${data}\n</head>`);

  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=60, s-maxage=86400' },
  });
};
