// #T1072 KPI dashboard
import { importRows, sumRows, use, price, perPlace, change, ranges, shiftYear } from '../../src/lib/biz/dash.ts';
export const path = '/money/kpi-dashboard/';
export default async ({ page, check, BASE }) => {
  const csv = ['date,site,available,sold,revenue'];
  for (let i = 1; i <= 28; i++) csv.push(`2026-03-${String(i).padStart(2, '0')},A,100,75,3750`);
  const r = importRows(csv.join('\n'), []);
  const s = sumRows(r.rows, '2026-03-01', '2026-03-28');
  check(r.rows.length === 28 && s.cap === 2800 && s.sold === 2100 && s.rev === 105000, 'kpi maths: rows are read and added up');
  check(use(s) === 0.75 && price(s) === 50 && Math.abs(perPlace(s) - 37.5) < 1e-12 && Math.abs(change(105000, 100000) - 0.05) < 1e-12, 'kpi maths: use 75%, price 50, per place 37.5, +5%');
  check(shiftYear('2024-02-29', 1) === '2025-02-28' && ranges('2026-03-28', 'd7').cur[0] === '2026-03-22' && ranges('2026-03-15', 'mtd').prev[1] === '2026-02-15', 'kpi maths: date ranges');
  check(importRows('2026-01-01,5\n2026-01-02,6', ['d', 'sold']).error != null && importRows('a,b\nc,d', []).error != null, 'kpi maths: bad input gives a plain error');

  await page.goto(`${BASE}/money/kpi-dashboard/`); await page.waitForTimeout(500);
  await page.selectOption('.kp .kp-cur', 'USD');
  check((await page.locator('.kp .kp-kpis .biz-k').count()) >= 4 && (await page.textContent('.kp .kp-take')).includes('What changed'), 'kpi: example shows cards and a note');
  check((await page.locator('.kp .kp-chart1 path').count()) >= 1 && (await page.locator('.kp .kp-chart2 rect').count()) >= 10, 'kpi: charts are drawn');
  await page.selectOption('.kp .kp-period', 'ltm'); await page.waitForTimeout(150);
  check((await page.textContent('.kp .kp-title')).includes('Last 12 months'), 'kpi: period changes the title');
  const before = await page.textContent('.kp .kp-kpis');
  await page.selectOption('.kp .kp-preset', 'restaurant'); await page.waitForTimeout(300);
  check((await page.textContent('.kp .kp-kpis')) !== before && (await page.textContent('.kp .kp-kpis')).includes('Seats filled'), 'kpi: restaurant example changes the wording');
  await page.fill('.kp .kp-paste', csv.join('\n').replace('2026-03', '2026-03')); await page.click('.kp .kp-use'); await page.waitForTimeout(300);
  check((await page.textContent('.kp .kp-kpis')).includes('75.0%') && (await page.textContent('.kp .kp-kpis')).includes('$37.50'), 'kpi: pasted rows give 75.0% and $37.50');
  await page.selectOption('.kp .kp-period', 'd28'); await page.waitForTimeout(150);
  await page.fill('.kp [data-b="2026-03"][data-i="0"]', '80'); await page.fill('.kp [data-b="2026-03"][data-i="1"]', '50'); await page.waitForTimeout(600);
  check((await page.textContent('.kp .kp-bud')).includes('$112,000'), 'kpi: budget 2,800 x 80% x 50 = $112,000');
  check(!(await page.evaluate(() => Object.keys(localStorage).some((k) => k.includes('kpi')))), 'kpi: nothing is stored unless the box is ticked');
};
