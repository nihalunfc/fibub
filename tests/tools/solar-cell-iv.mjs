// #864 Solar cell I-V analyser
export const path = '/science/solar-cell-iv/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.solariv ';
  const txt = (s) => page.textContent(R + s);
  const big = () => txt('.sv-big');
  const wait = () => page.waitForTimeout(600);
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(1000);
  check((await big()) === 'Efficiency 16.22 %, FF 68.95 %, Voc 0.6283 V, Jsc 37.43 mA/cm²', `solar: example headline (${await big()})`);
  { const f = await txt('.sv-facts'); check(f.includes('149.73 mA') && f.includes('64.861 mW') && f.includes('Vmp = 0.4700 V') && f.includes('0.7233 Ω') && f.includes('284.6 Ω') && f.includes('400 mW'), 'solar: example facts'); }
  { const t = await txt('.sv-tab'); check(t.includes('1.29956 ± 0.00075') && t.includes('(9.93 ± 0.11) × 10⁻¹⁰ A') && t.includes('0.50021 ± 0.00020 Ω') && t.includes('300.0 ± 1.6 Ω') && t.includes('14.53 µA'), 'solar: diode fit table'); }
  check(await page.isVisible(R + '.sv-fig1') && await page.isVisible(R + '.sv-fig2'), 'solar: I-V and power plots');
  // Options.
  await page.fill(R + '.sv-irr', '500'); await wait();
  check((await big()).startsWith('Efficiency 32.43 %'), `solar: irradiance changes the efficiency (${await big()})`);
  await page.fill(R + '.sv-irr', '1000'); await page.fill(R + '.sv-area', ''); await wait();
  check((await big()) === 'FF 68.95 %, Voc 0.6283 V, Isc 149.73 mA' && (await txt('.sv-facts')).includes('give the cell area'), 'solar: no area, no efficiency');
  await page.fill(R + '.sv-area', '4'); await page.fill(R + '.sv-tc', '50'); await wait();
  check(!(await txt('.sv-tab')).includes('1.29956') && (await txt('.sv-fnote')).includes('at 50 °C'), 'solar: temperature changes the thermal voltage and the fit');
  await page.fill(R + '.sv-tc', '25'); await page.fill(R + '.sv-k', '10'); await wait();
  check(!(await txt('.sv-facts')).includes('284.6 Ω'), 'solar: points for the slopes');
  await page.fill(R + '.sv-k', '5'); await page.uncheck(R + '.sv-fit'); await wait();
  check(await page.isHidden(R + '.sv-tab') && (await big()).startsWith('Efficiency 16.22 %'), 'solar: fit off');
  await page.check(R + '.sv-fit'); await wait();
  // CSV.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.sv-csv')]); const f = OUT + 'iv.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 73 && rows[0] === 'voltage_V,current_A,current_density_mA_cm2,power_W,model_current_A,residual_A', 'solar: CSV of points and model'); }
  // Opposite sign convention in A, as a file; and a 6-cell module.
  const lines = ['V,I']; const ex = (await page.inputValue(R + '.sv-data')).split('\n').slice(1).map((l) => l.split('\t').map(Number));
  for (const [v, i] of ex) lines.push(`${v},${(-i / 1000).toFixed(7)}`);
  writeFileSync(OUT + 'iv.csv', lines.join('\n') + '\n');
  await page.selectOption(R + '.sv-unit', 'a');
  await page.locator(R + '.dfb-in').first().setInputFiles(OUT + 'iv.csv'); await page.waitForTimeout(1200);
  check((await big()) === 'Efficiency 16.22 %, FF 68.95 %, Voc 0.6283 V, Jsc 37.43 mA/cm²' && (await txt('.sv-note')).includes('sign was flipped'), `solar: negative current in A from a file (${await big()})`);
  await page.fill(R + '.sv-ns', '6'); await wait();
  check((await txt('.sv-tab')).includes('per cell') && (await txt('.sv-fnote')).includes('n·6·kT/q'), 'solar: cells in series');
  await page.fill(R + '.sv-ns', '1');
  // Current density input.
  const jl = ex.map(([v, i]) => `${v}\t${(i / 4).toFixed(5)}`).join('\n');
  await page.selectOption(R + '.sv-unit', 'j'); await page.fill(R + '.sv-data', jl); await wait();
  check((await big()).startsWith('Efficiency 16.22 %') && (await big()).includes('Jsc 37.43'), `solar: current density input (${await big()})`);
  await page.fill(R + '.sv-area', ''); await wait();
  check((await txt('.sv-err')).includes('area'), 'solar: density needs the area');
  await page.fill(R + '.sv-area', '4'); await page.selectOption(R + '.sv-unit', 'ma');
  // Bad input.
  await page.fill(R + '.sv-data', '0 1\n0.1 0.5'); await wait();
  check((await txt('.sv-err')).includes('at least 8 points'), 'solar: too few points');
  await page.fill(R + '.sv-data', Array.from({ length: 10 }, (_, i) => `${0.1 + i * 0.01} ${150 - i}`).join('\n')); await wait();
  check((await txt('.sv-err')).includes('does not cross 0 V'), 'solar: no 0 V crossing');
  await page.fill(R + '.sv-data', Array.from({ length: 10 }, (_, i) => `${i * 0.01} ${150 - i}`).join('\n')); await wait();
  check((await txt('.sv-err')).includes('past the open-circuit voltage'), 'solar: no Voc crossing');
  await page.fill(R + '.sv-data', Array.from({ length: 10 }, (_, i) => `${i * 0.01} ${150 - i}`).join('\n') + '\n0.05 1'); await wait();
  check((await txt('.sv-err')).includes('same voltage'), 'solar: repeated voltage');
  await page.click(R + '.sv-ex'); await wait();
  await page.fill(R + '.sv-irr', '0'); await wait();
  check((await txt('.sv-err')).includes('irradiance'), 'solar: bad irradiance');
  await page.fill(R + '.sv-irr', '1000'); await page.fill(R + '.sv-ns', '0'); await wait();
  check((await txt('.sv-err')).includes('Cells in series'), 'solar: bad cell count');
  await page.fill(R + '.sv-ns', '1'); await wait();
  check((await big()).startsWith('Efficiency 16.22 %'), 'solar: example restored');
};
