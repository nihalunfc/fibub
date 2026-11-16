// #1759 Depreciation
export const path = '/money/depreciation/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/depreciation/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.dp [data-k="${k}"]`, v); };
  const txt = async (c) => (await page.textContent(`.dp ${c}`)).trim();
  const cell = async (r, c) => (await page.textContent(`.dp-rows tr:nth-child(${r}) td:nth-child(${c})`)).trim();
  await page.selectOption('.dp [data-k="cur"]', 'USD');
  await set('cost', '10000'); await set('salv', '1000'); await set('life', '5'); await page.waitForTimeout(100);
  check((await txt('.dp-s-first')).includes('1,800.00'), 'straight line 10,000, salvage 1,000, 5 years = 1,800 a year (' + (await txt('.dp-s-first')) + ')');
  check((await txt('.dp-s-end')).includes('1,000.00'), 'ends at salvage');
  await page.selectOption('.dp [data-k="method"]', 'db'); await page.waitForTimeout(100);
  check((await cell(1, 2)).includes('4,000.00'), 'double declining year 1 = 4,000 (' + (await cell(1, 2)) + ')');
  check((await txt('.dp-s-end')).includes('1,000.00'), 'declining balance ends at salvage');
  await page.selectOption('.dp [data-k="method"]', 'syd'); await page.waitForTimeout(100);
  check((await cell(1, 2)).includes('3,000.00') && (await cell(5, 2)).includes('600.00'), 'sum of years digits 3,000 first, 600 last');
  await page.selectOption('.dp [data-k="method"]', 'units'); await page.waitForTimeout(100);
  check((await cell(1, 2)).includes('1,800.00'), 'units of production year 1 = 1,800 (' + (await cell(1, 2)) + ')');
  await set('salv', '20000'); await page.waitForTimeout(100);
  check(await page.isVisible('.dp .dp-err'), 'salvage above cost shows a message');
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.selectOption('.dp [data-k="method"]', 'sl');
  await page.fill('.dp [data-k="cost"]', '10000'); await page.fill('.dp [data-k="salv"]', '1000'); await page.fill('.dp [data-k="life"]', '5');
  await page.fill('.dp [data-k="sy"]', '2'); await page.fill('.dp [data-k="sp"]', '7000'); await page.waitForTimeout(100);
  check((await page.textContent('.dp-sale')).includes('600.00') && (await page.textContent('.dp-sale')).includes('gain'), 'depreciation: sold at 7,000 after year 2 (book 6,400) gains 600');
  check((await page.locator('.dp-cmp tr').count()) === 3, 'depreciation: three methods compared');
};
