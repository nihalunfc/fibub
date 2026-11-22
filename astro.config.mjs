import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import autolinkTools from './src/lib/autolink.mjs';
import remarkMathml from './src/lib/mathml.mjs';
import remarkPycells from './src/lib/pycells.mjs';

// When each page last changed, for the sitemap's <lastmod>: a tool's newest entry in the change log
// (made from git history by scripts/changelog.mjs just before the build), else its guide's `updated`.
// Pages that list tools (home, shelves, subjects) take the newest change of all.
function lastChanged() {
  const byTool = new Map();
  const log = existsSync('src/data/changelog.json') ? JSON.parse(readFileSync('src/data/changelog.json', 'utf8')) : [];
  for (const c of log) for (const id of c.tools ?? []) if (!byTool.has(id)) byTool.set(id, c.date);
  for (const id of readdirSync('src/tools')) {
    if (byTool.has(id) || !existsSync(`src/tools/${id}/guide.md`)) continue;
    const m = readFileSync(`src/tools/${id}/guide.md`, 'utf8').match(/^updated:\s*(\S+)/m);
    if (m) byTool.set(id, m[1]);
  }
  // Blog articles (/blog/<kind>/<slug>/) use their own `updated` date.
  const byArticle = new Map();
  if (existsSync('src/blog')) for (const kind of readdirSync('src/blog')) {
    if (!existsSync(`src/blog/${kind}`) || kind.includes('.')) continue;
    for (const f of readdirSync(`src/blog/${kind}`)) {
      if (!f.endsWith('.md')) continue;
      const m = readFileSync(`src/blog/${kind}/${f}`, 'utf8').match(/^updated:\s*(\S+)/m);
      if (m) byArticle.set(`${kind}/${f.slice(0, -3)}`, m[1]);
    }
  }
  // Course lessons (/learn/courses/<course>/<slug>/) use their own `updated`; a course home takes its newest lesson.
  const byLesson = new Map();
  if (existsSync('src/courses')) for (const c of readdirSync('src/courses')) {
    if (c.includes('.')) continue;
    for (const f of readdirSync(`src/courses/${c}`)) {
      if (!f.endsWith('.md')) continue;
      const m = readFileSync(`src/courses/${c}/${f}`, 'utf8').match(/^updated:\s*(\S+)/m);
      if (!m) continue;
      byLesson.set(`${c}/${f.slice(0, -3)}`, m[1]);
      if (!byLesson.has(c) || byLesson.get(c) < m[1]) byLesson.set(c, m[1]);
    }
  }
  return { byTool, byArticle, byLesson, newest: log[0]?.date };
}
const changed = lastChanged();

// Medical entrance pages that show an engineering-course lesson (Physics, Chemistry) carry a canonical link to
// the engineering page, so they stay out of the sitemap (src/data/entrance.ts, src/courses/medical-entrance/).
const borrowedLessons = (() => {
  const src = readFileSync('src/data/entrance.ts', 'utf8');
  const part = src.slice(src.indexOf('  physics: ['), src.indexOf('  maths: ['));
  const ids = [...part.matchAll(/\{ id: '([a-z0-9-]+)'/g)].map((m) => m[1]);
  return new Set(ids.flatMap((id) => [`/learn/courses/medical-entrance/${id}/`, `/learn/courses/medical-entrance/${id}-questions/`]));
})();

export default defineConfig({
  // FIBUB_CACHE=<dir> gives a quick FIBUB_ONLY build its own cache, so builds side by side don't share one.
  cacheDir: process.env.FIBUB_CACHE || undefined,
  // Fetch the next page when the visitor points at (or touches) a link, so it opens at once.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  site: 'https://fibub.com',
  trailingSlash: 'always',
  integrations: [sitemap({
    // /nav/ only holds the menu's tool lists for the header to load, and /offline/ is what the app shows with no internet: neither is a page of its own.
    filter: (page) => !/\/(nav|offline)\/$/.test(page) && !/\/home\/v[\d.]+\/$/.test(page) && !borrowedLessons.has(new URL(page).pathname),
    serialize(item) {
      const path = new URL(item.url).pathname.split('/').filter(Boolean);
      const course = path[0] === 'learn' && path[1] === 'courses' && path.length >= 3;
      const date = course ? changed.byLesson.get(path.slice(2, 4).join('/')) ?? changed.byLesson.get(path[2])
        : path[0] === 'blog' && path.length === 3 ? changed.byArticle.get(`${path[1]}/${path[2]}`)
        : path.length === 2 ? changed.byTool.get(path[1]) : undefined;
      const lastmod = date ?? (path.length <= 2 && !['about', 'privacy', 'terms', 'contact'].includes(path[0]) ? changed.newest : undefined);
      if (lastmod) item.lastmod = new Date(lastmod).toISOString();
      return item;
    },
  })],
  // Links between tool guides: the first mention of another tool's name links to it (src/lib/autolink.mjs).
  // Maths in the ML foundations lessons becomes MathML at build time (src/lib/mathml.mjs).
  // SQL in the SQL and data modelling courses is left plain: the page turns it into live editors
  // (src/scripts/sqllab.ts), and plain code keeps the lesson pages small.
  markdown: { remarkPlugins: [remarkMathml, remarkPycells], rehypePlugins: [autolinkTools], syntaxHighlight: { type: 'shiki', excludeLangs: ['math', 'sql'] } },
  // CSS goes in shared files the browser keeps between pages (only very small sheets are inlined).
  build: { format: 'directory', inlineStylesheets: 'auto' },
  // Never inline scripts: the CSP (public/_headers) allows only script files from this site. Small
  // stylesheets (under 6 KB) go into the page itself, saving a round trip before the first paint.
  vite: { build: { assetsInlineLimit: (file, content) => file.endsWith('.css') && content.length < 6000 } },
});
