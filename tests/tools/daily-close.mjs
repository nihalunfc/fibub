// #T1070 End-of-day close assistant
import { reconcile, figures, toDate, status } from '../../src/lib/biz/dayclose.ts';
export const path = '/money/daily-close/';
export default async ({ page, check, BASE }) => {
  const L = (who, type, expected, counted) => ({ who, type, expected, counted, note: '' });
  const r = reconcile([L('A', 'Cash', '1000', '998.5'), L('A', 'Card', '2000', '2000'), L('B', 'Cash', '500', '530'), L('B', 'Card', '', '')], 5);
  check(r.rows.map((x) => x.st).join() === 'tol,ok,bad,open' && r.diff === 28.5 && r.bad === 1 && r.open === 1, 'close maths: -1.50 is within a 5 tolerance, +30 is not, total +28.50');
  check(r.byWho.find((b) => b.who === 'A').diff === -1.5 && status(0.004, 0) === 'ok', 'close maths: by cashier and a rounding hair counts as balanced');
  const f = figures({ sold: '96', avail: '120', main: '14400', other: [{ label: 'x', amount: '600' }], tax: '1500' });
  check(f.use === 0.8 && f.price === 150 && f.perPlace === 120 && f.sales === 15000 && f.takings === 16500, 'close maths: 80% use, price 150, 120 per place, sales 15,000');
  const day = (date, main) => ({ date, sold: 10, avail: 20, main, sales: main, tax: 0, diff: 0, done: 1, steps: 1 });
  const t = toDate([day('2026-10-31', 999), day('2026-11-01', 100), day('2026-11-02', 200), day('2026-11-05', 700)], day('2026-11-03', 300));
  check(t.mtd.main === 600 && t.mtd.days === 3 && t.ytd.main === 1599 && t.today.use === 0.5, 'close maths: month to date counts only earlier closed days of the month plus today');

  await page.goto(`${BASE}/money/daily-close/`); await page.waitForTimeout(500);
  await page.selectOption('.dc .dc-cur', 'USD');
  check((await page.locator('.dc .dc-steps li').count()) === 9 && (await page.textContent('.dc .dc-prog')).includes('0 of 9'), 'close: hotel example has 9 steps');
  await page.locator('.dc .dc-steps input[type=checkbox]').first().check(); await page.waitForTimeout(150);
  check((await page.textContent('.dc .dc-prog')).includes('1 of 9') && /at \d\d:\d\d/.test(await page.textContent('.dc .dc-steps li')), 'close: ticking a step stamps the time');
  await page.fill('.dc .dc-newstep', 'Check the safe'); await page.click('.dc .dc-addstep'); await page.waitForTimeout(100);
  check((await page.locator('.dc .dc-steps li').count()) === 10, 'close: a step can be added');
  const rows = page.locator('.dc .dc-lines tbody tr'); const n = await rows.count();
  await rows.nth(0).locator('[data-f=expected]').fill('1000'); await rows.nth(0).locator('[data-f=counted]').fill('1030'); await page.waitForTimeout(200);
  check((await rows.nth(0).getAttribute('class')) === 's-bad' && (await rows.nth(0).textContent()).includes('+$30.00') && n >= 4, 'close: a 30 over is red');
  await page.fill('.dc [data-k=tol]', '50'); await page.waitForTimeout(200);
  check((await page.locator('.dc .dc-lines tbody tr').nth(0).getAttribute('class')) === 's-tol', 'close: a bigger tolerance makes it amber');
  await page.click('.dc .dc-close'); await page.waitForTimeout(200);
  check((await page.locator('.dc .dc-hist tbody tr').count()) === 1 && (await page.textContent('.dc .dc-chart')).length > 0, 'close: closing a day adds it to the history');
  await page.selectOption('.dc .dc-preset', 'shop'); await page.waitForTimeout(300);
  check((await page.locator('.dc .dc-steps li').count()) === 7 && (await page.locator('.dc .dc-hist tbody tr').count()) === 1, 'close: shop example keeps the history');
  check(!(await page.evaluate(() => Object.keys(localStorage).some((k) => k.includes('daily-close')))), 'close: nothing is stored unless the box is ticked');
};
