// Tell search engines that use IndexNow (Bing, Yandex, Seznam, Naver and others, which share what
// they receive) which fibub pages changed, right after a deploy, so new tools are found in hours
// instead of weeks. Sends only fibub's own page addresses: nothing about visitors.
// Google does not use IndexNow; it reads the sitemap.
//
// Usage: node scripts/indexnow.mjs <base-sha> <head-sha>   (run by .github/workflows/indexnow.yml)
//        node scripts/indexnow.mjs --all                    (every live tool and hub page)
//        add --dry to print the list without sending it.
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, existsSync } from 'node:fs';

const SITE = 'https://fibub.com';
const KEY = 'b544da555d964ccdfafaadfab66a850b'; // the same key is served at https://fibub.com/b544da555d964ccdfafaadfab66a850b.txt (public/b544da555d964ccdfafaadfab66a850b.txt)
const args = process.argv.slice(2);
const dry = args.includes('--dry');
const all = args.includes('--all');
const [base, head] = args.filter((a) => !a.startsWith('--'));

const field = (src, key) => (src.match(new RegExp(`^${key}:[ \\t]*"?([^"\\n]*)"?`, 'm')) ?? [])[1]?.trim();
function toolUrl(id) {
  const f = `src/tools/${id}/guide.md`;
  if (!existsSync(f)) return null; // removed tool
  const fm = readFileSync(f, 'utf8').split(/^---\s*$/m)[1] ?? '';
  if ((field(fm, 'status') || 'live') !== 'live') return null;
  return `${SITE}/${field(fm, 'shelf')}/${id}/`;
}

let changed;
if (all) changed = readdirSync('src/tools').map((id) => `src/tools/${id}/guide.md`);
else changed = execFileSync('git', ['diff', '--name-only', base, head], { encoding: 'utf8' }).split('\n').filter(Boolean);

const urls = new Set();
const shelves = new Set();
for (const f of changed) {
  const m = f.match(/^src\/tools\/([^/]+)\//);
  if (!m) continue;
  const u = toolUrl(m[1]);
  if (u) { urls.add(u); shelves.add(new URL(u).pathname.split('/')[1]); }
}
if (urls.size) { urls.add(`${SITE}/`); for (const s of shelves) urls.add(`${SITE}/${s}/`); }
const list = [...urls].slice(0, 10000);
console.log(`${list.length} changed page(s)${list.length ? ':\n' + list.join('\n') : ''}`);
if (!list.length || dry) process.exit(0);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: 'fibub.com', key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: list }),
});
console.log(`IndexNow answered ${res.status} ${res.statusText}`);
// 200 and 202 mean received. Anything else is reported but does not fail the deploy.
