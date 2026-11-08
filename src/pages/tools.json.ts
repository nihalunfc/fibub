// The site-wide search index: every live tool's name, summary, #number, link and place on the site.
// Search boxes (home page and the Tools panel) load it once; it is a plain file, so it works offline
// once loaded and sends nothing about the visitor.
import type { APIRoute } from 'astro';
import { shelfById } from '../site';
import { allTools, toolPlace, toolUrl } from '../lib/tools';

export const GET: APIRoute = async () => {
  const tools = (await allTools()).filter((t) => t.data.status === 'live');
  const rows = tools.map((t) => {
    const { section, subject } = toolPlace(t);
    return {
      id: t.id,
      n: t.data.name,
      s: t.data.summary,
      k: t.data.num,
      u: toolUrl(t),
      p: [shelfById(t.data.shelf).name, subject?.name, section?.name].filter(Boolean).join(' › '),
    };
  });
  return new Response(JSON.stringify(rows), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
