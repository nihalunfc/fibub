// #1719 Unit price
export const path = '/money/unit-price/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/unit-price/`); await page.waitForTimeout(400);
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
};
