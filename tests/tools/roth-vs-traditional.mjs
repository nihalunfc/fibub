// #1786 Roth or traditional
import { compare, limitFor } from '../../src/lib/money/roth-vs-traditional.ts';
export const path = '/money/roth-vs-traditional/';
export default async ({ page, check, BASE }) => {
  // Hand-worked: 6,000 a year for 30 years at 6% (paid at the start of each year): 6,000 x 1.06 x (1.06^30 - 1) / 0.06 = 502,810.06.
  const near = (a, b, e = 0.5) => Math.abs(a - b) < e;
  const b = { amount: 6000, years: 30, ret: 0.06, taxNow: 0.22, taxLater: 0.12, basis: 'cost', sideTax: 0.15 };
  const r = compare(b);
  check(near(r.trad, 442472.86) && near(r.roth, 392191.85) && r.better === 'trad', `roth-vs-traditional: worked example 442,473 vs 392,192 (got ${Math.round(r.trad)} / ${Math.round(r.roth)})`);
  check(near(r.breakEven, 0.22, 1e-9) && compare({ ...b, taxLater: 0.22 }).better === 'equal', 'roth-vs-traditional: same cost ties when the rates are equal');
  check(compare({ ...b, basis: 'same', taxLater: 0.22 }).better === 'roth', 'roth-vs-traditional: at the limit, Roth wins with equal rates (taxed side account)');
  check(limitFor('401k', 61) === 35750 && limitFor('401k', 55) === 32500 && limitFor('ira', 50) === 8600 && limitFor('ira', 30) === 7500, 'roth-vs-traditional: 2026 limits with catch-ups');

  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  check((await page.textContent('.rvt-t')).includes('442,473') && (await page.textContent('.rvt-r')).includes('392,192'), 'roth-vs-traditional: page shows the worked example');
  await page.fill('.rvt-later', '32'); await page.waitForTimeout(100);
  check((await page.textContent('.rvt-win')).includes('Roth'), 'roth-vs-traditional: a higher rate later makes Roth win');
  await page.selectOption('.rvt-basis', 'same'); await page.waitForTimeout(100);
  check(await page.isVisible('.rvt-side'), 'roth-vs-traditional: same-dollars mode shows the side-account tax box');
};
