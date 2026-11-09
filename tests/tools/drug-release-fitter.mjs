// #682 Drug release curve fitter
export const path = '/science/drug-release-fitter/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/drug-release-fitter/`); await page.waitForTimeout(1000);
  const big = () => page.textContent('.krel .kx-big'), tab = () => page.textContent('.krel .kx-tab'), err = () => page.textContent('.krel .kx-err');
  const wait = () => page.waitForTimeout(500);
  check((await big()) === 'Best model: Weibull (AIC 0.45, R² 0.9992)', 'release: example best model');
  { const t = await tab(); check(t.includes('k₀ = 5.944') && t.includes('k₁ = 0.2034') && t.includes('k_H = 23.98') && t.includes('n = 0.6643') && t.includes('k_HC = 0.2568') && t.includes('τ (time to 63.2 %) = 4.968') && t.includes('β (shape) = 0.8107'), 'release: all six models in the table'); }
  check((await tab()).includes('Anomalous (non-Fickian)') && (await tab()).includes('fitted to 6 points up to 60 %') && (await page.$$('.krel .kx-best')).length === 1, 'release: Peppas mechanism and one best row');
  check(await page.isVisible('.krel .kx-fig'), 'release: chart shown');
  // Shape and limit.
  await page.selectOption('.krel .kx-geo', 'film'); await wait();
  check((await tab()).includes('Anomalous'), 'release: slab shape, n 0.664 still anomalous');
  await page.fill('.krel .kx-lim', '40'); await wait();
  check((await tab()).includes('fitted to 4 points up to 40 %'), 'release: Peppas limit 40 %');
  await page.fill('.krel .kx-lim', '60');
  // Fractions.
  const ex = await page.inputValue('.krel .kx-data');
  await page.fill('.krel .kx-data', ex.split('\n').map((l, i) => (i ? l.split('\t')[0] + '\t' + (parseFloat(l.split('\t')[1]) / 100).toFixed(3) : l)).join('\n'));
  await page.selectOption('.krel .kx-as', 'frac'); await wait();
  check((await big()) === 'Best model: Weibull (AIC 0.45, R² 0.9992)', 'release: same result from fractions');
  await page.selectOption('.krel .kx-as', 'pct'); await wait();
  // Zero-order data: zero order wins.
  await page.fill('.krel .kx-data', 't\tF\n1\t5.1\n2\t9.8\n3\t15.2\n4\t19.9\n6\t30.1\n8\t39.8\n10\t50.2'); await wait();
  check((await big()).startsWith('Best model: Zero order'), 'release: straight-line release picks zero order');
  // CSV.
  await page.fill('.krel .kx-data', ex); await wait();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.krel .kx-csv')]); const f = OUT + 'rel.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 7 && rows[0].startsWith('model,equation,parameters') && rows[6].startsWith('Weibull (best)'), 'release: fits CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.krel .dl button[data-f=docx]')]); check((await d.suggestedFilename()) === 'release-fits.docx', 'release: Word report download'); }
  // Open a file.
  writeFileSync(OUT + 'rel.csv', 'minutes,percent\n15,7.9\n30,13.3\n60,23.9\n120,38.6\n180,49.7\n240,56.8\n360,68\n480,75.9\n600,83.2\n720,88.3\n960,92.4\n1440,95.8\n');
  await page.locator('.krel .dfb-in').first().setInputFiles(OUT + 'rel.csv'); await page.waitForTimeout(1200);
  check((await big()).startsWith('Best model: Weibull') && (await tab()).includes('τ (time to 63.2 %) = 298.1'), 'release: file in minutes, τ scales by 60');
  // Bad input.
  await page.fill('.krel .kx-data', '1\t5\n2\t9'); await wait();
  check((await err()).includes('at least 3 rows') && await page.isHidden('.krel .kx-out'), 'release: too few points');
  await page.fill('.krel .kx-data', '1\t5\n2\t150\n3\t20'); await wait();
  check((await err()).includes('between 0 and 100 %'), 'release: value over 100 %');
  await page.fill('.krel .kx-data', ex); await page.fill('.krel .kx-lim', '0'); await wait();
  check((await err()).includes('Korsmeyer-Peppas limit'), 'release: bad Peppas limit');
  await page.fill('.krel .kx-lim', '60'); await wait();
  // Degradation.
  const dbig = () => page.textContent('.krel .kx-dbig'), dfacts = () => page.textContent('.krel .kx-dfacts');
  check((await dbig()) === 'k = 0.03551 per day · half-life 19.5 days' && (await dfacts()).includes('100 % (fixed)') && (await dfacts()).includes('R²0.9996'), 'release: degradation example');
  await page.click('.krel .kx-m0'); await wait();
  check((await dfacts()).includes('100.1 ± 0.38 %') && (await dbig()).startsWith('k = 0.03557'), 'release: degradation with M₀ fitted');
  const dex = await page.inputValue('.krel .kx-ddata');
  await page.fill('.krel .kx-ddata', dex.split('\n').map((l, i) => (i ? l.split('\t')[0] + '\t' + (100 - parseFloat(l.split('\t')[1])).toFixed(1) : l)).join('\n'));
  await page.selectOption('.krel .kx-das', 'loss'); await wait();
  check((await dbig()).startsWith('k = 0.03557'), 'release: mass lost gives the same fit');
  await page.fill('.krel .kx-ddata', '0\t50\n5\t60\n10\t70'); await page.selectOption('.krel .kx-das', 'rem'); await wait();
  check((await page.textContent('.krel .kx-derr')).includes('does not fall'), 'release: rising mass message');
};
