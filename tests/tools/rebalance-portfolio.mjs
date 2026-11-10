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
};
