// #T1064 No-show and overbooking calculator
import { analyse, stats, showRate } from '../../src/lib/biz/overbooking.ts';
export const path = '/money/overbooking-calculator/';
export default async ({ page, check, BASE }) => {
  // Hand-worked: 2 places, 50% show, a filled place worth 100, turning someone away costs 150.
  // +0: 100.  +1 (3 bookings): filled 1.375, turned away 0.125, value 137.5 - 18.75 = 118.75.  +2 (4 bookings): 162.5 - 56.25 = 106.25.
  const a = analyse(2, 0.5, 100, 150, null);
  check(a.best.k === 1 && Math.abs(a.best.ev - 118.75) < 1e-9 && Math.abs(a.best.gain - 18.75) < 1e-9 && Math.abs(a.best.pw - 0.125) < 1e-9 && Math.abs(a.rows[2].ev - 106.25) < 1e-9, 'overbooking maths: hand-worked 2 places example');
  check(Math.abs(stats(3, 2, 0.5).filled - 1.375) < 1e-9 && Math.abs(showRate(8, 7) - 0.92 * 0.93) < 1e-12, 'overbooking maths: expected filled and show rate');
  check(analyse(2, 0.5, 100, 150, 0.1).best.k === 0, 'overbooking maths: a 10% cap rules out +1 (12.5% chance)');

  await page.goto(`${BASE}/money/overbooking-calculator/`); await page.waitForTimeout(400);
  await page.selectOption('.ob .ob-cur', 'USD');
  await page.selectOption('.ob .ob-preset', 'restaurant'); await page.waitForTimeout(150);
  const kp = async () => (await page.textContent('.ob .ob-kpis')).replace(/\s+/g, ' ');
  let k = await kp();
  check(k.includes('+4') && k.includes('Booking limit 44') && k.includes('10.4%'), 'overbooking: restaurant example gives +4 and a 10.4% chance (' + k + ')');
  check((await page.textContent('.ob .ob-take')).includes('$105'), 'overbooking: expected gain about $105 a day');
  await page.check('.ob input[name=ob-risk][value=free]'); await page.waitForTimeout(150);
  k = await kp();
  check(k.includes('+5') && k.includes('20.2%'), 'overbooking: with no cap the best level is +5 (' + k + ')');
  await page.fill('.ob [data-k="cancel"]', '0'); await page.fill('.ob [data-k="noshow"]', '0'); await page.waitForTimeout(150);
  check((await kp()).includes('+0'), 'overbooking: everyone turns up, so no overbooking');
  await page.fill('.ob [data-k="cost"]', '200'); await page.waitForTimeout(150);
  check((await page.textContent('.ob .ob-warn')).includes('loses money'), 'overbooking: a place that loses money is flagged');
  await page.click('.ob .ob-reset'); await page.waitForTimeout(150);
  check((await page.locator('.ob .ob-plan tbody tr').count()) === 14 && (await page.textContent('.ob .ob-plan-kpis')).includes('Expected gain'), 'overbooking: 14-night planner is filled in');
  await page.click('.ob .ob-add-walk'); await page.waitForTimeout(100);
  check((await page.locator('.ob .ob-walk tbody tr').count()) === 4, 'overbooking: a cost line can be added');
};
