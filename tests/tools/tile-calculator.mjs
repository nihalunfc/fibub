// #T868 Tile calculator
export const path = '/everyday/tile-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/tile-calculator/`); await page.waitForTimeout(300);
  const R = '.tlc ';
  const big = () => page.textContent(R + '.tlc-big');
  const box = () => page.textContent(R + '.tlc-box');
  const lines = () => page.textContent(R + '.tlc-lines');
  check((await big()) === '147 tiles', `tile: 3 x 4 m, 30 x 30 cm, 10% -> 147 tiles (${await big()})`);
  check((await box()).startsWith('15 boxes'), `tile: boxes of 10 -> 15 (${await box()})`);
  check((await page.textContent(R + '.tlc-lines')).includes('about 3.1 kg'), 'tile: grout about 3.1 kg');
  await page.selectOption(R + '[data-k="lay"]', '15'); await page.waitForTimeout(100);
  check((await big()) === '154 tiles', `tile: diagonal 15% -> 154 tiles (${await big()})`);
  await page.click(R + '.tlc-tabs [data-m="planks"]'); await page.fill(R + '[data-k="waste"]', '10'); await page.waitForTimeout(150);
  check((await big()) === '6 boxes', `tile: planks 12 m² + 10% at 2.2 m²/box -> 6 boxes (${await big()})`);
  // More options: price, adhesive, grout bags, sketch.
  await page.goto(`${BASE}/everyday/tile-calculator/`); await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.fill(R + '[data-k="price"]', '20'); await page.fill(R + '[data-k="adh"]', '5'); await page.fill(R + '[data-k="gbag"]', '2.5'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.tlc-cost')).includes('300.00'), `tile: 15 boxes x 20 = 300.00 (${await page.textContent(R + '.tlc-cost')})`);
  check((await lines()).includes('Adhesive: 12.00 m² ÷ 5.00 m² per bag = 3 bags.'), 'tile: 12 m² at 5 m² per bag = 3 bags of adhesive');
  check((await lines()).includes('Grout: 3.1 kg ÷ 2.50 kg bags = 2 bags.'), 'tile: 3.1 kg grout in 2.5 kg bags = 2 bags');
  check((await page.textContent(R + '.tlc-sk')).includes('10 × 14 tiles') && (await page.locator(R + '.tlc-sk svg').count()) === 1, 'tile: sketch shows 10 x 14 tiles for 3 x 4 m');
  await page.selectOption(R + '[data-k="pby"]', 'unit'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.tlc-cost')).includes('3,000.00'), 'tile: price per tile 20 x 150 tiles (15 boxes of 10) = 3,000.00');
  await page.fill(R + '[data-k="price"]', ''); await page.waitForTimeout(100);
  check((await page.textContent(R + '.tlc-cost')).trim() === '', 'tile: blank price shows no cost');
};
