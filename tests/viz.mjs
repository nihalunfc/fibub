// Checks for the shared interactive figures in public/learn-kit/viz/ (used in any kit course as data-fig="@name"):
// every @name a lesson uses exists, every figure file is valid JavaScript with a header comment and a default export,
// imports only the kit (no outside hosts), and is listed in the catalogue (viz/README.md) so other courses find it.
// Browser checks (mount, every control, 375 px width, dark mode): node scripts/viz-check.mjs . <names> --shots <dir>.
// Run: node tests/viz.mjs (part of npm test).
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? pass++ : (fail++, console.error('FAIL ' + name)); };
const vizDir = new URL('../public/learn-kit/viz/', import.meta.url);
const files = readdirSync(vizDir).filter((f) => f.endsWith('.js'));
const figs = files.filter((f) => !f.startsWith('_')).map((f) => f.slice(0, -3));
const catDir = new URL('catalogue/', vizDir);
const readme = [readFileSync(new URL('README.md', vizDir), 'utf8'), ...readdirSync(catDir).filter((f) => f.endsWith('.md')).map((f) => readFileSync(new URL(f, catDir), 'utf8'))].join('\n');

for (const f of files) {
  const src = readFileSync(new URL(f, vizDir), 'utf8');
  ok(`viz/${f}: starts with a comment that says what it shows`, /^\/\/ \S/.test(src));
  if (!f.startsWith('_')) ok(`viz/${f}: has a default export`, /export default (async )?function/.test(src));
  for (const m of src.matchAll(/^import .* from '([^']+)'/gm)) ok(`viz/${f}: imports only the kit or viz helpers (${m[1]})`, /^(\.\.\/kit\.js|\.\/_[a-z0-9-]+\.js)$/.test(m[1]));
  ok(`viz/${f}: no fetch or outside URL`, !/fetch\(|https?:\/\/(?!www\.w3\.org)/.test(src));
  const r = spawnSync(process.execPath, ['--check', fileURLToPath(new URL(f, vizDir))], { encoding: 'utf8' });
  ok(`viz/${f}: valid JavaScript ${r.stderr.split('\n').slice(0, 5).join(' ')}`, r.status === 0);
  if (!f.startsWith('_')) ok(`viz/${f}: listed in the catalogue (viz/catalogue/*.md)`, readme.includes('`@' + f.slice(0, -3) + '`'));
}

// Every lesson that uses a shared figure points at one that exists
const walk = (u) => readdirSync(u).flatMap((f) => { const v = new URL(f, u); return statSync(v).isDirectory() ? walk(new URL(f + '/', u)) : f.endsWith('.md') ? [v] : []; });
const used = new Map();
for (const u of [...walk(new URL('../src/courses/', import.meta.url)), ...(existsSync(new URL('../src/blog/', import.meta.url)) ? walk(new URL('../src/blog/', import.meta.url)) : [])]) {
  const md = readFileSync(u, 'utf8');
  for (const m of md.matchAll(/data-fig="@([^"]+)"/g)) {
    ok(`${fileURLToPath(u).split('/src/')[1]}: shared figure @${m[1]} exists`, figs.includes(m[1]));
    used.set(m[1], (used.get(m[1]) || 0) + 1);
  }
}
const unused = figs.filter((f) => !used.has(f));
console.log(`viz: ${figs.length} shared figures, ${[...used.values()].reduce((a, b) => a + b, 0)} placements in lessons${unused.length ? `; not placed yet: ${unused.join(', ')}` : ''}`);
console.log(`viz: ${pass} checks passed, ${fail} failed`);
if (fail) process.exit(1);
