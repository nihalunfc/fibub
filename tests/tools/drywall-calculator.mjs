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
};
