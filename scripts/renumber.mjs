// Gives every tool its ID code (#T12, #L3): one letter per area, counted without gaps.
// Run: node scripts/renumber.mjs   (safe to run again: tools that already have a code keep it,
// and any tool with an old `num` but no code gets the next free code in its letter, in num order).
// The letters live in CODES in src/site.ts; keep the two in step.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
const prefixFor = (shelf) => (shelf === 'learn' ? 'L' : 'T');
const rows = [];
for (const id of readdirSync('src/tools')) {
  const f = `src/tools/${id}/guide.md`;
  if (!existsSync(f)) continue;
  const md = readFileSync(f, 'utf8');
  const fm = md.slice(0, md.indexOf('\n---', 4));
  const get = (k) => fm.match(new RegExp(`^${k}:\\s*(.+)$`, 'm'))?.[1].trim();
  rows.push({ id, f, md, shelf: get('shelf'), num: Number(get('num')) || 0, code: get('code') });
}
const next = {};
for (const r of rows) if (r.code) { const p = r.code.match(/^[A-Z]+/)[0]; next[p] = Math.max(next[p] ?? 0, +r.code.slice(p.length)); }
let n = 0;
for (const r of rows.filter((r) => !r.code && r.num).sort((a, b) => a.num - b.num)) {
  const p = prefixFor(r.shelf);
  next[p] = (next[p] ?? 0) + 1;
  r.code = `${p}${next[p]}`;
  writeFileSync(r.f, r.md.replace(/^(shelf:.*)$/m, `$1\ncode: ${r.code}`));
  n++;
}
console.log(`gave ${n} tools a code; last codes: ${Object.entries(next).map(([p, v]) => p + v).join(', ')}`);
