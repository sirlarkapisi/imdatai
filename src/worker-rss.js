// IMDATAI — Cloudflare Workers RSS Proxy
// src/worker-rss.js olarak kaydedin

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const CORS = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json;charset=utf-8',
      'Cache-Control': 'public,max-age=1800',
    };

    if (request.method === 'OPTIONS') return new Response(null, {headers:CORS});

    // /api/rss dışındaki her şey → normal site
    if (!url.pathname.startsWith('/api/rss')) {
      return env.ASSETS.fetch(request);
    }

    const q = url.searchParams.get('q') || 'artificial intelligence';
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=tr&gl=TR&ceid=TR:tr`;

    try {
      const r = await fetch(rssUrl, {headers:{'User-Agent':'Mozilla/5.0 IMDATAI'}});
      const xml = await r.text();
      const items = [];
      const rx = /<item>([\s\S]*?)<\/item>/g;
      let m;
      while ((m = rx.exec(xml)) !== null && items.length < 6) {
        const s = m[1];
        const g = t => {
          const x = s.match(new RegExp(`<${t}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${t}>`));
          return x ? x[1].trim() : '';
        };
        const title = g('title');
        const link = g('link');
        const desc = g('description').replace(/<[^>]+>/g,'').slice(0,160);
        const date = g('pubDate');
        if (title) items.push({title, url:link, desc, date});
      }
      return Response.json({ok:true, items, q}, {headers:CORS});
    } catch(e) {
      return Response.json({ok:false, items:[], error:e.message}, {headers:CORS});
    }
  }
};
