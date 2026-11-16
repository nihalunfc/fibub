// #1785 US paycheck
import { paycheck, nextExtra, taxShare, hourlyToYear } from '../../src/lib/money/us-paycheck.ts';
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

  // More options.
  const tx = { ...b, k401: 0, state: 'TX' };
  const nx = nextExtra(tx, 1000);
  check(near(nx.keep, 703.5) && near(nx.taken, 296.5), `us-paycheck: next 1,000 at 75k single Texas keeps 703.50 (22% + 7.65%) (got ${nx.keep})`);
  check(Math.abs(taxShare(paycheck(tx)) - 0.178767) < 0.0001 && hourlyToYear(25, 40) === 52000 && hourlyToYear(-1, 40) === 0, 'us-paycheck: tax share and hourly to year');
  check(!Number.isNaN(paycheck({ ...b, gross: NaN, children: -2 }).takeHome), 'us-paycheck: blank pay never gives NaN');
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => { d.open = true; }));
  await page.selectOption('.upc-state', 'TX'); await page.fill('.upc-pay', '75000'); await page.fill('.upc-k', '0'); await page.waitForTimeout(100);
  check((await page.textContent('.upc-line')).includes('Taxes take 17.9%') && (await page.textContent('.upc-next')).includes('703.50'), 'us-paycheck: plain sentence and next $1,000 line');
  await page.fill('.upc-cmp', '95000'); await page.waitForTimeout(100);
  check(await page.isVisible('.upc-cmpout'), 'us-paycheck: compare box shows a sentence');
  await page.fill('.upc-pay', ''); await page.waitForTimeout(100);
  check((await page.textContent('.upc-line')).includes('Type your pay') && !(await page.textContent('.upc-res')).includes('NaN'), 'us-paycheck: blank pay gives a friendly message, no NaN');
};
