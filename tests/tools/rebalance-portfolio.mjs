// #1754 Rebalance portfolio
export const path = '/money/rebalance-portfolio/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/rebalance-portfolio/`); await page.waitForTimeout(300);
  await page.selectOption('.rb [data-k="cur"]', 'USD'); await page.waitForTimeout(100);
  const rows = async () => await page.$$eval('.rb .rb-out tr', (r) => r.map((x) => x.textContent));
  let r = await rows();
  check(r.length === 2 && r[0].includes('Sell $1,000.00') && r[1].includes('Buy $1,000.00'), 'rebalance-portfolio: 6000/4000 at 50/50 sells 1,000 and buys 1,000');
  await page.fill('.rb [data-k="cash"]', '2000'); await page.check('.rb [data-k="buyonly"]'); await page.waitForTimeout(100);
  r = await rows();
  check(r[0].includes('Hold') && r[1].includes('Buy $2,000.00'), 'rebalance-portfolio: buy only puts 2,000 cash into the bond fund');
  await page.click('.rb .rb-add'); await page.waitForTimeout(100);
  check((await rows()).length === 3, 'rebalance-portfolio: Add a row adds a holding');
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.fill('.rb [data-k="band"]', '15'); await page.waitForTimeout(100);
  check((await page.textContent('.rb-note')).includes('within 15 points'), 'rebalance: 10 points off is within a 15-point band');
  check((await page.textContent('.rb-out tr:nth-child(1) td:nth-child(4)')).includes('+10 pts'), 'rebalance: shares fund shows +10 pts');
  await page.fill('.rb [data-k="band"]', '5'); await page.waitForTimeout(100);
  check((await page.textContent('.rb-note')).includes('worth doing'), 'rebalance: outside a 5-point band says rebalance');
};
