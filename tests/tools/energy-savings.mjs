// #T1066 Peak-energy savings estimator
import { estimate } from '../../src/lib/biz/peak-energy.ts';
export const path = '/money/energy-savings/';
export default async ({ page, check, BASE }) => {
  // Hand-worked: 100 kW at 50% = 50 kW cut; 400 per kW, 5 peaks, 80% caught = 4 peaks.
  // Each peak caught is worth 50 / 5 x 400 = 4,000, so the saving is 16,000. Pre-cooling: 10 alerts x 4 h x 50 kW x 15% x 0.10 = 30. Net 15,970; payback 20,000 / 15,970 = 1.25 years.
  const e = estimate({ avgPeak: 1200, peakHourKW: 1300, useProfile: false, profile: [], equip: [{ name: 'x', kw: 100, pct: 50 }], reliability: 80, alerts: 10, hours: 4, setup: 20000, gaPerKw: 400, peaks: 5, upper: 1000, lower: 500, classB: 0.07, rebound: 15, price: 0.1 });
  check(e.cut === 50 && e.caught === 4 && e.perPeak === 4000 && e.saving === 16000 && Math.abs(e.precool - 30) < 1e-9 && Math.abs(e.net - 15970) < 1e-9 && Math.abs(e.payback - 20000 / 15970) < 1e-9 && e.elig.short === 'Can opt in to Class A', 'peak energy maths: hand-worked example');
  check(estimate({ ...{ avgPeak: 300, peakHourKW: 320, useProfile: false, profile: [], equip: [{ name: 'x', kw: 100, pct: 50 }], reliability: 80, alerts: 10, hours: 4, setup: 0, gaPerKw: 400, peaks: 5, upper: 1000, lower: 500, classB: 0.07, rebound: 15, price: 0.1 } }).elig.short === 'Class B only', 'peak energy maths: below the lower threshold is Class B only');

  await page.goto(`${BASE}/money/energy-savings/`); await page.waitForTimeout(400);
  const kp = async () => (await page.textContent('.es .es-kpis')).replace(/\s+/g, ' ');
  let k = await kp();
  check(k.includes('Can opt in to Class A') && k.includes('360 kW') && k.includes('129,510') && k.includes('2 months'), 'peak energy: example estimate (' + k + ')');
  check((await page.locator('.es .es-sens tbody tr').count()) === 6 && (await page.textContent('.es .es-playbook')).includes('Pre-cool'), 'peak energy: sensitivity table and the alert-day checklist');
  await page.selectOption('.es [data-k="useProfile"]', 'no'); await page.fill('.es [data-k="avgPeak"]', '300'); await page.waitForTimeout(100);
  k = await kp();
  check(k.includes('Class B only') && k.includes('Not applicable'), 'peak energy: a small user is Class B only (' + k + ')');
  await page.click('.es .es-add'); await page.waitForTimeout(100);
  check((await page.locator('.es .es-eq tbody tr').count()) === 7, 'peak energy: equipment can be added');
  await page.click('.es .es-reset'); await page.waitForTimeout(100);
  check((await kp()).includes('129,510'), 'peak energy: back to the example');
};
