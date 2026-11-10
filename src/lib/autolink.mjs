// In-text links between tool guides, the way an encyclopedia links its articles: the first time a
// guide names another fibub tool, that name becomes a link to the tool. Runs at build time as a rehype
// plugin on every guide.md (see astro.config.mjs), so new tools are linked from older guides, and
// older tools from new ones, with nothing to add by hand.
//
// Two ways a link appears:
//   1. Automatically: the first mention of another tool's name (or the first part of its title, before
//      the colon) in ordinary text. Headings, code and existing links are left alone, each tool is
//      linked once per guide, and a guide gets at most MAX_AUTO links so the text stays easy to read.
//   2. By hand, anywhere in a guide: [[tool-id]] links with the tool's name; [[tool-id|your words]]
//      links with your words. An unknown id fails the build.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';

const MAX_AUTO = 8, MAX_AUTO_BLOG = 14;
const ROOT = new URL('../tools/', import.meta.url).pathname;
const BLOG = new URL('../blog/', import.meta.url).pathname;

/** Every Blog article id (<kind>/<slug>), for [[blog:<kind>/<slug>]] links. */
export function blogIds() {
  if (!existsSync(BLOG)) return new Set();
  return new Set(readdirSync(BLOG).flatMap((k) => existsSync(join(BLOG, k)) && !k.includes('.') ? readdirSync(join(BLOG, k)).filter((f) => f.endsWith('.md')).map((f) => `${k}/${f.slice(0, -3)}`) : []));
}
const titleOf = (id) => field(readFileSync(join(BLOG, `${id}.md`), 'utf8').split(/^---\s*$/m)[1] ?? '', 'title');

