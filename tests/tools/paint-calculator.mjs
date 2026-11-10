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
};
