// #1758 Cash runway
export const path = '/money/cash-runway/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/cash-runway/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.cr [data-k="${k}"]`, v); };
  const txt = async (c) => (await page.textContent(`.cr ${c}`)).trim();
  await page.selectOption('.cr [data-k="cur"]', 'USD');
  await set('cash', '120000'); await set('burn', '10000'); await page.waitForTimeout(100);
  check((await txt('.cr-s-months')) === '12.0', '120,000 at 10,000 a month = 12 months (' + (await txt('.cr-s-months')) + ')');
  await set('bg', '2'); await page.waitForTimeout(100);
  check((await txt('.cr-s-months')) === '10.9', 'burn rising 2% a month = 10.9 months (' + (await txt('.cr-s-months')) + ')');
  await page.selectOption('.cr [data-k="mode"]', 'rc'); await set('rev', '4000'); await set('cost', '10000'); await set('rg', '0'); await set('cg', '0'); await page.waitForTimeout(100);
  check((await txt('.cr-s-months')) === '20.0', 'revenue 4,000 and costs 10,000 = 20 months (' + (await txt('.cr-s-months')) + ')');
  await set('rev', '12000'); await page.waitForTimeout(100);
  check((await txt('.cr-s-months')).includes('Not running out'), 'revenue above costs never runs out');
  check((await page.locator('.cr-rows tr').count()) > 0, 'month table has rows');
};
