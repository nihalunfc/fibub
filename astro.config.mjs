import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import autolinkTools from './src/lib/autolink.mjs';

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
  return { byTool, newest: log[0]?.date };
}
const changed = lastChanged();

export default defineConfig({
  // Fetch the next page when the visitor points at (or touches) a link, so it opens at once.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  site: 'https://fibub.com',
  trailingSlash: 'always',
  integrations: [sitemap({
    // /nav/ only holds the menu's tool lists for the header to load; it is not a page of its own.
    filter: (page) => !/\/nav\/$/.test(page) && !/\/home\/v[\d.]+\/$/.test(page),
    serialize(item) {
      const path = new URL(item.url).pathname.split('/').filter(Boolean);
      const date = path.length === 2 ? changed.byTool.get(path[1]) : undefined;
      const lastmod = date ?? (path.length <= 2 && !['about', 'privacy', 'terms', 'contact'].includes(path[0]) ? changed.newest : undefined);
      if (lastmod) item.lastmod = new Date(lastmod).toISOString();
      return item;
    },
  })],
  // Links between tool guides: the first mention of another tool's name links to it (src/lib/autolink.mjs).
  markdown: { rehypePlugins: [autolinkTools] },
  // CSS goes in shared files the browser keeps between pages (only very small sheets are inlined).
  build: { format: 'directory', inlineStylesheets: 'auto' },
  // Never inline scripts: the CSP (public/_headers) allows only script files from this site. Small
  // stylesheets (under 6 KB) go into the page itself, saving a round trip before the first paint.
  vite: { build: { assetsInlineLimit: (file, content) => file.endsWith('.css') && content.length < 6000 } },
});
