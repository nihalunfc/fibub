// #T867 Paint calculator
export const path = '/everyday/paint-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/paint-calculator/`); await page.waitForTimeout(300);
  const R = '.pnt ';
  const big = () => page.textContent(R + '.pnt-big');
  const tins = () => page.textContent(R + '.pnt-tins');
  const lines = () => page.textContent(R + '.pnt-lines');
  check((await big()) === '6.52 L of paint', `paint: 4 x 3.5 x 2.4 m, 1 door, 1 window, 2 coats -> 6.52 L (${await big()})`);
  check((await lines()).includes('36.0 m²') && (await lines()).includes('= 32.6 m²') && (await lines()).includes('65.2 m²'), 'paint: 36.0 - 3.4 = 32.6 m², 65.2 m² of coats');
  check((await tins()) === 'Buy 1 × 5 L + 1 × 2.5 L (7.50 L).', `paint: tins 5 L + 2.5 L (${await tins()})`);
  await page.fill(R + '[data-k="coats"]', '1'); await page.waitForTimeout(100);
  check((await big()) === '3.26 L of paint', 'paint: one coat halves it');
  await page.selectOption(R + '[data-k="how"]', 'walls'); await page.waitForTimeout(100);
  check((await big()) === '3.26 L of paint', 'paint: wall-by-wall example matches the room');
  await page.selectOption(R + '[data-k="units"]', 'ft'); await page.waitForTimeout(150);
  check((await big()).includes('US gal'), `paint: imperial in US gallons (${await big()})`);
  // More options: rooms, cost, sketch.
  await page.goto(`${BASE}/everyday/paint-calculator/`); await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.fill(R + '[data-k="price"]', '3'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.pnt-cost')).includes('22.50'), `paint: 7.5 L of tins x 3 = 22.50 (${await page.textContent(R + '.pnt-cost')})`);
  check((await page.locator(R + '.pnt-sk svg').count()) === 1, 'paint: sketch of the 4 x 3.5 m room');
  await page.fill(R + '[data-k="rooms"]', '2'); await page.waitForTimeout(100);
  check((await big()) === '13.04 L of paint' && (await tins()) === 'Buy 3 × 5 L (15.00 L).', `paint: two rooms -> 13.04 L, 3 x 5 L (${await big()} / ${await tins()})`);
  check((await page.textContent(R + '.pnt-cost')).includes('45.00'), 'paint: 15 L x 3 = 45.00');
  await page.fill(R + '[data-k="rooms"]', '0'); await page.waitForTimeout(100);
  check((await big()) === '6.52 L of paint', 'paint: 0 rooms is treated as 1');
  await page.fill(R + '[data-k="price"]', ''); await page.waitForTimeout(100);
  check((await page.textContent(R + '.pnt-cost')).trim() === '', 'paint: blank price shows no cost');
};
