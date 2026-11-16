// #1744 Loan comparison
export const path = '/money/loan-comparison/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/loan-comparison/`); await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true))); /* OPEN-DETAILS */ await page.waitForTimeout(400);
  const tab = () => page.textContent('.lc .lc-tab');
  check((await tab()).includes('304.22'), 'loan-comparison: 10,000 at 6% for 3 years = 304.22 a month');
  const apr = await page.$$eval('.lc .lc-tab tbody tr:nth-child(4) td', (t) => t.slice(1).map((x) => parseFloat(x.textContent)));
  check(Math.abs(apr[0] - 6) < 0.01 && apr[1] > 4.5 + 0.3, `loan-comparison: APR equals rate without fees, above it with fees (${apr})`);
  check((await tab()).includes('Lowest cost'), 'loan-comparison: marks the cheapest offer');
  check((await page.textContent('.lc .lc-conv')).startsWith('17.9'), `loan-comparison: flat 10% for 3 years is about 17.9% reducing (${await page.textContent('.lc .lc-conv')})`);
  await page.selectOption('.lc .lc-count', '4'); await page.waitForTimeout(100);
  check((await page.$$eval('.lc .lc-tab thead th', (t) => t.length)) === 5, 'loan-comparison: four offers show four columns');
  check(/cheapest overall/.test(await page.textContent('.lc .lc-ans')) && (await page.textContent('.lc .lc-ans2')).includes('lowest APR'), 'loan-comparison: plain one-line answer names the cheapest offer');
  check((await page.$$('.lc .lc-bar')).length === 4, 'loan-comparison: one cost bar per offer');
  await page.fill('.lc .lc-offer[data-n="0"] [data-k="amount"]', '20000');
  await page.check('.lc [data-k="same"]'); await page.waitForTimeout(100);
  check((await page.inputValue('.lc .lc-offer[data-n="3"] [data-k="amount"]')) === '20000' && (await page.isDisabled('.lc .lc-offer[data-n="3"] [data-k="amount"]')), 'loan-comparison: "same amount and years" copies offer A to the others');
  check((await tab()).includes('608.44'), 'loan-comparison: 20,000 at 6% for 3 years = 608.44 a month');
  await page.uncheck('.lc [data-k="same"]');
  await page.fill('.lc .lc-offer[data-n="1"] [data-k="years"]', '5'); await page.waitForTimeout(100);
  check((await page.textContent('.lc .lc-ans2')).includes('different years'), 'loan-comparison: different terms are flagged');
  await page.fill('.lc .lc-offer[data-n="2"] [data-k="amount"]', ''); await page.waitForTimeout(100);
  check(!/NaN|Infinity/.test(await page.textContent('.lc')) && (await page.textContent('.lc .lc-warn')).includes('Fill in'), 'loan-comparison: blank box gives a friendly message, no NaN');
  await page.selectOption('.lc [data-k="dir"]', 'r2f'); await page.fill('.lc [data-k="flat"]', '10'); await page.waitForTimeout(100);
  const r2f = parseFloat(await page.textContent('.lc .lc-conv'));
  check(r2f > 5 && r2f < 6.5, `loan-comparison: 10% reducing over 3 years is about 5.5% flat (${r2f})`);
};
