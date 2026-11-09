// Copies fibub's view and use counts from the live counters into data/views/ and rebuilds the
// summary tables. Run every day by .github/workflows/views.yml; can also be run by hand:
//   node scripts/views-export.mjs            (fetch the last 7 full days, then rebuild the tables)
//   node scripts/views-export.mjs --rebuild  (only rebuild the tables from the day files)
// Days are UTC. Only counts are fetched: nothing about any visitor exists to be fetched.
import { mkdirSync, readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { summarise, toCsv } from './views-lib.mjs';

const SITE = process.env.FIBUB_URL || 'https://fibub.com';
const DIR = 'data/views';
const DAYS = join(DIR, 'days');

async function get(path) {
  const res = await fetch(SITE + path, { headers: { 'User-Agent': 'fibub-views-export' } });
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return res.json();
}
const sortObj = (o) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)));
const write = (file, text) => { mkdirSync(join(file, '..'), { recursive: true }); writeFileSync(file, text); };

if (!process.argv.includes('--rebuild')) {
  const day = (offset) => new Date(Date.now() - offset * 86_400_000).toISOString().slice(0, 10);
  const [from, to] = [day(7), day(1)];
  const got = await get(`/api/days?from=${from}&to=${to}`);
  for (const [d, t] of Object.entries(got)) {
    write(join(DAYS, d.slice(0, 4), `${d}.json`), JSON.stringify({ date: d, site: t.site, pages: sortObj(t.pages), uses: sortObj(t.uses) }, null, 1) + '\n');
  }
  const totals = await get('/api/counts');
  write(join(DIR, 'totals.json'), JSON.stringify({ through: to, site: totals.site, pages: sortObj(totals.pages), uses: sortObj(totals.uses) }, null, 1) + '\n');
  // Which page belongs to which tool, so uses can sit next to that page's views in the tables.
  const tools = await get('/tools.json');
  const known = existsSync(join(DIR, 'tools.json')) ? JSON.parse(readFileSync(join(DIR, 'tools.json'), 'utf8')) : {};
  for (const t of tools) known[t.id] = t.u;
  write(join(DIR, 'tools.json'), JSON.stringify(sortObj(known), null, 1) + '\n');
  console.log(`views-export: ${Object.keys(got).length} days from ${from} to ${to}`);
}

const days = existsSync(DAYS)
  ? readdirSync(DAYS).flatMap((y) => readdirSync(join(DAYS, y)).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(join(DAYS, y, f), 'utf8'))))
  : [];
const toolPages = existsSync(join(DIR, 'tools.json')) ? JSON.parse(readFileSync(join(DIR, 'tools.json'), 'utf8')) : {};
const totals = existsSync(join(DIR, 'totals.json')) ? JSON.parse(readFileSync(join(DIR, 'totals.json'), 'utf8')) : null;
const tables = summarise(days, toolPages, totals);
for (const [name, rows] of Object.entries(tables)) write(join(DIR, `${name}.csv`), toCsv(rows));
console.log(`views-export: tables rebuilt from ${days.length} days`);
