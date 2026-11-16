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
  // new options: common pans, swap, same-area round pan, friendly factor
  await page.click(R + '.pan-reset'); await page.waitForTimeout(100);
  const pre = (p, v) => page.selectOption(R + `[data-p="${p}"] [data-preset]`, v);
  await pre('a', 'round-8'); await pre('b', 'round-9'); await page.waitForTimeout(100);
  check((await big()) === '× 1.27' && (await page.textContent(R + '.pan-equiv')).includes('about 1¼ times'), `pan: presets 8 in -> 9 in round, about 1¼ times (${await big()})`);
  await pre('a', 'square-8'); await pre('b', 'rect-9x13'); await page.waitForTimeout(100);
  check((await big()) === '× 1.83' && (await page.textContent(R + '.pan-equiv')).includes('round pan about 12.2 in across'), `pan: 8 in square -> 9x13 (${await page.textContent(R + '.pan-equiv')})`);
  await page.check(R + '[name="pan-u"][value="cm"]'); await page.waitForTimeout(100);
  check((await big()) === '× 1.9' && (await page.inputValue(f('b', 'd1'))) === '33', `pan: presets follow the unit switch, 20 cm square -> 33 x 23 cm (${await big()})`);
  await page.click(R + '.pan-swap'); await page.waitForTimeout(100);
  check((await big()) === '× 0.53' && (await page.inputValue(f('a', 'shape'))) === 'rect', `pan: swap the two pans (${await big()})`);
  await page.fill(f('a', 'd1'), '30'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '[data-p="a"] [data-preset]')) === '', 'pan: typing a size clears the preset choice');
  await page.fill(f('a', 'd1'), ''); await page.waitForTimeout(100);
  check((await page.textContent(R + '.pan-say')).includes('Fill in both pans') && !(await page.textContent(R + '.pan-big')).includes('NaN'), 'pan: blank size gives a message');
};
