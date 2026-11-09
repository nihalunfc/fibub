// #849 Larson-Miller creep calculator
export const path = '/science/larson-miller-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.lmc ', t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/science/larson-miller-calculator/`); await page.waitForTimeout(800);
  check((await t('.lmc-big')) === 'Larson-Miller fit, C = 20: scatter 0.077 in log t', 'creep: example Larson-Miller fit');
  { const f = await t('.lmc-facts'); check(f.includes('LMP = 26056 + 1235.8 x − 1383.7 x²') && f.includes('19.50') && f.includes('stress 60 to 300'), 'creep: master curve and best-fit C (match NumPy and SciPy)'); }
  { const tb = await t('.lmc-tab'); check(tb.includes('Q = 417.2 kJ/mol (fitted)') && tb.includes('Ta = 500.8 K, log ta = 14.89 (fitted)') && tb.includes('0.9841'), 'creep: Sherby-Dorn and Manson-Haferd fitted constants'); }
  { const p = await t('.lmc-ptab'); check(p.includes('Larson-Miller33,784') && p.includes('Sherby-Dorn32,579') && p.includes('Manson-Haferd32,647'), 'creep: predicted lives at 650 °C, 120 MPa'); }
  check((await t('.lmc-nbig')) === 'n = 5.07, Q = 284 kJ/mol' && (await t('.lmc-nfacts')).includes('81.29'), 'creep: Norton fit (matches numpy lstsq)');
  check(await page.isVisible(R + '.lmc-fig') && await page.isVisible(R + '.lmc-nfig'), 'creep: master curve and Norton plots');
  // Allowable stress at 600 °C for 100 000 h.
  await page.fill(R + '.lmc-pt', '600'); await page.waitForTimeout(150);
  check((await t('.lmc-ptab')).includes('857,673178.1'), 'creep: stress for the design life (matches brentq)');
  await page.fill(R + '.lmc-ps', '400'); await page.waitForTimeout(150);
  check((await t('.lmc-pbig')).includes('(extrapolated)'), 'creep: extrapolation flagged');
  await page.fill(R + '.lmc-ps', '120'); await page.fill(R + '.lmc-pt', '650');
  // Constants typed.
  await page.fill(R + '.lmc-c', '19.5'); await page.waitForTimeout(300);
  check((await t('.lmc-big')).includes('C = 19.50: scatter 0.076'), 'creep: own C');
  await page.fill(R + '.lmc-c', '20'); await page.fill(R + '.lmc-q', '300'); await page.waitForTimeout(300);
  check((await t('.lmc-tab')).includes('Q = 300 kJ/mol0.'), 'creep: typed Sherby-Dorn Q');
  await page.fill(R + '.lmc-q', ''); await page.fill(R + '.lmc-ta', '400'); await page.fill(R + '.lmc-lta', '17'); await page.waitForTimeout(300);
  check((await t('.lmc-tab')).includes('Ta = 400 K, log ta = 170.'), 'creep: typed Manson-Haferd constants');
  await page.fill(R + '.lmc-ta', ''); await page.fill(R + '.lmc-lta', '');
  // Degree.
  await page.selectOption(R + '.lmc-deg', '1'); await page.waitForTimeout(300);
  check(!(await t('.lmc-facts')).includes('x²') && (await t('.lmc-facts')).includes(' x'), 'creep: straight-line master curve');
  await page.selectOption(R + '.lmc-deg', '3'); await page.waitForTimeout(300);
  check((await t('.lmc-facts')).includes('x³'), 'creep: cubic master curve');
  await page.selectOption(R + '.lmc-deg', '2'); await page.waitForTimeout(300);
  // CSV.
  { await page.locator(R + '.lmc-csv').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.lmc-csv')]); const f = OUT + 'lmp.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 13 && rows[0].startsWith('temperature_K,stress,rupture_h,larson_miller') && rows[1].startsWith('873.15,300,3590,'), 'creep: data and fits CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); check((await d.suggestedFilename()) === 'larson-miller.pdf', 'creep: PDF report'); }
  // Kelvin: same data typed in K gives the same fit.
  const rows = (await page.inputValue(R + '.lmc-data')).trim().split('\n').slice(1).map((l) => l.split('\t'));
  await page.selectOption(R + '.lmc-tu', 'K'); await page.fill(R + '.lmc-data', rows.map((r) => [+(Number(r[0]) + 273.15).toFixed(2), r[1], r[2]].join('\t')).join('\n')); await page.fill(R + '.lmc-pt', '923.15'); await page.waitForTimeout(400);
  check((await t('.lmc-big')).includes('scatter 0.077') && (await t('.lmc-ptab')).includes('Larson-Miller33,784'), 'creep: temperatures in kelvin');
  // Norton at one temperature (in K now).
  await page.fill(R + '.lmc-ndata', '100\t900\t1e-6\n150\t900\t7.6e-6\n200\t900\t3.2e-5'); await page.waitForTimeout(150);
  check((await t('.lmc-nbig')).startsWith('n = 5.0') && (await t('.lmc-nfacts')).includes('needs two temperatures'), 'creep: Norton at one temperature');
  // Bad input.
  await page.fill(R + '.lmc-ndata', '100\t900\t0\n150\t900\t1\n200\t900\t2'); await page.waitForTimeout(150);
  check((await t('.lmc-nerr')).includes('Line 1'), 'creep: bad creep rate');
  await page.fill(R + '.lmc-data', '873\t100\t1000\n873\t200\t10\n873\t150\t100\n873\t120\t500'); await page.waitForTimeout(150);
  check((await t('.lmc-err')).includes('two or more temperatures') && (await t('.lmc-perr')).includes('Fit the rupture data first'), 'creep: one temperature is not enough');
  await page.fill(R + '.lmc-data', '873\t100\t1000\n923\t-5\t10\n873\t150\t100\n973\t120\t50'); await page.waitForTimeout(150);
  check((await t('.lmc-err')).includes('Line 2'), 'creep: bad rupture line');
  // Open a file.
  writeFileSync(OUT + 'rup.csv', 'T,s,t\n' + rows.map((r) => [+(Number(r[0]) + 273.15).toFixed(2), r[1], r[2]].join(',')).join('\n'));
  await page.locator(R + '.dfb-in').first().setInputFiles(OUT + 'rup.csv'); await page.waitForTimeout(500);
  check((await t('.lmc-big')).includes('scatter 0.077'), 'creep: opened CSV');
};
