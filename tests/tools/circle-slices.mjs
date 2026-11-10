// #1253 Area of a circle by slicing
export const path = '/learn/circle-slices/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/circle-slices/`); await page.waitForSelector('.cs .cs-fig path');
  const R = '.cs ', txt = (s) => page.textContent(R + s);
  check((await page.$$(R + '.cs-fig path')).length === 8 && (await page.$$(R + '.cs-fig .cs-a')).length === 4, 'slices: 8 slices, 4 up');
  check((await txt('.cs-w')) === '21.43' && (await txt('.cs-h')) === '6.467' && (await txt('.cs-wh')) === '138.593' && (await txt('.cs-pi')) === '153.938' && (await txt('.cs-f')).includes('90.03% of πr²'), 'slices: example r = 7, n = 8');
  check((await txt('.cs-fig')).includes('≈ πr = 21.99'), 'slices: πr label');
  await page.fill(R + '.cs-n', '64'); await page.waitForTimeout(80);
  check((await page.$$(R + '.cs-fig path')).length === 64 && (await txt('.cs-f')).includes('99.84%'), 'slices: 64 slices 99.84%');
  await page.fill(R + '.cs-n', '7'); await page.waitForTimeout(80);
  check((await page.$$(R + '.cs-fig path')).length === 8, 'slices: odd n rounds up to even');
  await page.fill(R + '.cs-n', '8'); await page.fill(R + '.cs-r', '14'); await page.waitForTimeout(80);
  check((await txt('.cs-big')) === 'Area of the circle = πr² ≈ 615.75', 'slices: r = 14 area 615.75');
  // Roll back into the circle: every slice tip at the centre.
  await page.locator(R + '.cs-t').fill('0'); await page.waitForTimeout(80);
  const tips = await page.$$eval(R + '.cs-fig path', (ps) => ps.map((p) => p.getAttribute('d').split(' ')[0]));
  check(new Set(tips).size === 1 && tips[0] === 'M170,90', `slices: unroll 0 is the whole circle (${tips[0]})`);
  await page.click(R + '.cs-play'); await page.waitForTimeout(2200);
  check(Number(await page.inputValue(R + '.cs-t')) === 1, 'slices: play unrolls');
  for (let i = 1; i <= 4; i++) {
    const w = await page.textContent(`${R}.sm-q:nth-child(${i}) .sm-qwork`);
    const m = i === 4 ? /so (\d+) times/.exec(w) : /(?:= |≈ )([\d.]+) cm/.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await page.textContent(`${R}.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `slices: quiz ${i} (${w})`);
  }
};
