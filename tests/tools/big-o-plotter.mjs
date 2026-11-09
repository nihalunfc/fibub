// #574 Big-O and runtime comparison plotter
export const path = '/science/big-o-plotter/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/big-o-plotter/`); await page.waitForTimeout(600);
  const R = '.bo';
  const facts = async () => Object.fromEntries((await page.$$eval(`${R} .bo-facts div`, (ds) => ds.map((d) => [d.querySelector('dt').textContent, d.querySelector('dd').textContent]))));
  const table = (sel) => page.$$eval(`${R} ${sel} tr`, (rs) => rs.map((r) => [...r.children].map((c) => c.textContent)));
  check((await page.textContent(`${R} .bo-big`)) === 'Best fit: O(n)', 'bigo: example timings fit O(n)');
  { const f = await facts(); check(f['Fitted line'] === 'time = −0.01250 + 8.310e-4 × n' && f['R²'] === '0.9988' && f['Next best'] === 'O(n log n), leftover 2.38 × larger' && f['Log-log slope'].startsWith('1.01'), `bigo: example fit facts (${JSON.stringify(f)})`); }
  { const t = await table('.bo-fittab'); check(t.length === 9 && t[1][0] === 'O(n)' && t[1][5] === 'best' && t.find((r) => r[0] === 'O(n!)')[5] === 'too large to fit at these n' && t.find((r) => r[0] === 'O(n²)')[3] === '0.9410', 'bigo: fit table sorted by leftover, huge classes noted'); }
  { const t = await table('.bo-attab'); const g = (c) => t.find((r) => r[0] === c);
    check(g('O(n)')[1] === '1,000' && g('O(n)')[2] === '1 µs' && g('O(n³)')[2] === '1 s' && g('O(2ⁿ)')[1] === '1.07 × 10^301' && g('O(n!)')[1] === '4.02 × 10^2,567' && g('n(n - 1)/2')[1] === '499,500', 'bigo: size table at n = 1000'); }
  check(await page.isVisible(`${R} .bo-gfig`) && await page.isVisible(`${R} .bo-ffig`), 'bigo: both charts drawn');
  await page.fill(`${R} .bo-ns`, '1000'); await page.waitForTimeout(400);
  check((await table('.bo-attab')).find((r) => r[0] === 'O(n²)')[2] === '1 s', 'bigo: time per step changes the times');
  await page.fill(`${R} .bo-at`, '1000000'); await page.fill(`${R} .bo-ns`, '1'); await page.waitForTimeout(400);
  check((await table('.bo-attab')).find((r) => r[0] === 'O(n²)')[2] === '16.7 minutes', 'bigo: n² at a million is 16.7 minutes');
  // Own formulas and options
  await page.fill(`${R} .bo-expr`, '3n^2 + 10n\nlog(n)'); await page.waitForTimeout(400);
  check((await table('.bo-attab')).some((r) => r[0] === '3n^2 + 10n' && r[1] === '3,000,010,000,000'), 'bigo: own formula in the size table');
  await page.fill(`${R} .bo-expr`, 'n + m'); await page.waitForTimeout(400);
  check((await page.textContent(`${R} .bo-gerr`)).includes('formulas can only use n'), 'bigo: formula with another letter refused');
  await page.fill(`${R} .bo-expr`, 'n^'); await page.waitForTimeout(400);
  check((await page.textContent(`${R} .bo-gerr`)).includes('"n^"'), 'bigo: broken formula message');
  await page.fill(`${R} .bo-expr`, ''); await page.uncheck(`${R} .bo-ylog`); await page.fill(`${R} .bo-ymax`, '500'); await page.waitForTimeout(400);
  check(await page.isHidden(`${R} .bo-gerr`) && await page.isVisible(`${R} .bo-gfig`), 'bigo: linear axis with a cut');
  await page.fill(`${R} .bo-N`, '1'); await page.waitForTimeout(400);
  check((await page.textContent(`${R} .bo-gerr`)).includes('2 to 1,000,000,000'), 'bigo: n range message');
  await page.fill(`${R} .bo-N`, '5000'); await page.fill(`${R} .bo-ymax`, ''); await page.waitForTimeout(400);
  for (const el of await page.$$(`${R} .bo-c`)) await el.uncheck();
  check((await page.textContent(`${R} .bo-gerr`)).includes('Tick at least one'), 'bigo: nothing ticked message');
  await page.check(`${R} .bo-c[value=n2]`); await page.waitForTimeout(100);
  check(await page.isHidden(`${R} .bo-gerr`), 'bigo: one class drawn up to 5000');
  // Fit options and bad data
  await page.check(`${R} .bo-flog`); await page.waitForTimeout(200);
  check(await page.isVisible(`${R} .bo-ffig`), 'bigo: log scales on the fit chart');
  await page.fill(`${R} .bo-data`, 'n\tt\n10\t1\n20\tx\n30\t3'); await page.waitForTimeout(400);
  check((await page.textContent(`${R} .bo-ferr`)) === 'Row 2 is missing a number for n or time.' && await page.isHidden(`${R} .bo-fout`), 'bigo: bad row message');
  await page.fill(`${R} .bo-data`, '1 5\n2 5'); await page.waitForTimeout(400);
  check((await page.textContent(`${R} .bo-ferr`)).includes('at least 3 rows'), 'bigo: too few rows message');
  // A file: quadratic timings.
  writeFileSync(OUT + 'bo-times.csv', 'size,time (s)\n100,0.012\n200,0.041\n400,0.162\n800,0.65\n1600,2.61\n');
  await page.setInputFiles(`${R} .dfb-in`, OUT + 'bo-times.csv'); await page.waitForTimeout(500);
  check((await page.textContent(`${R} .bo-big`)) === 'Best fit: O(n²)' && (await page.textContent(`${R} .dfb-note`)).includes('Opened bo-times.csv'), 'bigo: file of quadratic timings fits O(n²)');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .bo-csv`)]); const f = OUT + 'bo-fit.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 9 && rows[0] === 'class,a,b,R2,RSS,note' && rows[1].startsWith('O(n²),'), 'bigo: fit CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .bo-tcsv`)]); const f = OUT + 'bo-at.csv'; await d.saveAs(f); check(readFileSync(f, 'utf8').trim().split('\n').length === 2, 'bigo: size table CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .dl button[data-f=png]`)]); check((await d.suggestedFilename()) === 'big-o.png', 'bigo: image report'); }
  // Time a built-in algorithm: pairs loop is O(n²).
  await page.selectOption(`${R} .bo-bench`, 'pairs');
  check((await page.textContent(`${R} .bo-sizes`)).startsWith('Sizes: 500, 1,000'), 'bigo: sizes listed');
  await page.click(`${R} .bo-run`);
  await page.waitForFunction(() => /Done|Stopped/.test(document.querySelector('.bo-prog').textContent), null, { timeout: 60000 });
  { const big = await page.textContent(`${R} .bo-big`), rows = (await page.inputValue(`${R} .bo-data`)).trim().split('\n'), t = rows.slice(1).map((r) => Number(r.split('\t')[1]));
    // Real timings vary with the machine, so check the shape, not the exact class: 8 times more n should take far more than 8 times as long.
    check(rows.length === 7 && rows[0] === 'n\ttime (ms)' && t.every((x) => x > 0) && t[5] / t[0] > 15 && big.startsWith('Best fit: O('), `bigo: timing the pair loop fills the box and fits (${big}, ${t.join(' ')})`); }
  await page.selectOption(`${R} .bo-bench`, 'subsets'); await page.click(`${R} .bo-run`); await page.click(`${R} .bo-stop`);
  await page.waitForFunction(() => /Done|Stopped/.test(document.querySelector('.bo-prog').textContent), null, { timeout: 60000 });
  check(/Stopped after|Done/.test(await page.textContent(`${R} .bo-prog`)), 'bigo: timing can be stopped');
  await page.screenshot({ path: OUT + 'big-o-plotter.png', fullPage: true });
};
