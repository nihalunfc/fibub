// #T848 EI Calculator
import { scheduleWeeks, hoursNeeded, ei, fromStubs, readDocText } from '../../src/lib/money/ei.ts';
export const path = '/money/ei-calculator/';
export default async ({ page, check, BASE }) => {
  // Schedule I cells (Employment Insurance Act, Table of Weeks of Benefits).
  const cells = [[420, 13.5, 26], [420, 16.5, 32], [490, 11.5, 23], [700, 5, 14], [735, 6.5, 16], [1330, 5, 23], [1435, 5, 25], [1820, 5, 36], [1820, 10, 44], [1400, 16.5, 45], [1200, 6.8, 23]];
  check(cells.every(([h, r, w]) => scheduleWeeks(h, r) === w), 'ei-calculator: weeks match Schedule I cells');
  check(hoursNeeded(5) === 700 && hoursNeeded(13.1) === 420 && hoursNeeded(6.5, 2) === 998 && hoursNeeded(13.5, 4) === 840, 'ei-calculator: hours needed and violation table');
  const a = ei({ rate: 7.2, hours: 1500, bestTotal: 20 * 1000, reason: 'layoff', sevenDays: true, claimDate: '2026-11-15' });
  check(a.eligible === true && a.weekly === 550 && a.weeks === 30 && a.waiting === 0 && a.total === 16500, `ei-calculator: worked example $550 x 30 weeks (got ${a.weekly} x ${a.weeks})`);
  const hi = ei({ rate: 5, hours: 2000, bestTotal: 22 * 3000, reason: 'layoff', sevenDays: true, claimDate: '2026-11-15', longTenured: true });
  check(hi.weekly === 729 && hi.weeks === 56, `ei-calculator: maximum $729 and long-tenured +20 (got ${hi.weekly}, ${hi.weeks})`);
  check(ei({ rate: 7.2, hours: 600, bestTotal: 20000, reason: 'layoff', sevenDays: true }).eligible === false
    && ei({ rate: 7.2, hours: 1500, bestTotal: 20000, reason: 'quit', sevenDays: true }).eligible === false
    && ei({ rate: 7.2, hours: 1500, bestTotal: 20000, reason: 'just-cause', sevenDays: true }).eligible === null, 'ei-calculator: short hours, quitting and just cause');
  const s = fromStubs([{ end: '2026-10-30', days: 14, hours: 80, earnings: 2400 }, { end: '2025-01-01', days: 14, hours: 80, earnings: 2400 }], '2026-11-10', 21);
  check(s.used === 1 && s.hours === 80 && s.bestTotal === 2400 && s.short === 19, 'ei-calculator: stubs outside 52 weeks are left out');
  const roe = readDocText('Record of Employment\n15A Total insurable hours 1,234\n15B Total insurable earnings $45,678.90\n16 Reason for issuing this ROE: A');
  check(roe.kind === 'roe' && roe.hours === 1234 && roe.earnings === 45678.9 && roe.reasonCode === 'A', 'ei-calculator: reads ROE text');

  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  await page.fill('.ec-date', '2026-11-15'); await page.dispatchEvent('.ec-date', 'change'); await page.waitForTimeout(100);
  check((await page.textContent('.ec-weekly')).includes('550') && (await page.textContent('.ec-weeks')).trim() === '30', 'ei-calculator: page shows the worked example');
  await page.fill('.ec-hours', '500'); await page.waitForTimeout(100);
  check((await page.textContent('.ec-verdict')).includes('unlikely'), 'ei-calculator: too few hours says unlikely');
  await page.click('[data-mode=stubs]'); await page.click('.ec-fill'); await page.waitForTimeout(100);
  check((await page.textContent('.ec-stubsum')).includes('1,950 hours'), 'ei-calculator: 26 filled stubs add up');
  await page.click('.ec-custom summary'); await page.fill('.ec-c[data-k=maxWeekly]', '700'); await page.click('[data-mode=type]'); await page.fill('.ec-pay', '3000'); await page.fill('.ec-hours', '1500'); await page.waitForTimeout(100);
  check((await page.textContent('.ec-weekly')).includes('700'), 'ei-calculator: custom maximum weekly benefit is used');
};
