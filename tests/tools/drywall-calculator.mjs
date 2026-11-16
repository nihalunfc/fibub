// #T870 Drywall calculator
export const path = '/everyday/drywall-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/drywall-calculator/`); await page.waitForTimeout(300);
  const R = '.dwc ';
  const big = () => page.textContent(R + '.dwc-big');
  const lines = () => page.textContent(R + '.dwc-lines');
  check((await big()) === '13 sheets', `drywall: metric 3.6 x 3 x 2.4 m, 1200 x 2400 -> 13 sheets (${await big()})`);
  await page.selectOption(R + '[data-k="units"]', 'ft'); await page.waitForTimeout(150);
  check((await big()) === '13 sheets' && (await lines()).includes('= 352 sq ft'), `drywall: 12 x 10 x 8 ft walls 352 sq ft, 4x8 + 10% -> 13 sheets (${await big()})`);
  check((await lines()).includes('13 × 32 = 416'), 'drywall: screws 13 x 32 = 416');
  await page.click(R + '[data-k="ceil"]'); await page.waitForTimeout(100);
  check((await big()) === '17 sheets', `drywall: plus 120 sq ft ceiling -> 472 sq ft, 17 sheets (${await big()})`);
  await page.selectOption(R + '[data-k="sheet"]', '48'); await page.waitForTimeout(100);
  check((await big()) === '11 sheets' && (await lines()).includes('× 48'), `drywall: 4x12 sheets -> 11, 48 screws each (${await big()})`);
  // More options: rooms, price, sketch.
  await page.goto(`${BASE}/everyday/drywall-calculator/`); await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.fill(R + '[data-k="price"]', '8'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.dwc-cost')).includes('104.00'), `drywall: 13 sheets x 8 = 104.00 (${await page.textContent(R + '.dwc-cost')})`);
  check((await page.locator(R + '.dwc-sk svg').count()) === 1, 'drywall: plan sketch of the room');
  await page.fill(R + '[data-k="rooms"]', '2'); await page.waitForTimeout(100);
  check((await big()) === '25 sheets', `drywall: two rooms 63.36 m² / 2.88 x 1.1 -> 25 sheets (${await big()})`);
  check((await page.textContent(R + '.dwc-cost')).includes('200.00'), 'drywall: 25 x 8 = 200.00');
  await page.fill(R + '[data-k="price"]', '-3'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.dwc-cost')).trim() === '', 'drywall: a negative price shows no cost');
};
