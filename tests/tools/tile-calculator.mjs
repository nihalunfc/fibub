// #T868 Tile calculator
export const path = '/everyday/tile-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/tile-calculator/`); await page.waitForTimeout(300);
  const R = '.tlc ';
  const big = () => page.textContent(R + '.tlc-big');
  const box = () => page.textContent(R + '.tlc-box');
  check((await big()) === '147 tiles', `tile: 3 x 4 m, 30 x 30 cm, 10% -> 147 tiles (${await big()})`);
  check((await box()).startsWith('15 boxes'), `tile: boxes of 10 -> 15 (${await box()})`);
  check((await page.textContent(R + '.tlc-lines')).includes('about 3.1 kg'), 'tile: grout about 3.1 kg');
  await page.selectOption(R + '[data-k="lay"]', '15'); await page.waitForTimeout(100);
  check((await big()) === '154 tiles', `tile: diagonal 15% -> 154 tiles (${await big()})`);
  await page.click(R + '.tlc-tabs [data-m="planks"]'); await page.fill(R + '[data-k="waste"]', '10'); await page.waitForTimeout(150);
  check((await big()) === '6 boxes', `tile: planks 12 m² + 10% at 2.2 m²/box -> 6 boxes (${await big()})`);
};
