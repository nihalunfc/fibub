// #1755 Dividend calculator
export const path = '/money/dividend-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/dividend-calculator/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.dv [data-k="${k}"]`, v); };
  const t = async (c) => await page.textContent(`.dv ${c}`);
  await page.selectOption('.dv [data-k="cur"]', 'USD');
  await set('dg', '0'); await set('pg', '0'); await set('years', '2'); await page.waitForTimeout(100);
  check((await t('.dv-s-y')).includes('3%') && (await t('.dv-s-yc')).includes('6%'), 'dividend-calculator: yield 3% and yield on cost 6%');
  check((await t('.dv-s-i')).includes('300.00'), 'dividend-calculator: income is 300');
  check((await t('.dv-s-last')).includes('309.00'), 'dividend-calculator: DRIP makes year 2 income 309');
  await page.uncheck('.dv [data-k="drip"]'); await page.waitForTimeout(100);
  check((await t('.dv-s-last')).includes('300.00'), 'dividend-calculator: without DRIP year 2 income stays 300');
  await set('shares', '0'); await page.waitForTimeout(100);
  check(await page.isVisible('.dv .dv-err'), 'dividend-calculator: zero shares shows a message');
};
