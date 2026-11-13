// #T950 Price tracker
export const path = '/money/price-tracker/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/price-tracker/`); await page.waitForTimeout(300);
  const R = '.pt ', card = (n) => `${R}.pt-item:nth-child(${n}) `;
  const txt = (s) => page.textContent(s);
  check((await txt(card(1) + '.pt-v')).startsWith('Same as its recent low (179.99)'), `price: headphones same as low (${await txt(card(1) + '.pt-v')})`);
  check((await txt(card(1) + '.pt-note')).includes('199.99, so 10.0% off'), 'price: real saving 10.0% vs typical 199.99');
  check((await txt(card(1) + '.pt-flag')).includes('40.0% off is inflated'), 'price: inflated was price flagged');
  check((await txt(card(2) + '.pt-v')).startsWith('Real deal: 25.0% below'), `price: air fryer real deal (${await txt(card(2) + '.pt-v')})`);
  await page.fill(R + '.pt-budget', '400'); await page.waitForTimeout(100);
  const s = await txt(R + '.pt-sum');
  check(s.includes('269.98') && s.includes('save 55.00') && s.includes('130.02 left'), `price: basket total, saving and budget (${s})`);
  await page.fill(card(2) + '.pt-date', '2026-11-28'); await page.fill(card(2) + '.pt-price', '139.99'); await page.click(card(2) + '.pt-log-add'); await page.waitForTimeout(100);
  check((await txt(card(2) + '.pt-v')).startsWith('Not a deal: 50.00 more'), `price: higher price is not a deal (${await txt(card(2) + '.pt-v')})`);
  check(await page.evaluate(() => localStorage.getItem('fibub-price-tracker-v1')) === null, 'price: nothing stored until remember is ticked');
  await page.check(R + '.pt-remember'); await page.waitForTimeout(50);
  check((await page.evaluate(() => localStorage.getItem('fibub-price-tracker-v1')) || '').includes('Air fryer'), 'price: remember stores the list');
  await page.click(R + '.pt-clear'); await page.waitForTimeout(50);
  check(await page.evaluate(() => localStorage.getItem('fibub-price-tracker-v1')) === null && (await page.$$(R + '.pt-item')).length === 0, 'price: clear empties list and storage');
};
