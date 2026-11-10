// #1785 US paycheck
import { paycheck } from '../../src/lib/money/us-paycheck.ts';
export const path = '/money/us-paycheck/';
export default async ({ page, check, BASE }) => {
  // Hand-worked with IRS Rev. Proc. 2025-32 and SSA 2026 figures.
  const near = (a, b) => Math.abs(a - b) < 0.02;
  const b = { gross: 75000, status: 'single', children: 0, k401: 3750, roth: false, hsa: 0, pretax: 0, state: 'IL', stateRate: 0 };
  const il = paycheck(b);
  check(near(il.fed, 6845) && near(il.ss, 4650) && near(il.medicare, 1087.5) && near(il.state, 3382.09) && near(il.takeHome, 55285.41), `us-paycheck: 75k single Illinois take-home 55,285.41 (got ${il.takeHome})`);
  const hi = paycheck({ ...b, gross: 250000, k401: 0, state: 'TX' });
  check(near(hi.fed, 51304) && near(hi.ss, 11439) && near(hi.medicare, 4075) && hi.state === 0, 'us-paycheck: 250k single Texas, SS capped at 184,500 and extra 0.9% Medicare');
  const nc = paycheck({ ...b, status: 'mfj', children: 2, gross: 90000, k401: 0, state: 'NC' });
  check(near(nc.fed, 2040) && near(nc.state, 2573.55), 'us-paycheck: joint 90k, 2 children, North Carolina 3.99% after 25,500');
  const pa = paycheck({ ...b, state: 'PA' });
  check(near(pa.state, 2302.5), 'us-paycheck: Pennsylvania taxes 401(k) contributions (3.07% of 75,000)');

  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  check((await page.textContent('.upc-per')).includes('2,126.36'), 'us-paycheck: page shows the worked example per paycheck');
  await page.selectOption('.upc-state', 'TX'); await page.waitForTimeout(100);
  check((await page.textContent('.upc-per')).includes('2,256.44'), 'us-paycheck: Texas has no state tax');
  await page.selectOption('.upc-state', 'CA'); await page.waitForTimeout(100);
  check(await page.isVisible('.upc-rate') && (await page.textContent('.upc-snote')).includes('estimate'), 'us-paycheck: other states show an editable effective rate marked as an estimate');
};
