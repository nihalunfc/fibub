// #1367 Bomb calorimeter (maths in tests/sci-tools/bomb-calorimeter.mjs)
export const path = '/learn/bomb-calorimeter/';
export default async ({ page, check, BASE }) => {
  const R = '.bcx ';
  const t = (s) => page.textContent(R + s);
  const tap = async (s) => { const b = page.locator(R + s); await b.scrollIntoViewIfNeeded(); await b.click(); };
  await page.goto(`${BASE}/learn/bomb-calorimeter/`); await page.waitForTimeout(400);
  check((await t('.bc-read')) === 'Thermometer: 25.000 °C', 'bomb: starts at 25 °C');
  await tap('.bc-fire2'); check((await t('.bc-err')).includes('Calibrate first'), 'bomb: must calibrate first');
  await tap('.bc-fire1'); await page.waitForTimeout(2200);
  check((await t('.bc-s1')).includes('ΔT = 2.604 K') && (await t('.bc-s1')).includes('= 10.15 kJ/K'), `bomb: calibration (${await t('.bc-s1')})`);
  check((await t('.bc-read')).includes('27.604 °C'), `bomb: thermometer after firing (${await t('.bc-read')})`);
  const px = await page.evaluate(() => { const c = document.querySelector('.bc-fig'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 80 && d[i + 2] > 140) n++; return n; });
  check(px > 100, `bomb: trace drawn (${px} px)`);
  await tap('.bc-fire2'); await page.waitForTimeout(2200);
  check((await t('.bc-s2')).includes('ΔT = 1.839 K') && (await t('.bc-facts')).includes('−2802.3 kJ/mol'), `bomb: glucose (${await t('.bc-facts')})`);
  await page.selectOption(R + '.bc-s', 'naphthalene'); await page.fill(R + '.bc-m2', '1'); await tap('.bc-fire2'); await page.waitForTimeout(2200);
  check((await t('.bc-facts')).includes('−5151.5 kJ/mol') && (await t('.bc-facts')).includes('−5156.5 kJ/mol'), `bomb: naphthalene ΔH (${await t('.bc-facts')})`);
  await page.fill(R + '.bc-m2', '5'); await tap('.bc-fire2'); check((await t('.bc-err')).includes('0.1 to 2'), 'bomb: mass range message');
  await tap('.bc-new'); check((await t('.bc-s1')).includes('calibrate it again') && (await t('.bc-read')) === 'Thermometer: 25.000 °C', 'bomb: new calorimeter resets');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 3, 'bomb: three quiz questions');
  const q1 = await t('.smq-q:nth-child(1) .smq-text'); const m = q1.match(/([\d.]+) g of benzoic acid .* by ([\d.]+) K/);
  await page.fill(R + '.smq-q:nth-child(1) .smq-in', String((+m[1] * 26.43) / +m[2])); await page.click(R + '.smq-q:nth-child(1) .smq-check');
  check((await t('.smq-q:nth-child(1) .smq-out')) === 'Right!', 'bomb: quiz answer');
};
