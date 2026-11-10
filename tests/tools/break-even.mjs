// #1730 Break-even
export const path = '/money/break-even/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/break-even/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.be [data-k="${k}"]`, v); };
  const txt = async (c) => page.textContent(`.be ${c}`);
  await page.selectOption('.be [data-k="cur"]', 'USD');
  await set('fixed', '10000'); await set('price', '50'); await set('var', '30'); await page.waitForTimeout(100);
  check((await txt('.be-s-units')).trim() === '500', 'fixed 10,000, price 50, var 30 = 500 units (' + (await txt('.be-s-units')) + ')');
  check((await txt('.be-s-rev')).includes('25,000'), 'break-even sales 25,000');
  check((await txt('.be-s-cm')).includes('20.00'), 'profit per unit 20');
  await set('target', '5000'); await page.waitForTimeout(100);
  check((await txt('.be-s-tgt')).trim() === '750', 'target profit 5,000 needs 750 units');
  await set('chg', '10'); await page.waitForTimeout(100);
  check((await txt('.be-whatout')).includes('400 units'), 'price +10% gives 400 units (' + (await txt('.be-whatout')) + ')');
  await set('var', '60'); await page.waitForTimeout(100);
  check(await page.isVisible('.be .be-err'), 'price below cost shows a message');
};
