// #1743 HRA exemption
import { hraExempt, hraYear, taxSaved, withRent, needsLandlordPan } from '../../src/lib/money/hra-exemption.ts';
export const path = '/money/hra-exemption/';
export default async ({ page, check, BASE }) => {
  const a = hraExempt({ salary: 50000, hra: 20000, rent: 25000, city: 'delhi', fy2026: true });
  check(a.exempt === 20000 && a.taxable === 0, `hra-exemption: basic 50,000, HRA 20,000, rent 25,000, metro -> 20,000 exempt (got ${a.exempt})`);
  const b = hraExempt({ salary: 50000, hra: 25000, rent: 30000, city: 'other', fy2026: true });
  check(b.exempt === 20000 && b.taxable === 5000 && b.which === 2, 'hra-exemption: other city caps at 40% of salary');
  check(hraExempt({ salary: 50000, hra: 25000, rent: 30000, city: 'pune', fy2026: true }).pct === 50 && hraExempt({ salary: 50000, hra: 25000, rent: 30000, city: 'pune', fy2026: false }).pct === 40, 'hra-exemption: Pune is 50% from FY 2026-27 only');
  check(hraExempt({ salary: 50000, hra: 20000, rent: 4000, city: 'mumbai', fy2026: true }).exempt === 0, 'hra-exemption: rent below 10% of salary gives nothing tax-free');

  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  check((await page.textContent('.he .he-s-ex')).includes('20,000') && (await page.textContent('.he .he-s-exy')).includes('2,40,000'), 'hra-exemption: page shows 20,000 a month, 2,40,000 a year');
  await page.fill('.he [data-k="rent"]', '15000'); await page.waitForTimeout(100);
  check((await page.textContent('.he .he-s-ex')).includes('10,000') && (await page.textContent('.he .he-tip')).includes('25,000'), 'hra-exemption: lower rent cuts the exemption and suggests the rent for full HRA');
  await page.fill('.he [data-k="months"]', '13'); await page.waitForTimeout(100);
  check(await page.isVisible('.he .he-err'), 'hra-exemption: 13 months shows a message');

  // More options.
  const base = { salary: 50000, hra: 20000, rent: 25000, city: 'delhi', fy2026: true };
  const y6 = hraYear(base, 6);
  check(y6.exempt === 120000 && y6.taxable === 120000 && hraYear(base, 12).rentYear === 300000, 'hra-exemption: six months of rent halves the exemption, the other months are taxable');
  check(taxSaved(240000, 0.2) === 49920 && taxSaved(-5, 0.3) === 0 && withRent(base, 15000).exempt === 10000 && needsLandlordPan(100001) && !needsLandlordPan(100000), 'hra-exemption: tax saved at 20% plus cess, rent what-if, landlord PAN above 1 lakh');
  check(!Number.isNaN(hraExempt({ salary: NaN, hra: NaN, rent: NaN, city: 'delhi', fy2026: true }).exempt), 'hra-exemption: blank values never give NaN');
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => { d.open = true; }));
  await page.fill('.he [data-k="months"]', '12'); await page.fill('.he [data-k="rent"]', '25000'); await page.selectOption('.he [data-k="slab"]', '0.20'); await page.waitForTimeout(100);
  check((await page.textContent('.he .he-line')).includes('49,920') && (await page.textContent('.he .he-extra')).includes('PAN'), 'hra-exemption: plain sentence shows tax saved and the landlord PAN reminder');
  await page.fill('.he [data-k="rent2"]', '15000'); await page.waitForTimeout(100);
  check((await page.textContent('.he .he-extra')).includes('10,000'), 'hra-exemption: what-if rent shows the new tax-free HRA');
  await page.selectOption('.he [data-k="unit"]', 'year'); await page.fill('.he [data-k="sal"]', '600000'); await page.fill('.he [data-k="hra"]', '240000'); await page.fill('.he [data-k="rent"]', '300000'); await page.waitForTimeout(100);
  check((await page.textContent('.he .he-s-ex')).includes('20,000') && (await page.textContent('.he .he-per')).includes('year'), 'hra-exemption: yearly amounts give the same monthly result');
  await page.fill('.he [data-k="sal"]', ''); await page.waitForTimeout(100);
  check(await page.isVisible('.he .he-err') && !(await page.textContent('.he')).includes('NaN'), 'hra-exemption: blank salary gives a message, no NaN');
};
