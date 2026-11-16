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
  await page.evaluate(() => document.querySelectorAll('.gd details').forEach((d) => (d.open = true)));
  await page.uncheck(R + '.gd-incl');
  await page.fill(R + '.gd-in', '10-19 5\n20-29 4'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.gd-err') && (await txt('.gd-err')).includes('9.5') && await page.isHidden(R + '.gd-out'), 'grouped: gap message when the fix is off');
  await page.check(R + '.gd-incl'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.gd-err') && (await txt('.gd-note')).includes('gap of 1') && (await txt('.gd-tab')).includes('9.5–19.5'), 'grouped: inclusive classes closed automatically');
  check((await txt('.gd-big')) === 'Mean 18.94 · Median 18.5 · Mode 17.83', `grouped: inclusive example (${await txt('.gd-big')})`);
  await page.fill(R + '.gd-in', 'hello'); await page.waitForTimeout(100);
  check((await txt('.gd-err')).includes('should look like'), 'grouped: bad line message');
  await page.click(R + '.gd-ex'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.gd-err') && (await txt('.gd-big')).startsWith('Mean 52.8') && (await txt('.gd-mean')).includes('a = 50'), 'grouped: example button restores');
  // Spread and presets.
  check((await txt('.gd-sdbig')) === 'Standard deviation 24.66 · Variance 608.16', `grouped: SD and variance (${await txt('.gd-sdbig')})`);
  { const sp = await txt('.gd-spread'); check(sp.includes('30408 / 50 = 608.16') && sp.includes('= 34.44') && sp.includes('= 72.5') && sp.includes('Q₃ − Q₁ = 72.5 − 34.44 = 38.06'), `grouped: quartiles (${sp.slice(0, 200)})`); }
  check((await txt('.gd-emp')).includes('= 54.4. The formula gave 53.33'), 'grouped: empirical relation line');
  await page.click(R + '.gd-pre[data-p="marks"]'); await page.waitForTimeout(100);
  check((await txt('.gd-big')) === 'Mean 28 · Median 28.33 · Mode 28.33' && (await txt('.gd-sdbig')).includes('Variance 136'), 'grouped: marks preset');
  await page.click(R + '.gd-pre[data-p="heights"]'); await page.waitForTimeout(100);
  check((await txt('.gd-big')) === 'Mean 160.25 · Median 160.57 · Mode 161.38' && await page.isVisible(R + '.gd-note'), 'grouped: heights preset (inclusive classes)');
  await page.click(R + '.gd-pre[data-p="uneven"]'); await page.waitForTimeout(100);
  check((await txt('.gd-big')) === 'Mean 19.38 · Median 17.5 · Mode 18.75' && (await txt('.gd-mean')).includes('equal width'), 'grouped: uneven preset');
  await page.fill(R + '.gd-in', ''); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.gd-err') && (await txt('.gd-err')).includes('at least two classes'), 'grouped: blank table message');
  await page.click(R + '.gd-ex'); await page.waitForTimeout(100);
  // Quiz.
  check((await page.$$(R + '.sm-q')).length === 3, 'grouped: three questions');
  for (const i of [1, 2, 3]) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = /≈ (\S+)\.$/.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `grouped: quiz ${i} (${w})`);
  }
};
