// #884 Age-depth model
export const path = '/science/age-depth-model/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/age-depth-model/`);
  await page.waitForFunction(() => document.querySelector('.adm .adm-f1')?.dataset.drawn, null, { timeout: 8000 });
  const txt = async (c) => (await page.textContent(c)).replace(/\s+/g, ' ').trim();
  const cells = (c, n) => page.evaluate(([c, n]) => [...document.querySelectorAll(`${c} tbody tr:nth-child(${n}) td`)].map((td) => td.textContent).join(' | '), [c, n]);
  const redraw = async (fn) => { const d = await page.getAttribute('.adm .adm-f1', 'data-drawn'); await fn(); await page.waitForFunction((d) => document.querySelector('.adm .adm-f1').dataset.drawn !== d, d, { timeout: 8000 }); };
  const type = (sel, v) => redraw(async () => { await page.fill(sel, v); await page.dispatchEvent(sel, 'input'); });
  check((await txt('.adm .adm-big')) === '10 dates, 0 to 440 cm: 1 flagged', 'age-depth: example model');
  check((await txt('.adm .adm-msg')).startsWith('Monte Carlo: 2,000 draws kept of 32,297 (6.19 %). Spline: χ² = 10.'), 'age-depth: Monte Carlo acceptance and spline χ²');
  check((await cells('.adm .adm-tab', 6)) === '226 | 3150 | 60 | bulk sediment | 3275 | -2.08 | Off the curve' && (await cells('.adm .adm-tab', 5)).endsWith('| 1.85 | OK'), 'age-depth: outlier flagged');
  check((await cells('.adm .adm-ptab', 3)) === '300 | 5398 | 5497 | 5397 | 5275 | 5516', 'age-depth: ages at 300 cm (linear, spline, MC)');
  check((await cells('.adm .adm-ptab', 4)).startsWith('470 | 9744'), 'age-depth: extrapolated below the last date');
  // Leave the outlier out
  await type('.adm .adm-in', (await page.inputValue('.adm .adm-in')).replace('226,3150', '# 226,3150'));
  check((await txt('.adm .adm-big')) === '9 dates, 0 to 440 cm: none flagged' && (await txt('.adm .adm-msg')).includes('(100 %)') && (await txt('.adm .adm-msg')).includes('1 date left out'), 'age-depth: # leaves a date out');
  // Accumulation rate and deposition time
  await redraw(() => page.selectOption('.adm .adm-rate', 'acc'));
  check((await txt('.adm .adm-rh')) === 'Accumulation rate' && (await page.getAttribute('.adm .adm-f2', 'aria-label')) === 'Accumulation rate by depth', 'age-depth: accumulation rate');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.adm .adm-csvm')]); const f = OUT + 'adm.csv'; await d.saveAs(f); const s = readFileSync(f, 'utf8').trim().split('\n');
    const h = s[0].split(','), r = s.find((l) => l.startsWith('230,')).split(',');
    check(d.suggestedFilename() === 'age-depth-model.csv' && s.length === 178 && h[0] === 'depth_cm' && h[7] === 'linear_rate_cm/yr' && Math.abs(Number(r[7]) - 67 / 1430) < 1e-6, 'age-depth: model CSV with rates'); }
  await redraw(() => page.selectOption('.adm .adm-rate', 'dep'));
  // No extrapolation, own range and step
  await redraw(() => page.uncheck('.adm .adm-ext'));
  check((await cells('.adm .adm-ptab', 4)) === '470 | – | – | – | – | –', 'age-depth: no extrapolation');
  await page.fill('.adm .adm-top', '100'); await type('.adm .adm-step', '20');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.adm .adm-csvm')]); const f = OUT + 'adm2.csv'; await d.saveAs(f); const s = readFileSync(f, 'utf8').trim().split('\n'); check(s.length === 19 && s[1].startsWith('100,') && s[18].startsWith('440,'), 'age-depth: top depth and step'); }
  await page.fill('.adm .adm-top', ''); await page.fill('.adm .adm-step', '');
  await redraw(() => page.check('.adm .adm-ext'));
  // Spline S = 0 passes through the dates; ka units
  await type('.adm .adm-s', '0');
  check((await cells('.adm .adm-tab', 5)).includes('| 3290 | 0.00 |'), 'age-depth: S = 0 interpolates');
  await redraw(() => page.selectOption('.adm .adm-au', 'ka'));
  check((await txt('.adm .adm-tab thead')).includes('Age (ka)'), 'age-depth: age unit');
  await redraw(() => page.selectOption('.adm .adm-au', 'cal yr BP'));
  // Seed and runs change the Monte Carlo
  await type('.adm .adm-n', '5000');
  check((await txt('.adm .adm-msg')).startsWith('Monte Carlo: 5,000 draws kept'), 'age-depth: more runs');
  await type('.adm .adm-seed', '7');
  // Predicted depths from a list, CSV
  await type('.adm .adm-pd', 'depth\n10, 50\nabc');
  check((await txt('.adm .adm-perr')) === 'Not read: abc.' && (await page.$$eval('.adm .adm-ptab tbody tr', (r) => r.length)) === 2, 'age-depth: depth list with a header and a bad value');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.adm .adm-csvp')]); const f = OUT + 'admp.csv'; await d.saveAs(f); const s = readFileSync(f, 'utf8').trim().split('\n'); check(d.suggestedFilename() === 'ages-at-depths.csv' && s.length === 3 && s[0] === 'depth_cm,linear,spline,mc_median,mc_2.5,mc_97.5' && s[1].startsWith('10,'), 'age-depth: ages-at-depths CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.adm .dl [data-f=pdf]')]); check(d.suggestedFilename() === 'age-depth-model.pdf', 'age-depth: report PDF'); }
  // Open a file (CSV with duplicates)
  writeFileSync(OUT + 'core.csv', 'depth,age,sd\n10,100,10\n10,140,30\n20,300,20\n35,330,15\n50,700,40\n');
  await redraw(() => page.setInputFiles('.adm .dfb-in', OUT + 'core.csv'));
  check((await txt('.adm .adm-big')).startsWith('4 dates, 10 to 50 cm') && (await txt('.adm .adm-msg')).includes('Combined (error-weighted mean): 2 dates at depth 10'), 'age-depth: file opened, duplicates combined');
  // Reversal flagged; Monte Carlo warns
  await type('.adm .adm-in', '0,0,10\n10,500,20\n20,300,20\n30,900,20');
  check((await cells('.adm .adm-tab', 2)).endsWith('Reversal') || (await cells('.adm .adm-tab', 2)).endsWith('Off the curve; reversal'), 'age-depth: reversal flagged');
  check(/Only (\d+ of 5000 Monte Carlo draws|[\d.]+ % of draws)/.test(await txt('.adm .adm-msg')), 'age-depth: Monte Carlo warns about reversals');
  // Bad input
  await page.fill('.adm .adm-in', '10,100\nfoo'); await page.dispatchEvent('.adm .adm-in', 'input'); await page.waitForTimeout(600);
  check((await txt('.adm .adm-err')).startsWith('Line 1, 2: type a depth') && await page.isHidden('.adm .adm-out'), 'age-depth: bad lines');
  await page.fill('.adm .adm-in', '10,100,5\n20,200,5'); await page.fill('.adm .adm-n', '50'); await page.dispatchEvent('.adm .adm-n', 'input'); await page.waitForTimeout(600);
  check((await txt('.adm .adm-serr')).startsWith('Monte Carlo runs must be'), 'age-depth: bad settings');
  await page.fill('.adm .adm-n', '2000'); await page.fill('.adm .adm-s', ''); await page.fill('.adm .adm-seed', '1');
  await type('.adm .adm-in', '10,100,5\n20,200,5');
  check((await txt('.adm .adm-big')) === '2 dates, 10 to 20 cm: none flagged', 'age-depth: two dates are enough');
};
