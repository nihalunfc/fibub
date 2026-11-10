// Writes src/data/changelog.json from the git history: every change to the site, newest first, with
// its time, its one-line description (the commit title), the tools it touched and a link to it on
// GitHub. Runs before every build (npm run build). Cloudflare's build clones only the latest commit,
// so on a shallow clone it first downloads the rest of the history. If that fails (no network, or
// not a git checkout) it keeps the committed file instead of writing a short one.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';

const OUT = 'src/data/changelog.json';
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const isShallow = () => {
  try { return git('rev-parse', '--is-shallow-repository').trim() !== 'false'; } catch { return true; /* not a git checkout */ }
};
let shallow = isShallow();
if (shallow) {
  // Plain first (follows the clone's own branch), then main, which is what the site deploys from.
  for (const args of [[], ['origin', 'main']]) {
    try {
      git('fetch', '--quiet', '--unshallow', ...args);
      shallow = isShallow();
      if (!shallow) { console.log('changelog: fetched the full git history'); break; }
    } catch (e) {
      console.log(`changelog: could not fetch the full git history (${String(e.message || e).split('\n')[0]})`);
    }
  }
}
if (shallow) {
  console.log(`changelog: no full git history here, keeping ${OUT}`);
  if (!existsSync(OUT)) { mkdirSync('src/data', { recursive: true }); writeFileSync(OUT, '[]\n'); }
  process.exit(0);
}

const tools = new Set(readdirSync('src/tools'));
const SITE = /^(src\/(layouts|pages|components|styles|scripts|site\.ts|content\.config\.ts)|public\/(_headers|theme\.js))/;
const raw = git('log', '--no-merges', '--format=%x1e%H%x1f%cI%x1f%s', '--name-only');
const entries = [];
for (const block of raw.split('\x1e').slice(1)) {
  const [head, ...files] = block.split('\n');
  const [sha, date, title] = head.split('\x1f');
  const touched = new Set();
  let site = false;
  for (const f of files) {
    const m = /^src\/tools\/([^/]+)\//.exec(f);
    if (m && tools.has(m[1])) touched.add(m[1]);
    else if (SITE.test(f)) site = true;
  }
  // Changes that only touch notes or tests are not news for visitors.
  if (!touched.size && !site) continue;
  // A sweep over most tools at once (a rename pass, new ID codes) is one site-wide change: listing
  // every tool would bloat /changes/ past the page-size limit and fill each tool's own list.
  if (touched.size > 50) { touched.clear(); site = true; }
  entries.push({ sha: sha.slice(0, 12), date, title: title.trim(), tools: [...touched].sort(), site });
}
const json = JSON.stringify(entries, null, 1) + '\n';
mkdirSync('src/data', { recursive: true });
if (!existsSync(OUT) || readFileSync(OUT, 'utf8') !== json) writeFileSync(OUT, json);
console.log(`changelog: ${entries.length} changes`);
