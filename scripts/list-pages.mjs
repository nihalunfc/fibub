// Runs after `astro build`: writes dist/pages.json, the list of every page on the site and the
// address of each tool's page. The counters (worker/index.ts) count only these addresses, so nobody
// can fill the counts with made-up pages.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const pages = [];
(function walk(dir, url) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) { if (!name.startsWith('_') && name !== 'og') walk(full, `${url}${name}/`); }
    else if (name === 'index.html') pages.push(url);
  }
})(DIST, '/');
pages.sort();
const tools = Object.fromEntries(JSON.parse(readFileSync(join(DIST, 'tools.json'), 'utf8')).map((t) => [t.id, t.u]));
for (const [id, u] of Object.entries(tools)) if (!pages.includes(u)) throw new Error(`list-pages: tool ${id} has no page at ${u}`);
writeFileSync(join(DIST, 'pages.json'), JSON.stringify({ pages, tools }));
console.log(`list-pages: ${pages.length} pages, ${Object.keys(tools).length} tools`);
