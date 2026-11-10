// #T862 Pan size converter
export const path = '/everyday/pan-size-converter/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/pan-size-converter/`); await page.waitForTimeout(300);
  const R = '.pan ';
  const big = () => page.textContent(R + '.pan-big');
  const f = (p, k) => R + `[data-p="${p}"] [data-f="${k}"]`;
  check((await big()) === '× 1.27', `pan: 8 in round -> 9 in round x1.27 (${await big()})`);
  check((await page.textContent(R + '[data-p="a"] .pan-area')).startsWith('Area 50.3 sq in') && (await page.textContent(R + '[data-p="b"] .pan-area')).startsWith('Area 63.6 sq in'), 'pan: areas 50.3 and 63.6 sq in');
  await page.selectOption(f('a', 'shape'), 'square'); await page.fill(f('a', 'd1'), '8');
  await page.selectOption(f('b', 'shape'), 'rect'); await page.fill(f('b', 'd1'), '13'); await page.fill(f('b', 'd2'), '9'); await page.waitForTimeout(100);
  check((await big()) === '× 1.83', `pan: 8 in square -> 9x13 in x1.83 (${await big()})`);
  await page.click(R + '.pan-reset'); await page.check(R + '[name="pan-u"][value="cm"]');
  await page.fill(f('a', 'd1'), '20'); await page.fill(f('b', 'd1'), '23'); await page.waitForTimeout(100);
  check((await big()) === '× 1.32' && (await page.textContent(R + '[data-p="a"] .pan-area')).includes('cm²'), `pan: cm 20 -> 23 round x1.32 (${await big()})`);
  await page.selectOption(f('b', 'shape'), 'vol'); await page.fill(f('b', 'vol'), '2.5'); await page.fill(f('a', 'depth'), '5'); await page.waitForTimeout(100);
  check((await big()) === '× 1.59', `pan: 20 cm x 5 cm round (1.57 l) -> 2.5 l bundt x1.59 (${await big()})`);
};
