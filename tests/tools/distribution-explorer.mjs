// #563 Probability distribution explorer
export const path = '/science/distribution-explorer/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const big = () => page.textContent('.dx .dx-big');
  const facts = () => page.textContent('.dx .dx-facts');
  const wait = () => page.waitForTimeout(350);
  const setParam = async (k, v) => { await page.fill(`.dx .dx-p[data-k="${k}"]`, v); };
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  check((await big()) === 'P(−1.96 < X < 1.96) = 0.950004', `distribution explorer: opens on the normal 95 % interval (${await big()})`);
  { const f = await facts(); check(f.includes('Mean0') && f.includes('Variance1') && f.includes('Excess kurtosis0') && f.includes('Outside, 1 − P0.0499958'), 'distribution explorer: normal moments and complement'); }
  { const t = await page.textContent('.dx .dx-qt'); check(t.includes('−1.95996') && t.includes('1.95996'), 'distribution explorer: quantile table'); }
  check(await page.isVisible('.dx .dx-pdf') && await page.isVisible('.dx .dx-cdf'), 'distribution explorer: density and CDF charts drawn');
  await page.setViewportSize({ width: 375, height: 900 }); await page.screenshot({ path: OUT + 'distribution-explorer-375.png', fullPage: true }); await page.setViewportSize({ width: 1280, height: 900 });

  // Every shading option.
  await page.selectOption('.dx .dx-r', 'below'); await wait();
  check((await big()) === 'P(X < 1.96) = 0.975002', `distribution explorer: left tail (${await big()})`);
  await page.selectOption('.dx .dx-r', 'above'); await wait();
  check((await big()) === 'P(X > −1.96) = 0.975002', `distribution explorer: right tail (${await big()})`);
  await page.selectOption('.dx .dx-r', 'outside'); await wait();
  check((await big()) === 'P(X < −1.96 or X > 1.96) = 0.0499958', `distribution explorer: both tails (${await big()})`);
  await page.fill('.dx .dx-a', '8'); await page.fill('.dx .dx-b', '9'); await page.selectOption('.dx .dx-r', 'between'); await wait();
  check((await big()) === 'P(8 < X < 9) = 6.2198 × 10⁻¹⁶', `distribution explorer: far tail keeps its digits (${await big()})`);

  // A whole-number distribution: end points included.
  await page.selectOption('.dx .dx-d', 'binomial'); await wait();
  check((await page.inputValue('.dx .dx-a')) === '2' && (await page.inputValue('.dx .dx-b')) === '10', 'distribution explorer: new distribution suggests its 2.5 % and 97.5 % points');
  await setParam('n', '20'); await setParam('p', '0.3'); await page.fill('.dx .dx-a', '3'); await page.fill('.dx .dx-b', '9'); await wait();
  check((await big()) === 'P(3 ≤ X ≤ 9) = 0.916555', `distribution explorer: binomial between, end points counted (${await big()})`);
  { const f = await facts(); check(f.includes('Mean6') && f.includes('Variance4.2') && f.includes('Skewness0.19518') && f.includes('Support{0, 20}'), 'distribution explorer: binomial moments and support'); }
  await page.selectOption('.dx .dx-r', 'above'); await page.fill('.dx .dx-a', '5'); await wait();
  check((await big()) === 'P(X ≥ 5) = 0.762492', `distribution explorer: binomial right tail (${await big()})`);
  await page.fill('.dx .dx-q', '0.5, 0.95'); await wait();
  { const t = await page.textContent('.dx .dx-qt tbody'); check(/0\.5\s*6/.test(t) && /0\.95\s*9/.test(t), `distribution explorer: discrete quantiles (${t})`); }

  // Curve CSV.
  { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.dx .dx-ccsv')]); const f = OUT + 'dx-curve.csv'; await dl.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'x,pmf,cdf,sf' && rows.length > 10 && rows.some((r) => r.startsWith('6,0.191638')), `distribution explorer: curve CSV (${rows.length} rows)`); }

  // t distribution: the two-sided 5 % critical value.
  await page.selectOption('.dx .dx-d', 't'); await wait();
  await setParam('nu', '10'); await page.selectOption('.dx .dx-r', 'outside'); await page.fill('.dx .dx-a', '-2.228'); await page.fill('.dx .dx-b', '2.228'); await page.fill('.dx .dx-q', '0.975'); await wait();
  { const b = await big(); check(b.startsWith('P(X < −2.228 or X > 2.228) = 0.0500'), `distribution explorer: t two-sided p (${b})`); }
  check((await page.textContent('.dx .dx-qt tbody')).includes('2.22814'), 'distribution explorer: t 0.975 quantile');
  await setParam('nu', '2'); await wait();
  check((await facts()).includes('Varianceinfinite') && (await facts()).includes('Skewnessundefined'), 'distribution explorer: infinite and undefined moments shown in words');

  // A density that is infinite at 0, and plot range.
  await page.selectOption('.dx .dx-d', 'beta'); await wait();
  await setParam('a', '0.5'); await setParam('b', '0.5'); await page.selectOption('.dx .dx-r', 'below'); await page.fill('.dx .dx-b', '0.25'); await wait();
  check((await big()) === 'P(X < 0.25) = 0.333333', `distribution explorer: arcsine law (${await big()})`);
  await page.fill('.dx .dx-x0', '0.1'); await page.fill('.dx .dx-x1', '0.9'); await wait();
  check(await page.isVisible('.dx .dx-pdf') && await page.isHidden('.dx .dx-err'), 'distribution explorer: custom plot range');

  // Random sample: same seed, same numbers; CSV.
  await page.selectOption('.dx .dx-d', 'poisson'); await wait();
  await setParam('lambda', '4'); await wait();
  await page.fill('.dx .dx-n', '2000'); await page.fill('.dx .dx-seed', '7');
  await page.locator('.dx .dx-draw').scrollIntoViewIfNeeded(); await page.click('.dx .dx-draw'); await wait();
  { const f = await page.textContent('.dx .dx-sfacts'); const m = Number(f.match(/Sample mean([\d.]+)/)[1]); check(Math.abs(m - 4) < 0.15 && f.includes('Distribution mean4') && await page.isVisible('.dx .dx-hist'), `distribution explorer: Poisson sample (${f})`); }
  let first;
  { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.dx .dx-scsv')]); const f = OUT + 'dx-sample.csv'; await dl.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); first = rows.slice(1, 20).join(); check(rows[0] === 'value' && rows.length === 2001 && rows.slice(1).every((r) => /^\d+$/.test(r)), 'distribution explorer: sample CSV of 2000 counts'); }
  await page.click('.dx .dx-draw'); await wait();
  { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.dx .dx-scsv')]); const f = OUT + 'dx-sample2.csv'; await dl.saveAs(f); check(readFileSync(f, 'utf8').trim().split('\n').slice(1, 20).join() === first, 'distribution explorer: the same seed repeats the sample'); }
  await page.fill('.dx .dx-seed', '8'); await page.click('.dx .dx-draw'); await wait();
  { const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.dx .dx-scsv')]); const f = OUT + 'dx-sample3.csv'; await dl.saveAs(f); check(readFileSync(f, 'utf8').trim().split('\n').slice(1, 20).join() !== first, 'distribution explorer: another seed, other numbers'); }
  await page.selectOption('.dx .dx-d', 'gamma'); await wait();
  check(await page.isHidden('.dx .dx-sout'), 'distribution explorer: changing distribution clears the old sample');
  await page.click('.dx .dx-draw'); await wait();
  check(await page.isVisible('.dx .dx-hist') && (await page.textContent('.dx .dx-sfacts')).includes('Distribution mean4'), 'distribution explorer: continuous sample histogram');

  // Downloads.
  for (const [f, ext] of [['png', 'png'], ['pdf', 'pdf'], ['docx', 'docx']]) {
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click(`.dx .dl button[data-f="${f}"]`)]);
    check(dl.suggestedFilename() === `gamma-distribution.${ext}`, `distribution explorer: ${f} download`);
  }

  // Bad input.
  await setParam('k', '-1'); await wait();
  check((await page.textContent('.dx .dx-err')).includes('Shape k must be above 0') && await page.isHidden('.dx .dx-out'), 'distribution explorer: negative shape refused');
  await setParam('k', '2'); await page.fill('.dx .dx-q', '0.5, 2'); await wait();
  check((await page.textContent('.dx .dx-err')).includes('between 0 and 1'), 'distribution explorer: quantile probability above 1 refused');
  await page.fill('.dx .dx-q', '0.5'); await page.selectOption('.dx .dx-r', 'between'); await page.fill('.dx .dx-a', '5'); await page.fill('.dx .dx-b', '1'); await wait();
  check((await page.textContent('.dx .dx-err')).includes('b must be at least a'), 'distribution explorer: b below a refused');
  await page.selectOption('.dx .dx-d', 'hypergeom'); await wait();
  await setParam('K', '60'); await wait();
  check((await page.textContent('.dx .dx-err')).includes('cannot be more than the population'), 'distribution explorer: hypergeometric K above N refused');
  await page.fill('.dx .dx-n', '0'); await page.click('.dx .dx-draw'); await wait();
  check((await page.textContent('.dx .dx-serr')).length > 0 && await page.isHidden('.dx .dx-sout'), 'distribution explorer: sample refused while parameters are wrong');
  await setParam('K', '10'); await page.fill('.dx .dx-n', '200001'); await page.click('.dx .dx-draw'); await wait();
  check((await page.textContent('.dx .dx-serr')).includes('1 to 100,000'), 'distribution explorer: too many sample values refused');

  // Every distribution opens with its defaults, gives a probability and draws a sample without errors.
  const ids = await page.$$eval('.dx .dx-d option', (os) => os.map((o) => o.value));
  let okAll = 0; const bad = [];
  await page.fill('.dx .dx-n', '500');
  for (const id of ids) {
    await page.selectOption('.dx .dx-d', id); await page.waitForTimeout(80);
    await page.click('.dx .dx-draw'); await page.waitForTimeout(40);
    const b = await big(), vis = await page.isVisible('.dx .dx-out'), sv = await page.isVisible('.dx .dx-hist');
    if (vis && sv && / = (\d|1 − )/.test(b)) okAll++; else bad.push(id);
  }
  check(ids.length === 35 && okAll === 35, `distribution explorer: all 35 distributions work with their defaults ${bad.join(' ')}`);
};
