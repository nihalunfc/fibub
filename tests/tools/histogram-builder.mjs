// #1286 Histogram and frequency polygon builder
export const path = '/learn/histogram-builder/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/histogram-builder/`); await page.waitForSelector('.hb .hb-fig .hb-bar');
  const R = '.hb ';
  const txt = (s) => page.textContent(R + s);
  const freqs = () => page.$$eval(R + '.hb-table tr', (rows) => rows.slice(1, -1).map((r) => r.cells[2].textContent).join());
  check((await freqs()) === '2,4,7,9,5,2,1' && (await page.$$(R + '.hb-bar')).length === 7, 'histogram: example table 2,4,7,9,5,2,1 and 7 bars');
  check((await page.$$(R + '.hb-dot')).length === 9, 'histogram: polygon has 9 points (closed at both ends)');
  const f = await txt('.hb-facts');
  check(f.includes('61.6') && f.includes('61.5') && f.includes('none') && f.includes('60 – 70'), 'histogram: mean, median, mode, modal class');
  check((await txt('.hb-gm')).includes('1,860 ÷ 30 = 62') && (await txt('.hb-gm')).includes('off by 0.4'), 'histogram: grouped mean 62');
  await page.fill(R + '.hb-w', '5'); await page.waitForTimeout(150);
  check((await page.$$(R + '.hb-bar')).length === 12 && (await page.inputValue(R + '.hb-s')) === '35', 'histogram: width 5 gives 12 classes from 35');
  await page.fill(R + '.hb-w', '10'); await page.waitForTimeout(100); await page.fill(R + '.hb-s', '25'); await page.waitForTimeout(150);
  check((await freqs()) === '0,3,5,10,7,4,1', 'histogram: start 25 regroups the same data');
  await page.uncheck(R + '.hb-bars'); await page.waitForTimeout(100);
  check((await page.$$(R + '.hb-bar')).length === 0 && (await page.$$(R + '.hb-pl')).length === 1, 'histogram: bars off, polygon stays');
  await page.check(R + '.hb-bars'); await page.uncheck(R + '.hb-poly'); await page.waitForTimeout(100);
  check((await page.$$(R + '.hb-pl')).length === 0 && (await page.$$(R + '.hb-bar')).length > 0, 'histogram: polygon off');
  await page.check(R + '.hb-poly');
  await page.click(R + '.hb-pre[data-p="plants"]'); await page.waitForTimeout(150);
  check((await page.inputValue(R + '.hb-w')) === '1' && (await txt('.hb-sum')).includes('20 numbers from 9.8 to 18.3'), 'histogram: plants preset with width 1');
  await page.click(R + '.hb-pre[data-p="travel"]'); await page.waitForTimeout(150);
  check((await txt('.hb-facts')).includes('Mode'), 'histogram: travel preset');
  await page.fill(R + '.hb-data', '3, 4, cat'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.hb-err') && (await txt('.hb-err')).includes('"cat"'), 'histogram: bad number message');
  await page.fill(R + '.hb-data', '5'); await page.waitForTimeout(100);
  check((await txt('.hb-err')).includes('at least two'), 'histogram: too few numbers');
  await page.fill(R + '.hb-data', '1 2 2 3 3 3 4'); await page.waitForTimeout(150);
  check(await page.isHidden(R + '.hb-err') && (await txt('.hb-facts')).includes('3most common'), 'histogram: own data, mode 3');
  check((await txt('.hb-cm')).includes('3,260 ÷ 50 = 65.2'), 'histogram: combined mean 65.2');
  await page.fill(R + '.hb-n2', '0'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.hb-cerr'), 'histogram: combined mean bad size');
  await page.fill(R + '.hb-n2', '30'); await page.waitForTimeout(100);
  check((await txt('.hb-cm')).includes('= 66.'), 'histogram: equal groups give the plain average');
  check((await page.$$(R + '.sm-q')).length === 4, 'histogram: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`);
    const m = /(?:= |That is |≈ )(−?[\d.,]*\d)\.?$/.exec(w.trim());
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1].replace(/,/g, '') : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `histogram: quiz ${i} (${w})`);
  }
  // Solve your own numbers (shared card, src/lib/learn/solvecard-b.ts)
  await page.goto(`${BASE}/learn/histogram-builder/`); await page.waitForTimeout(600);
  {
  const S = '.hb-solve ', ans = () => page.textContent(S + '.sv-answer'), work = () => page.textContent(S + '.sv-work');
  const pre = async (n) => { await page.selectOption(S + '[data-k="sv-example"]', ''); await page.selectOption(S + '[data-k="sv-example"]', String(n)); await page.waitForTimeout(60); };
  const fill = async (k, v) => { await page.fill(S + `[data-k="sv-${k}"]`, v); await page.waitForTimeout(40); };
  const pick = async (k, v) => { await page.selectOption(S + `[data-k="sv-${k}"]`, v); await page.waitForTimeout(40); };
  await pre(0); check((await ans()) === 'Mean = 9, median = 8, mode = 7, range = 11.' && (await work()).includes('Median = the average of the 3rd and 4th values = 8'), `histogram solve: raw (${await ans()})`);
  await fill('data', '3 3 5 5 9'); check((await ans()) === 'Mean = 5, median = 5, mode = 3 and 5, range = 6.', `histogram solve: two modes (${await ans()})`);
  await fill('data', '1.5, 2.5, 3.5, 4.5'); check((await ans()) === 'Mean = 3, median = 3, mode = none, range = 3.', `histogram solve: decimals, no mode (${await ans()})`);
  await fill('data', '4 x'); check((await ans()).includes('cannot read'), `histogram solve: bad number (${await ans()})`);
  await pre(1); check((await ans()) === 'Mean ≈ 37, median ≈ 38, mode ≈ 40.91.' && (await work()).includes('Σf = N = 50 and Σfx = 1850') && (await work()).includes('Median = l + ((N/2 − cf) / f) × h = 30 + ((25 − 13) / 15) × 10 = 38'), `histogram solve: grouped (${await ans()})`);
  await fill('freq', '5 8 15 16'); check((await ans()).includes('one frequency per class'), `histogram solve: count mismatch (${await ans()})`);
  await fill('freq', '5 8 15 6 16'); check((await ans()) === 'Mean ≈ 39, median ≈ 38, mode ≈ 53.85.', `histogram solve: modal class last (${await ans()})`);
  await fill('freq', '0 0 0 0 0'); check((await ans()).includes('add up to 0'), `histogram solve: zero frequencies (${await ans()})`);
  await fill('edges', '10 5 30 40 50 60'); await fill('freq', '5 8 15 16 6'); check((await ans()).includes('must go up'), `histogram solve: boundaries not rising (${await ans()})`);
  await pre(2); check((await ans()) === 'The combined mean is 65.2.', `histogram solve: combined mean (${await ans()})`);
  await fill('n1', '0'); check((await ans()).includes('more than 0'), `histogram solve: empty group (${await ans()})`);
  }
};
