// #1163 Grouped data mean, median and mode
export const path = '/learn/grouped-data-stats/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/grouped-data-stats/`); await page.waitForSelector('.gd .gd-tab tr');
  const R = '.gd ';
  const txt = (s) => page.textContent(R + s);
  check((await txt('.gd-big')) === 'Mean 52.8 · Median 53.33 · Mode 53.33', 'grouped: example mean, median, mode');
  { const m = await txt('.gd-mean'); check(m.includes('2640 / 50 = 52.8') && m.includes('50 + 140 / 50 = 52.8') && m.includes('50 + (7 / 50) × 20 = 52.8'), `grouped: three methods (${m.slice(0, 200)})`); }
  check((await txt('.gd-med')).includes('40 + ((25 − 15) / 15) × 20 = 53.33') && (await txt('.gd-mode')).includes('40 + ((15 − 9) / (30 − 9 − 12)) × 20 = 53.33'), 'grouped: median and mode formulas');
  check((await page.$$(R + '.gd-tab tr')).length === 7 && (await page.$$(R + '.gd-tab tr.hl')).length === 1, 'grouped: table rows, median/modal class highlighted');
  check((await page.$$(R + '.gd-bar')).length === 5 && (await page.$$(R + '.gd-less')).length === 1 && (await page.$$(R + '.gd-more')).length === 0, 'grouped: histogram and less-than ogive');
  await page.check(R + '.gd-o2'); await page.waitForTimeout(100);
  check((await page.$$(R + '.gd-more')).length === 1 && (await txt('.gd-ogn')).includes('two ogives cross'), 'grouped: more-than ogive');
  await page.fill(R + '.gd-a', '30'); await page.waitForTimeout(100);
  check((await txt('.gd-mean')).includes('Assumed mean (a = 30)') && (await txt('.gd-big')).startsWith('Mean 52.8'), 'grouped: another assumed mean gives the same mean');
  // Unequal widths: no step deviation.
  await page.fill(R + '.gd-in', '0-10 5\n10-30 8\n30-40 2'); await page.waitForTimeout(100);
  check((await txt('.gd-mean')).includes('equal width') && (await page.$$eval(R + '.gd-tab th', (e) => e.length)) === 7, 'grouped: unequal widths skip step deviation');
  // Errors.
  await page.fill(R + '.gd-in', '10-19 5\n20-29 4'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.gd-err') && (await txt('.gd-err')).includes('9.5') && await page.isHidden(R + '.gd-out'), 'grouped: gap message');
  await page.fill(R + '.gd-in', 'hello'); await page.waitForTimeout(100);
  check((await txt('.gd-err')).includes('should look like'), 'grouped: bad line message');
  await page.click(R + '.gd-ex'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.gd-err') && (await txt('.gd-big')).startsWith('Mean 52.8') && (await txt('.gd-mean')).includes('a = 50'), 'grouped: example button restores');
  // Quiz.
  check((await page.$$(R + '.sm-q')).length === 3, 'grouped: three questions');
  for (const i of [1, 2, 3]) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = /≈ (\S+)\.$/.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `grouped: quiz ${i} (${w})`);
  }
};