const field = (src, key) => {
  const m = src.match(new RegExp(`^${key}:[ \\t]*(.*)$`, 'm'));
  if (!m) return '';
  let v = m[1].trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
  return v.replace(/\\"/g, '"').replace(/''/g, "'");
};

/** Every live tool: id, name, link and the phrases that count as a mention of it. */
export function toolTerms() {
  const out = [];
  for (const id of readdirSync(ROOT)) {
    const f = join(ROOT, id, 'guide.md');
    if (!existsSync(f)) continue;
    const fm = readFileSync(f, 'utf8').split(/^---\s*$/m)[1] ?? '';
    if ((field(fm, 'status') || 'live') !== 'live') continue;
    const name = field(fm, 'name'), shelf = field(fm, 'shelf'), head = field(fm, 'title').split(/:\s/)[0].trim();
    const related = (field(fm, 'related').match(/[a-z0-9-]+/g) ?? []), section = field(fm, 'section');
    // Only phrases of two or more words: a lone word ("Planner") would also match ordinary sentences.
    const terms = [...new Set([name, head].filter((t) => t && t.split(/\s+/).length >= 2 && t.length <= 60))];
    out.push({ id, name, url: `/${shelf}/${id}/`, terms, related, section });
  }
  // `related` works both ways, as on the tool page.
  const byId = new Map(out.map((t) => [t.id, t]));
  for (const t of out) for (const r of t.related) { const o = byId.get(r); if (o && !o.related.includes(t.id)) o.related.push(t.id); }
  for (const t of out) t.related = t.related.filter((r) => byId.has(r));
  return out;
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const SKIP = new Set(['a', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'script', 'style', 'kbd', 'summary']);
// In the middle of a sentence a tool's name reads as ordinary words ("use the pump test analyser"), so its
// first letter goes lower case, unless it is a proper name or an abbreviation (Mars time, DNA sequence tools).
const PROPER = /^(Sky|Mars|Jupiter|Beer|Darcy|Hückel|Köppen|Manning|McCabe|Piper|Nernst|Tafel|Skew|Galaxy)\b/;
const inSentence = (name) => (PROPER.test(name) || /^.[A-Z0-9]/.test(name) ? name : name[0].toLowerCase() + name.slice(1));
const link = (t, text) => ({ type: 'element', tagName: 'a', properties: { href: t.url, className: ['tl'] }, children: [{ type: 'text', value: text }] });

export default function autolinkTools() {
  const tools = toolTerms();
  const byId = new Map(tools.map((t) => [t.id, t]));
  // Longest phrases first, so "Unit hydrograph builder" wins over a shorter name inside it.
  const phrases = tools.flatMap((t) => t.terms.map((p) => ({ p, t }))).sort((a, b) => b.p.length - a.p.length);
  const anyPhrase = phrases.length ? new RegExp(`(?<![\\w-])(${phrases.map((x) => esc(x.p)).join('|')})(?![\\w-])`, 'gi') : null;
  const lookup = new Map(phrases.map((x) => [x.p.toLowerCase(), x.t]));
  const blogs = blogIds();

  return (tree, file) => {
    const path = file?.path || file?.history?.[0] || '';
    const isBlog = /[\\/]blog[\\/][^\\/]+[\\/][^\\/]+\.md$/.test(path);
    if (!isBlog && !/[\\/]tools[\\/][^\\/]+[\\/]guide\.md$/.test(path)) return;
    // A tool guide never links to itself; a Blog article may link to every tool, its own included.
    const self = isBlog ? '' : basename(dirname(path));
    const done = new Set([self]);
    const max = isBlog ? MAX_AUTO_BLOG : MAX_AUTO;
    let auto = 0;

    // Hand-made [[id]] links first, so they count as this guide's link to that tool.
    const manual = (node) => {
      if (!node.children) return;
      node.children = node.children.flatMap((c) => {
        if (c.type === 'text' && c.value.includes('[[')) {
          const parts = []; let last = 0;
          for (const m of c.value.matchAll(/\[\[(blog:[a-z0-9-]+\/[a-z0-9-]+|[a-z0-9-]+)(?:\|([^\]]+))?\]\]/g)) {
            if (m[1].startsWith('blog:')) {
              const id = m[1].slice(5);
              if (!blogs.has(id)) throw new Error(`${path}: [[${m[1]}]] is not a Blog article (src/blog/${id}.md)`);
              if (m.index > last) parts.push({ type: 'text', value: c.value.slice(last, m.index) });
              parts.push({ type: 'element', tagName: 'a', properties: { href: `/blog/${id}/`, className: ['bl'] }, children: [{ type: 'text', value: m[2] ?? titleOf(id) }] });
              last = m.index + m[0].length;
              continue;
            }
            const t = byId.get(m[1]);
            if (!t) throw new Error(`${path}: [[${m[1]}]] is not a live tool id`);
            if (m.index > last) parts.push({ type: 'text', value: c.value.slice(last, m.index) });
            parts.push(link(t, m[2] ?? inSentence(t.name)));
            done.add(t.id); last = m.index + m[0].length;
          }
          if (last < c.value.length) parts.push({ type: 'text', value: c.value.slice(last) });
          return parts;
        }
        if (c.type === 'element' && !SKIP.has(c.tagName)) manual(c);
        return [c];
      });
    };
    manual(tree);
    const handMade = done.size > 1 || isBlog;
    // Tools the guide already links to with an ordinary Markdown link count as linked too.
    const seen = (node) => { if (node.type === 'element' && node.tagName === 'a') { const h = String(node.properties?.href ?? ''); for (const t of tools) if (h === t.url) done.add(t.id); } (node.children ?? []).forEach(seen); };
    seen(tree);

    // A guide without its own linking sentence gets a plain one after its first section, naming up to
    // three related tools (or tools from its section), so every guide links on. Write a better one by hand.
    if (!handMade) {
      const me = byId.get(self);
      const pool = me ? (me.related.length ? me.related : tools.filter((t) => t.id !== self && me.section && t.section === me.section).map((t) => t.id)) : [];
      const picks = pool.filter((id) => !done.has(id)).slice(0, 3).map((id) => byId.get(id));
      if (picks.length) {
        const kids = [{ type: 'text', value: 'It works well with ' }];
        picks.forEach((t, i) => { if (i) kids.push({ type: 'text', value: i === picks.length - 1 ? ' and ' : ', ' }); kids.push({ type: 'text', value: 'the ' }, link(t, inSentence(t.name))); done.add(t.id); });
        kids.push({ type: 'text', value: '.' });
        const para = { type: 'element', tagName: 'p', properties: {}, children: kids };
        const heads = tree.children.map((c, i) => [c, i]).filter(([c]) => c.type === 'element' && c.tagName === 'h2');
        const at = heads.length >= 2 ? heads[1][1] : heads.length ? heads[0][1] : tree.children.length;
        tree.children.splice(at, 0, para, { type: 'text', value: '\n' });
      }
    }

    if (!anyPhrase) return;
    const walk = (node) => {
      if (!node.children || auto >= max) return;
      node.children = node.children.flatMap((c) => {
        if (auto >= max) return [c];
        if (c.type === 'element') { if (!SKIP.has(c.tagName)) walk(c); return [c]; }
        if (c.type !== 'text') return [c];
        const parts = []; let last = 0;
        for (const m of c.value.matchAll(anyPhrase)) {
          const t = lookup.get(m[1].toLowerCase());
          if (!t || done.has(t.id) || auto >= max) continue;
          if (m.index > last) parts.push({ type: 'text', value: c.value.slice(last, m.index) });
          parts.push(link(t, m[1]));
          done.add(t.id); auto++; last = m.index + m[0].length;
        }
        if (!parts.length) return [c];
        if (last < c.value.length) parts.push({ type: 'text', value: c.value.slice(last) });
        return parts;
      });
    };
    walk(tree);
  };
}
