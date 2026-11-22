// #T1074 Report builder
import { num, profile, defaults, prepare, build, fmtNum } from '../../src/lib/biz/reportbuilder.ts';
export const path = '/money/report-builder/';
export default async ({ page, check, BASE }) => {
  check(num('1,234.50') === 1234.5 && num('(12.00)') === -12 && num('$5') === 5 && num('abc') === null && num('') === null, 'report-builder maths: numbers are read');
  const csv = ['Date,Branch,Sales'];
  for (let i = 1; i <= 28; i++) { const d = `2026-03-${String(i).padStart(2, '0')}`; csv.push(`${d},A,100`, `${d},B,50`); }
  const p = profile(csv.join('\n')), s = defaults(p);
  check(p.cols[0].kind === 'date' && p.cols[2].kind === 'number' && s.measure === 2 && s.group === 1, 'report-builder maths: columns are detected');
  const b = build(prepare(p, s), { ...s, period: 'd7' }, 'Sales', 'Branch', (v) => fmtNum(v));
  check(b.cur.value === 7 * 150 && b.groups[0].name === 'A' && Math.abs(b.groups[0].share - 2 / 3) < 1e-9 && b.before.value === 1050, 'report-builder maths: 7 days x 150 = 1,050 and A is 66.7%');
  const dm = profile('Date,Amount\n31/01/2026,5\n02/02/2026,7\n03/02/2026,8');
  check(dm.dmy === true && prepare(dm, { ...defaults(dm) }).recs[0].d === '2026-01-31', 'report-builder maths: day-first dates are recognised');
  check(profile('a,b\n1,2').error != null, 'report-builder maths: too little data gives a plain error');

  await page.goto(`${BASE}/money/report-builder/`); await page.waitForTimeout(600);
  check((await page.locator('.rb .rb-out canvas').count()) >= 2 && (await page.locator('.rb .rb-out .biz-k').count()) >= 3, 'report-builder: example shows cards and charts');
  check((await page.textContent('.rb .rb-out')).includes('Branch') && (await page.textContent('.rb .rb-notes')).includes('biggest'), 'report-builder: example splits by branch with notes');
  await page.selectOption('.rb .rb-period', 'd28'); await page.waitForTimeout(200);
  check((await page.textContent('.rb .rb-out')).includes('Previous period'), 'report-builder: a period adds the comparison');
  await page.fill('.rb .rb-paste', csv.join('\n')); await page.click('.rb .rb-use'); await page.waitForTimeout(300);
  check((await page.textContent('.rb .rb-out')).includes('4,200'), 'report-builder: pasted rows total 28 x 150 = 4,200');
  await page.click('.rb .rb-add'); await page.waitForTimeout(100);
  check((await page.locator('.rb .rb-parts li').count()) === 1, 'report-builder: a part can be added');
  const dl = page.waitForEvent('download');
  await page.click('.rb .dl [data-f="pdf"]');
  check((await dl).suggestedFilename().endsWith('.pdf'), 'report-builder: PDF downloads');
  check(!(await page.evaluate(() => Object.keys(localStorage).some((k) => k.includes('report-builder')))), 'report-builder: nothing is stored unless the box is ticked');
};
