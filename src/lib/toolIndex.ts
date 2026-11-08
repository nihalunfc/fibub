// The site-wide search index: every live tool's name, summary, #number, link and place on the site.
// Search boxes (home page and the Tools panel) load it once; it is a plain file, so it works offline
// once loaded and sends nothing about the visitor. Each language has its own copy (/ml/tools.json).
import { allTools, toolPlace } from './tools';
import { useLang } from '../i18n';

export async function toolIndex(code: string) {
  const L = useLang(code);
  const tools = (await allTools()).filter((t) => t.data.status === 'live');
  const rows = tools.map((t) => {
    const { section, subject } = toolPlace(t);
    const s = L.summary(t);
    return {
      id: t.id,
      n: t.data.name,
      s,
      ...(s !== t.data.summary ? { x: t.data.summary } : {}),
      k: t.data.num,
      u: L.toolUrl(t),
      p: [L.shelf(t.data.shelf).name, subject && L.subject(subject).name, section && L.section(section).name].filter(Boolean).join(' › '),
    };
  });
  return new Response(JSON.stringify(rows), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
