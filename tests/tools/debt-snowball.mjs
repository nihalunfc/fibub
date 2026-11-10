// #1722 Debt payoff
export const path = '/money/debt-snowball/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/debt-snowball/`); await page.waitForTimeout(400);
  const R = '.ds ';
  const cols = () => page.$$eval(R + '.ds-col', (els) => els.map((e) => e.textContent));
  const interest = (t) => +t.match(/Interest: ([\d,]+)/)[1].replace(/,/g, '');
  const months = (t) => +t.match(/(\d+) months/)[1];
  let c = await cols();
  check(c.length === 3, 'debt-snowball: three columns');
  check(interest(c[1]) <= interest(c[0]), `debt-snowball: avalanche interest ${interest(c[1])} <= snowball ${interest(c[0])}`);
  check(interest(c[1]) < interest(c[0]), 'debt-snowball: avalanche strictly cheaper in this case');
  check(months(c[2]) > months(c[0]), 'debt-snowball: minimums only takes longer');
  check(c[0].includes('Store card') && c[1].includes('Credit card'), 'debt-snowball: payoff order shown');
  // one debt: 1000 at 12% APR paying 100 a month = 11 months
  await page.fill(R + '[data-k="extra"]', '0');
  const rows = await page.$$(R + '.ds-row');
  for (let k = rows.length - 1; k > 0; k--) await rows[k].$eval('button', (b) => b.click());
  await page.fill(R + '[data-f="bal"]', '1000'); await page.fill(R + '[data-f="apr"]', '12'); await page.fill(R + '[data-f="min"]', '100'); await page.waitForTimeout(150);
  c = await cols();
  check(months(c[0]) === 11, `debt-snowball: 1000 at 12% paying 100 = 11 months (${months(c[0])})`);
  await page.click(R + '.ds-add'); await page.waitForTimeout(100);
  check((await page.locator(R + '.ds-row').count()) === 2, 'debt-snowball: add a debt');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ds-csv')]);
  check(dl.suggestedFilename().endsWith('.csv'), 'debt-snowball: CSV downloads');
};
