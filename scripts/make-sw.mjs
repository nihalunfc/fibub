// Runs after `astro build`: writes dist/sw.js, the service worker that makes fibub installable and
// keeps opened pages working offline (template: src/sw.js). It fills in:
//   PRECACHE: the offline page, the home page, the menu lists, and the scripts, styles and icons they use;
//   VERSION: a short hash of those files and the template, so a deploy that changes them installs
//            a new worker (which then clears the old precache). Pages themselves are always fetched
//            fresh when online, so every other change shows at once without a new worker.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const DIST = 'dist';
const file = (u) => join(DIST, u.endsWith('/') ? `${u}index.html` : u);
const pages = ['/', '/offline/', '/nav/'];
const urls = new Set([...pages, '/theme.js', '/favicon.svg', '/icon-192.png', '/site.webmanifest']);
for (const p of pages) {
  const html = readFileSync(file(p), 'utf8');
  for (const m of html.matchAll(/(?:href|src)="(\/_astro\/[^"#?]+)"/g)) urls.add(m[1]);
}
// Scripts load other scripts (import "./site.x.js"): keep those too, so the offline page's menu works.
for (const u of [...urls]) if (u.endsWith('.js')) (function deps(js) {
  for (const m of readFileSync(file(js), 'utf8').matchAll(/import\s*(?:[\w{},\s*$]+from\s*)?"\.\/([^"]+\.js)"/g)) {
    const d = `/_astro/${m[1]}`;
    if (!urls.has(d)) { urls.add(d); deps(d); }
  }
})(u);
const list = [...urls].sort();
const hash = createHash('sha256');
const template = readFileSync('src/sw.js', 'utf8');
hash.update(template);
for (const u of list) {
  if (!existsSync(file(u))) throw new Error(`make-sw: ${u} is not in dist/`);
  hash.update(u).update(readFileSync(file(u)));
}
const version = hash.digest('hex').slice(0, 12);
const out = template.replace("'__VERSION__'", JSON.stringify(version)).replace('__PRECACHE__', JSON.stringify(list));
writeFileSync(join(DIST, 'sw.js'), out);
console.log(`make-sw: version ${version}, ${list.length} files kept for offline`);
