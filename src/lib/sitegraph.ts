// The site map's network chart: every part of fibub as a node (home, areas, shelves, subjects, blog
// kinds) and two kinds of links: the menu tree (which page sits under which) and the cross-links that
// tie parts together (tools listed as related to each other, and blog articles that link to tools).
// Worked out at build time from the tool and article files, so it grows by itself.
import { SHELVES, SUBJECTS, SECTIONS, LEARN_SHELF } from '../site';
import { bySubject, toolPlace, type Tool } from './tools';
import { KINDS, kindOf, mentions, type Article } from './blog';

export type Node = { id: string; name: string; url: string; parent?: string; count: number; depth: number; x: number; y: number; angle: number };
export type Link = { a: string; b: string; n: number; kind: 'related' | 'article' };

export function siteGraph(tools: Tool[], articles: Article[], size = 720) {
  const live = tools.filter((t) => t.data.status === 'live');
  const nodes: Omit<Node, 'x' | 'y' | 'angle' | 'depth'>[] = [];
  const add = (id: string, name: string, url: string, parent?: string, count = 0) => nodes.push({ id, name, url, parent, count });

  add('home', 'Home', '/');
  // Learn
  const learnLive = live.filter((t) => t.data.shelf === 'learn');
  add('learn', 'Learn', '/learn/', 'home', learnLive.length);
  add('learn:school', 'Class 8 to 12', '/learn/school/', 'learn', learnLive.length);
  for (const s of SECTIONS[LEARN_SHELF.id] ?? []) {
    const n = learnLive.filter((t) => t.data.section === s.id).length;
    if (n) add(`learnsec:${s.id}`, `School ${s.name.toLowerCase()}`, '/learn/school/', 'learn:school', n);
  }
  add('learn:experiments', 'Experiments', '/learn/experiments/', 'learn');
  add('learn:courses', 'Courses', '/learn/courses/', 'learn');
  add('learn:languages', 'Languages', '/learn/languages/', 'learn');
  // Tools
  const toolsLive = live.filter((t) => t.data.shelf !== 'learn');
  add('tools', 'Tools', '/tools/', 'home', toolsLive.length);
  for (const sh of SHELVES) {
    const mine = toolsLive.filter((t) => t.data.shelf === sh.id);
    if (!mine.length) continue;
    add(`shelf:${sh.id}`, sh.name, `/${sh.id}/`, 'tools', mine.length);
    if (SUBJECTS[sh.id]) for (const sj of bySubject(sh.id, live)) add(`subj:${sh.id}:${sj.id}`, sj.name, sj.url, `shelf:${sh.id}`, sj.count);
  }
  // Blog
  const kindCount = (k: string) => articles.filter((a) => kindOf(a) === k).length;
  add('blog', 'Blog', '/blog/', 'home', articles.length);
  for (const k of KINDS) if (kindCount(k.id)) add(`kind:${k.id}`, k.name, `/blog/${k.id}/`, 'blog', kindCount(k.id));
  add('blog:changes', 'Change log', '/changes/', 'blog');
  add('blog:stats', 'Usage stats', '/stats/', 'blog');
  // About the site
  add('site', 'About the site', '/about/', 'home');
  for (const [id, name] of [['about', 'About'], ['privacy', 'Privacy'], ['terms', 'Terms'], ['contact', 'Contact'], ['sitemap', 'Site map']]) add(`site:${id}`, name, `/${id}/`, 'site');

  const ids = new Set(nodes.map((n) => n.id));
  // The node a tool belongs to: its subject if it has one on the map, else its shelf (Learn: its school subject).
  const home = (t: Tool) => {
    if (t.data.shelf === 'learn') return ids.has(`learnsec:${t.data.section}`) ? `learnsec:${t.data.section}` : 'learn:school';
    const sj = toolPlace(t).subject;
    return sj && ids.has(`subj:${t.data.shelf}:${sj.id}`) ? `subj:${t.data.shelf}:${sj.id}` : `shelf:${t.data.shelf}`;
  };
  const byId = new Map(live.map((t) => [t.id, t]));
  const tally = new Map<string, Link>();
  const bump = (a: string, b: string, kind: Link['kind']) => {
    if (a === b) return;
    const [x, y] = kind === 'related' && a > b ? [b, a] : [a, b];
    const key = `${kind}|${x}|${y}`;
    const l = tally.get(key) ?? { a: x, b: y, n: 0, kind };
    l.n++; tally.set(key, l);
  };
  for (const t of live) for (const r of t.data.related) { const o = byId.get(r); if (o) bump(home(t), home(o), 'related'); }
  for (const a of articles) {
    const k = `kind:${kindOf(a)}`;
    for (const id of mentions(a)) { const t = byId.get(id); if (t) bump(k, home(t), 'article'); }
  }
  const links = [...tally.values()].sort((x, y) => y.n - x.n);

  // Radial tree: leaves spread evenly round the outer ring in menu order, each parent at the middle
  // of its children, one ring per level.
  const kids = (id: string) => nodes.filter((n) => n.parent === id);
  const order: string[] = [];
  const depth = new Map<string, number>();
  const walk = (id: string, d: number) => { depth.set(id, d); const c = kids(id); if (!c.length) order.push(id); c.forEach((k) => walk(k.id, d + 1)); };
  walk('home', 0);
  const maxD = Math.max(...depth.values());
  const c = size / 2, R = size / 2 - 150;
  const ang = new Map<string, number>();
  order.forEach((id, i) => ang.set(id, (2 * Math.PI * i) / order.length - Math.PI / 2));
  const angleOf = (id: string): number => {
    if (ang.has(id)) return ang.get(id)!;
    const a = kids(id).map((k) => angleOf(k.id));
    const v = a.reduce((s, x) => s + x, 0) / a.length;
    ang.set(id, v); return v;
  };
  const out: Node[] = nodes.map((n) => {
    const d = depth.get(n.id) ?? 0, a = angleOf(n.id);
    // Leaves sit on the outer ring whatever their depth, so labels line up.
    const r = n.id === 'home' ? 0 : kids(n.id).length ? (R * d) / maxD : R;
    return { ...n, depth: d, angle: a, x: c + r * Math.cos(a), y: c + r * Math.sin(a) };
  });
  return { nodes: out, links, size };
}
