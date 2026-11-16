// #1719 Unit price
export const path = '/money/unit-price/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/unit-price/`); await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true))); /* OPEN-DETAILS */ const __op = () => page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true))); for (const m of ['fill', 'selectOption', 'check', 'uncheck', 'click']) { const o = page[m].bind(page); page[m] = async (...a) => { await __op(); return o(...a); }; } /* WRAP-OPEN */  await page.waitForTimeout(400);
  const R = '.up ';
  const big = () => page.textContent(R + '.up-big');
  check((await big()).startsWith('Pack B is cheapest: 0.70 per 100 g'), `unit: 1 kg for 7.00 beats 500 g for 4.00 (${await big()})`);
  const body = await page.textContent(R + '.up-body');
  check(body.includes('0.80 per 100 g') && body.includes('0.70 per 100 g'), 'unit: shows 0.80 and 0.70 per 100 g');
  check(await page.isVisible(R + '.up-body tr.best'), 'unit: cheapest row marked');
  await page.click(R + '.up-add'); await page.waitForTimeout(100);
  const r3 = R + '.up-row:nth-child(3) ';
  await page.fill(r3 + '.up-pr', '2'); await page.fill(r3 + '.up-qt', '1'); await page.selectOption(r3 + '.up-un', 'L'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.up-warn')).includes('cannot be compared'), 'unit: mixing weight and liquid is flagged');
  await page.selectOption(r3 + '.up-un', 'lb'); await page.fill(r3 + '.up-pr', '3'); await page.waitForTimeout(150);
  check((await big()).startsWith('Product 3 is cheapest'), `unit: pounds convert (${await big()})`);
  check((await page.textContent(R + '.up-body')).includes('0.661 per 100 g'), 'unit: 1 lb for 3.00 = 0.661 per 100 g');
  // new options: compare-per basis, % off, best-value note, blank/negative messages, up to 12 products
  await page.fill(r3 + '.up-pr', '3'); await page.waitForTimeout(100);
  await page.click(R + '.up-more summary'); await page.waitForTimeout(100);
  await page.selectOption(R + '[data-k="b-mass"]', 'kg'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.up-body')).includes('7.00 per kg') && (await page.textContent(R + '.up-body')).includes('8.00 per kg'), 'unit: compare per kg');
  await page.selectOption(R + '[data-k="b-mass"]', '100g');
  await page.fill(R + '.up-row:nth-child(1) .up-of', '50'); await page.waitForTimeout(150);
  check((await big()).startsWith('Pack A is cheapest: 0.40 per 100 g'), `unit: 50% off halves the price (${await big()})`);
  check((await page.textContent(R + '.up-body')).includes('Best value'), 'unit: best value marked in the table');
  await page.fill(R + '.up-row:nth-child(1) .up-of', '');
  await page.fill(R + '.up-row:nth-child(1) .up-qt', '-5'); await page.waitForTimeout(150);
  const bt = await page.textContent(R + '.up-body');
  check(bt.includes('Quantity must be above zero') && !bt.includes('NaN'), 'unit: negative quantity gives a friendly message');
  await page.fill(R + '.up-row:nth-child(1) .up-qt', '500');
  for (let i = 0; i < 9; i++) await page.click(R + '.up-add');
  check((await page.locator(R + '.up-row').count()) === 12 && await page.isDisabled(R + '.up-add'), 'unit: up to 12 products');
};
