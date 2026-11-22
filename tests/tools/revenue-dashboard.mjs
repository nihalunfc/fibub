// #T1073 Revenue dashboard
import { channels, cancelRate, siteDays, soldOut, weekStart } from '../../src/lib/biz/revenue.ts';
import { importRows } from '../../src/lib/biz/dash.ts';
export const path = '/money/revenue-dashboard/';
export default async ({ page, check, BASE }) => {
  const csv = ['date,site,channel,sold,revenue,cancelled'];
  for (let i = 1; i <= 10; i++) { const d = `2026-03-${String(i).padStart(2, '0')}`; csv.push(`${d},A,Own,60,9000,3`, `${d},A,Booking,40,6000,10`); }
  const r = importRows(csv.join('\n'), []);
  const c = channels(r.rows, '2026-03-01', '2026-03-10', { Booking: 18 });
  const b = c.find((x) => x.ch === 'Booking'), o = c.find((x) => x.ch === 'Own');
  check(b.rev === 60000 && Math.abs(b.net - 49200) < 1e-9 && Math.abs(b.commission - 10800) < 1e-9 && o.net === 90000, 'revenue maths: 18% commission on 60,000 leaves 49,200');
  check(Math.abs(cancelRate(b) - 100 / 500) < 1e-12, 'revenue maths: cancellation rate = cancelled / (sold + cancelled)');
  const days = siteDays(r.rows, { A: 100 }), so = soldOut(days, '2026-03-01', '2026-03-10', 10);
  check(days.length === 10 && so.n === 10 && Math.abs(so.units - 100) < 1e-9 && Math.abs(so.value - 15000) < 1e-6, 'revenue maths: 10 sold-out days, 10% extra is 100 sales worth 15,000');
  check(weekStart('2026-11-22') === '2026-11-16' && weekStart('2026-11-16') === '2026-11-16', 'revenue maths: weeks start on Monday');

  await page.goto(`${BASE}/money/revenue-dashboard/`); await page.waitForTimeout(500);
  await page.selectOption('.rv .rv-cur', 'USD');
  check((await page.locator('.rv .rv-kpis .biz-k').count()) === 6 && (await page.locator('.rv .rv-chan tbody tr').count()) === 4, 'revenue: example shows six cards and four channels');
  check((await page.locator('.rv .rv-chart1 rect').count()) === 12 && (await page.locator('.rv .rv-chart2 path').count()) >= 2, 'revenue: both charts are drawn');
  await page.fill('.rv [data-comm="Own website"]', '50'); await page.waitForTimeout(500);
  check((await page.textContent('.rv .rv-chan tfoot')).length > 0 && (await page.textContent('.rv .rv-kpis')).includes('Kept by channels'), 'revenue: a commission change recalculates');
  await page.fill('.rv .rv-paste', csv.join('\n')); await page.click('.rv .rv-use'); await page.waitForTimeout(400);
  await page.selectOption('.rv .rv-period', 'd28'); await page.waitForTimeout(200);
  await page.fill('.rv [data-cap="A"]', '100'); await page.fill('.rv [data-comm="Booking"]', '18'); await page.waitForTimeout(500);
  const t = (await page.textContent('.rv .rv-chan')).replace(/\s+/g, ' ');
  check(t.includes('$49,200') && t.includes('$10,800') && t.includes('$139,200'), 'revenue: pasted rows give net $49,200 and total net $139,200 (' + t.slice(-120) + ')');
  check((await page.textContent('.rv .rv-so')).includes('10'), 'revenue: sold-out days are counted');
  check(!(await page.evaluate(() => Object.keys(localStorage).some((k) => k.includes('revenue')))), 'revenue: nothing is stored unless the box is ticked');
};
