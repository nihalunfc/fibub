#!/usr/bin/env node
// Fails when two tools share an ID code (#T12, #L3) or an old plain number (num). Runs first in `npm run build`
// and on every pull request (.github/workflows/ids.yml), where GitHub checks the PR merged with the latest main, so a
// clash between two PRs shows up before the second one is merged. Gaps in a letter are only reported: a thread may
// hold a block of codes that another PR has not merged yet.
import { existsSync, readdirSync, readFileSync } from 'node:fs';

const codes = new Map(), nums = new Map(), dupes = [];
for (const id of readdirSync('src/tools')) {
  const g = `src/tools/${id}/guide.md`;
  if (!existsSync(g)) continue;
  const head = readFileSync(g, 'utf8').split(/^---$/m)[1] || '';
  const code = head.match(/^code:\s*([A-Z]+\d+)\s*$/m)?.[1];
  const num = head.match(/^num:\s*(\d+)\s*$/m)?.[1];
  if (code) { if (codes.has(code)) dupes.push(`#${code}: ${codes.get(code)} and ${id}`); else codes.set(code, id); }
  if (num) { if (nums.has(num)) dupes.push(`num ${num}: ${nums.get(num)} and ${id}`); else nums.set(num, id); }
}
const byLetter = {};
for (const c of codes.keys()) { const [, l, n] = c.match(/^([A-Z]+)(\d+)$/); (byLetter[l] ||= []).push(+n); }
for (const [l, ns] of Object.entries(byLetter)) {
  ns.sort((a, b) => a - b);
  const gaps = [];
  for (let k = 1; k < ns.length; k++) if (ns[k] > ns[k - 1] + 1) gaps.push(`${l}${ns[k - 1] + 1}-${l}${ns[k] - 1}`);
  console.log(`check-ids: ${l} ${ns.length} codes, ${l}1-${l}${ns[ns.length - 1]}${gaps.length ? `, unused: ${gaps.join(', ')}` : ', no gaps'}`);
}
if (dupes.length) {
  console.error(`check-ids: ${dupes.length} clash(es). Codes and numbers are permanent: give the newer tool the next free one.\n  ${dupes.join('\n  ')}`);
  process.exit(1);
}
console.log(`check-ids: ${codes.size} codes and ${nums.size} numbers, all unique`);
