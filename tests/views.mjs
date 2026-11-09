// Checks the view summary tables (scripts/views-lib.mjs) against a small hand-worked example.
import { isoWeek, summarise, toCsv } from '../scripts/views-lib.mjs';

let failed = 0;
const check = (ok, msg) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${msg}`); if (!ok) failed++; };

check(isoWeek('2026-11-09') === '2026-W46', 'views: 9 Nov 2026 is ISO week 46');
check(isoWeek('2027-01-01') === '2026-W53', 'views: 1 Jan 2027 belongs to week 53 of 2026');
check(isoWeek('2024-12-30') === '2025-W01', 'views: 30 Dec 2024 belongs to week 1 of 2025');

const days = [
  { date: '2026-11-08', site: 10, pages: { '/': 4, '/money/budget-calculator/': 6 }, uses: { 'budget-calculator': 2 } },
  { date: '2026-11-09', site: 5, pages: { '/money/budget-calculator/': 5 }, uses: { 'budget-calculator': 1, 'gone-tool': 3 } },
];
const t = summarise(days, { 'budget-calculator': '/money/budget-calculator/' }, { site: 100, pages: { '/': 30, '/money/budget-calculator/': 70 }, uses: { 'budget-calculator': 9 } });
const row = (tbl, period, page) => t[tbl].find((r) => r.period === period && r.page === page);
check(row('daily', '2026-11-08', '(site)').views === 10 && row('daily', '2026-11-08', '(site)').uses === 2, 'views: daily site row');
check(row('weekly', '2026-W45', '/money/budget-calculator/').views === 6 && row('weekly', '2026-W46', '/money/budget-calculator/').views === 5, 'views: Sunday and Monday fall in different weeks');
check(row('monthly', '2026-11', '/money/budget-calculator/').views === 11 && row('monthly', '2026-11', '/money/budget-calculator/').uses === 3, 'views: month adds days, views and uses together');
check(row('monthly', '2026-11', '/money/budget-calculator/').tool === 'budget-calculator', 'views: tool id beside its page');
check(row('yearly', '2026', 'tool:gone-tool').uses === 3, 'views: uses of a removed tool are kept');
check(t['all-time'][0].page === '(site)' && t['all-time'][0].views === 100 && t['all-time'][0].uses === 9, 'views: all-time site row');
check(toCsv([{ a: 'x,y', b: 1 }]) === 'a,b\n"x,y",1\n', 'views: CSV quotes commas');

if (failed) { console.error(`${failed} view check(s) failed`); process.exit(1); }
