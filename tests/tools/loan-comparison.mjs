// #1744 Loan comparison
export const path = '/money/loan-comparison/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/loan-comparison/`); await page.waitForTimeout(400);
  const tab = () => page.textContent('.lc .lc-tab');
  check((await tab()).includes('304.22'), 'loan-comparison: 10,000 at 6% for 3 years = 304.22 a month');
  const apr = await page.$$eval('.lc .lc-tab tbody tr:nth-child(4) td', (t) => t.slice(1).map((x) => parseFloat(x.textContent)));
  check(Math.abs(apr[0] - 6) < 0.01 && apr[1] > 4.5 + 0.3, `loan-comparison: APR equals rate without fees, above it with fees (${apr})`);
  check((await tab()).includes('Lowest cost'), 'loan-comparison: marks the cheapest offer');
  check((await page.textContent('.lc .lc-conv')).startsWith('17.9'), `loan-comparison: flat 10% for 3 years is about 17.9% reducing (${await page.textContent('.lc .lc-conv')})`);
  await page.selectOption('.lc .lc-count', '4'); await page.waitForTimeout(100);
  check((await page.$$eval('.lc .lc-tab thead th', (t) => t.length)) === 5, 'loan-comparison: four offers show four columns');
};
