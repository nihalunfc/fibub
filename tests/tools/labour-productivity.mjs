// #T1067 Labour productivity
import { model, guide } from '../../src/lib/biz/productivity.ts';
export const path = '/money/labour-productivity/';
export default async ({ page, check, BASE }) => {
  // Hand-worked: 100 places, 80% sold = 80 units, half new. Cleaning: 40 new x 30 min + 40 continuing x 15 min = 30 task hours;
  // 7 productive hours in an 8-hour shift gives 30 / (7/8) = 34.2857 paid hours = 5 people; wage 20 + 25% benefits = 857.14 a day.
  // Sales 80 x 100 = 8,000, so 10.71% of sales, 10.71 per unit and 34.2857 x 7 / 40 = 6.0 full-time equivalents.
  const H = { name: '', capacity: 100, use: 0.8, newShare: 0.5, price: 100, benefits: 0.25, shiftHours: 8, fteHours: 40, days: 7, extraPer: 0, extraOutside: 0 };
  const D = [{ name: 'c', wage: 20, driverA: 'new', minA: 30, driverB: 'ongoing', minB: 15, prod: 7, support: 0, fixed: 0, minPerShift: 0, shifts: 1, core: true }];
  const m = model(H, D);
  check(Math.abs(m.tot.hours - 240 / 7) < 1e-9 && m.tot.people === 5 && Math.abs(m.tot.cost - 6000 / 7) < 1e-9 && Math.abs(m.pct - 0.107142857) < 1e-6 && Math.abs(m.fte - 6) < 1e-9, 'labour maths: hand-worked cleaning example');
  check(model(H, [{ ...D[0], minPerShift: 5 }]).tot.hours === 40 && guide(H, D).length === 15, 'labour maths: minimum staffing sets a floor; the guide has 15 levels');

  await page.goto(`${BASE}/money/labour-productivity/`); await page.waitForTimeout(400);
  await page.selectOption('.lp .lp-cur', 'USD');
  await page.selectOption('.lp .lp-preset', 'restaurant'); await page.waitForTimeout(150);
  const kp = async () => (await page.textContent('.lp .lp-kpis')).replace(/\s+/g, ' ');
  let k = await kp();
  check(k.includes('105') && k.includes('15') && k.includes('18.4') && k.includes('$7.00') && k.includes('25.0%'), 'labour: restaurant example gives 105 hours, 15 people, $7.00 a cover, 25.0% (' + k + ')');
  check((await page.locator('.lp .lp-guide tbody tr').count()) === 15 && (await page.locator('.lp .lp-dept tbody tr').count()) === 5, 'labour: staffing guide and department table');
  await page.fill('.lp [data-k="use"]', '40'); await page.waitForTimeout(100);
  check(!(await kp()).includes('105'), 'labour: selling less changes the plan');
  await page.fill('.lp [data-k="use"]', '70'); await page.waitForTimeout(100);
  await page.fill('.lp .lp-depts [data-di="0"][data-df="minA"]', '12'); await page.waitForTimeout(100);
  check((await page.textContent('.lp .lp-take')).includes('people on shift') && (await page.textContent('.lp .lp-wi-take')).length > 0, 'labour: takeaway and what-if text');
  await page.click('.lp .lp-add'); await page.waitForTimeout(100);
  check((await page.locator('.lp .lp-depts .lp-dept-card').count()) === 6, 'labour: a department can be added');
  await page.fill('.lp [data-k="shiftHours"]', '0'); await page.waitForTimeout(100);
  check((await page.textContent('.lp .lp-warn')).includes('Paid hours'), 'labour: a bad shift length is flagged');
};
