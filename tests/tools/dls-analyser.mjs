// #859 DLS analyser
export const path = '/science/dls-analyser/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.dls ';
  await page.goto(`${BASE}/science/dls-analyser/`); await page.waitForTimeout(800);
  const big = () => page.textContent(R + '.dls-big'), facts = () => page.textContent(R + '.dls-facts'), peaks = () => page.textContent(R + '.dls-peaks tbody');
  check((await big()) === 'Z-average 67.83 nm · PDI 0.169', `dls: example headline (${await big()})`);
  { const t = await facts(); check(t.includes('5024.4 s⁻¹') && t.includes('72') && t.includes('0.920'), 'dls: example cumulant facts match NumPy'); }
  check((await page.textContent(R + '.dls-setup')).includes('q = 0.026354 nm⁻¹') && (await page.textContent(R + '.dls-setup')).includes('0.8901 mPa·s'), 'dls: scattering vector and water viscosity shown');
  { const t = await peaks(); check(t.includes('61.9') && t.includes('85.4 %') && t.includes('370.4') && t.includes('14.6 %'), `dls: intensity peaks match scipy nnls (${t})`); }
  check((await page.textContent(R + '.dls-dfacts')).includes('67.79 nm'), 'dls: harmonic mean shown next to the z-average');
  check(await page.isVisible(R + '.dls-fig') && await page.isVisible(R + '.dls-dfig'), 'dls: both plots drawn');
  // Volume and number views.
  await page.click(R + '.dls-seg button[data-k=volume]'); await page.waitForTimeout(150);
  check((await peaks()).includes('100.0 %') && (await page.getAttribute(R + '.dls-seg button[data-k=volume]', 'aria-pressed')) === 'true', 'dls: volume distribution, one peak');
  await page.click(R + '.dls-seg button[data-k=number]'); await page.waitForTimeout(150);
  check((await peaks()).includes('49.88'), `dls: number distribution peak (${await peaks()})`);
  await page.click(R + '.dls-seg button[data-k=intensity]');
  // CSV downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dls-csv')]); const f = OUT + 'dls.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'diameter_nm,intensity_pct,volume_pct,number_pct' && rows.length === 81 && rows[1].startsWith('1,'), `dls: distribution CSV (${rows.length} rows)`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dls-fcsv')]); const f = OUT + 'dlsf.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'tau_s,g2_minus_B,cumulant_fit,distribution_fit' && rows.length === 141 && rows[100].split(',')[2] === '', `dls: fits CSV (${rows.length} rows)`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); check((await d.suggestedFilename()) === 'dls-analysis.pdf', 'dls: PDF report'); }
  // 3rd order and cut-off.
  await page.selectOption(R + '.dls-ord', '3'); await page.waitForTimeout(200);
  check((await big()) === 'Z-average 68.40 nm · PDI 0.104' && (await facts()).includes('Third cumulant'), `dls: 3rd-order cumulants (${await big()})`);
  await page.selectOption(R + '.dls-ord', '2'); await page.fill(R + '.dls-cut', '50'); await page.waitForTimeout(200);
  check(!(await big()).includes('67.83'), 'dls: cut-off changes the fit range');
  await page.fill(R + '.dls-cut', '10');
  // Temperature: viscosity follows.
  await page.fill(R + '.dls-t', '20'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.dls-setup')).includes('1.002 mPa·s'), 'dls: water at 20 °C is 1.002 mPa·s');
  await page.fill(R + '.dls-t', '25');
  // Other liquid with water's viscosity typed in: same answer.
  await page.selectOption(R + '.dls-liq', 'other'); await page.fill(R + '.dls-eta', '0.8901162'); await page.waitForTimeout(200);
  check((await big()) === 'Z-average 67.83 nm · PDI 0.169' && await page.isVisible(R + '.dls-eta'), 'dls: typed viscosity');
  await page.fill(R + '.dls-eta', '1.7802324'); await page.waitForTimeout(200);
  check((await big()).startsWith('Z-average 33.91 nm'), `dls: doubling the viscosity halves the size (${await big()})`);
  await page.selectOption(R + '.dls-liq', 'water');
  // Angle 90°: the same data then mean a different size (q changes).
  await page.fill(R + '.dls-ang', '90'); await page.waitForTimeout(200);
  check(!(await big()).includes('67.83'), 'dls: angle changes q and the size');
  await page.fill(R + '.dls-ang', '173');
  // Smoothing and size range.
  await page.fill(R + '.dls-alpha', '0.3'); await page.waitForTimeout(300);
  check(!(await peaks()).includes('85.4 %'), 'dls: more smoothing changes the peaks');
  await page.fill(R + '.dls-alpha', '0.001'); await page.waitForTimeout(300);
  await page.click(R + '.dls-seg button[data-k=volume]'); await page.waitForTimeout(150);
  check(await page.isVisible(R + '.dls-warn') && (await page.textContent(R + '.dls-warn')).includes('touches the edge'), 'dls: edge-of-range warning for a spike at 1 nm');
  await page.click(R + '.dls-seg button[data-k=intensity]'); await page.fill(R + '.dls-alpha', '0.01');
  await page.fill(R + '.dls-bins', '5'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.dls-derr')).includes('20 and 200'), 'dls: bins message');
  await page.fill(R + '.dls-bins', '80'); await page.fill(R + '.dls-dmax', '1'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.dls-derr')).includes('size range'), 'dls: size range message');
  await page.fill(R + '.dls-dmax', '10000');
  // g2 − 1 column and τ in ms: same answer.
  const ex = (await page.inputValue(R + '.dls-data')).trim().split('\n').slice(1).map((l) => l.split('\t').map(Number));
  await page.selectOption(R + '.dls-col', 'g2m1'); await page.selectOption(R + '.dls-tu', '1e-3');
  await page.fill(R + '.dls-data', ex.map(([t, g]) => `${t / 1000}\t${(g - 1).toFixed(6)}`).join('\n')); await page.waitForTimeout(300);
  check((await big()) === 'Z-average 67.83 nm · PDI 0.169', `dls: g2 − 1 in ms gives the same (${await big()})`);
  // Baseline from the tail: shifted g2.
  await page.selectOption(R + '.dls-col', 'g2'); await page.selectOption(R + '.dls-base', 'tail');
  await page.fill(R + '.dls-data', ex.map(([t, g]) => `${t / 1000}\t${(g + 0.05).toFixed(6)}`).join('\n')); await page.waitForTimeout(300);
  check((await big()).startsWith('Z-average 67.') && /Baseline B1\.0(49|50)/.test(await facts()), `dls: tail baseline finds 1.05 (${await big()})`);
  await page.selectOption(R + '.dls-base', 'one'); await page.waitForTimeout(200);
  // Bad input.
  await page.fill(R + '.dls-data', '1\t2\n3\t4'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.dls-err')).includes('at least ten lines') && await page.isHidden(R + '.dls-dcard'), 'dls: too few lines message');
  await page.fill(R + '.dls-data', ex.map(([t, g], i) => `${i === 5 ? 'x' : t}\t${g}`).join('\n')); await page.waitForTimeout(200);
  check((await page.textContent(R + '.dls-err')).includes('Line 6'), 'dls: bad line message');
  await page.fill(R + '.dls-data', ex.map(([t, g]) => `${t}\t${g}`).reverse().join('\n')); await page.waitForTimeout(200);
  check((await page.textContent(R + '.dls-err')).includes('rise from line to line'), 'dls: falling delay times message');
  await page.fill(R + '.dls-data', ex.map(([t, g]) => `${t}\t${2 - g}`).join('\n')); await page.waitForTimeout(200);
  check((await page.textContent(R + '.dls-err')).includes('baseline'), 'dls: correlation below baseline message');
  await page.fill(R + '.dls-data', ex.map(([t, g]) => `${t}\t${g}`).join('\n')); await page.fill(R + '.dls-lam', '5'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.dls-err')).includes('wavelength'), 'dls: wavelength message');
  await page.fill(R + '.dls-lam', '633');
  // Open a file: monodisperse 100 nm, noise free.
  const s = 26354027.320816685, G = (1.380649e-23 * 298.15 * s * s) / (3 * Math.PI * 0.8901162239194773e-3 * 100e-9);
  writeFileSync(OUT + 'dls.csv', 'tau_us,g2\n' + Array.from({ length: 100 }, (_, i) => { const t = 1 * 1e5 ** (i / 99); return `${t.toPrecision(8)},${(1 + 0.9 * Math.exp(-2 * G * t * 1e-6)).toFixed(9)}`; }).join('\n'));
  await page.selectOption(R + '.dls-tu', '1e-6'); await page.setInputFiles(R + '.dfb-in', OUT + 'dls.csv'); await page.waitForTimeout(500);
  check((await big()) === 'Z-average 100 nm · PDI 0.000' && (await page.textContent(R + '.dfb-note')).includes('Opened dls.csv'), `dls: opened file of 100 nm spheres (${await big()})`);
};
