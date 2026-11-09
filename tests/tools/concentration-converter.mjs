// #517 Concentration converter
export const path = '/science/concentration-converter/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.concconv ';
  const txt = (s) => page.textContent(R + s);
  const big = () => txt('.cc-big');
  const wait = () => page.waitForTimeout(450);
  const cell = (label) => page.evaluate(([r, l]) => [...document.querySelectorAll(r + '.cc-tab tbody tr')].find((tr) => tr.cells[0].textContent === l)?.cells[1].textContent, [R, label]);
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(800);
  check((await big()) === '0.5 mol/L (M, molarity) = 0.504653 mol/kg (molality)', `conc: example headline (${await big()})`);
  check((await txt('.cc-mnote')).includes('Solute NaCl: 58.44 g/mol') && (await txt('.cc-mnote')).includes('Solvent H2O: 18.015 g/mol'), 'conc: molar masses from formulas');
  check((await cell('g/L')) === '29.22' && (await cell('% w/w')) === '2.86471' && (await cell('ppm by mass')) === '28647.1' && (await cell('Mole fraction')) === '0.00900941' && (await cell('mmol/L (mM)')) === '500', 'conc: example table');
  check((await cell('% v/v')) === 'needs the pure solute’s density' && (await page.locator(R + '.cc-tab tr.dim').count()) === 1, 'conc: % v/v says what it needs');
  check((await page.locator(R + '.cc-tab tbody tr').count()) === 20 && (await page.locator(R + '.cc-tab tr.cc-in').count()) === 1, 'conc: 20 liquid units, the input row marked');
  { const ch = await page.$$eval(R + '.cc-chain li', (l) => l.map((x) => x.textContent)); check(ch.length === 2 && ch[0].includes('w = c·M / (1000·ρ) = 0.5 × 58.44 / (1000 × 1.02) = 0.0286471') && ch[1].includes('b = 1000·w / (M·(1 − w))'), 'conc: working shown'); }
  await page.selectOption(R + '.cc-to', 'ppb'); await wait();
  check((await big()) === '0.5 mol/L (M, molarity) = 2.86471 × 10⁷ ppb by mass' && (await txt('.cc-chain')).includes('× 1 × 10⁹'), `conc: pick another unit for the working (${await big()})`);
  // Optional values: % v/v appears when the solute density is typed; normality goes when z is cleared.
  await page.fill(R + '.cc-rhos', '2.16'); await wait();
  check((await cell('% v/v')) === '1.35278' && (await page.inputValue(R + '.cc-ex')) === 'own', 'conc: solute density gives % v/v');
  await page.fill(R + '.cc-z', ''); await wait();
  check((await cell('Normality (eq/L)')) === 'needs the equivalents per mole', 'conc: normality needs z');
  await page.fill(R + '.cc-rho', ''); await wait();
  check((await txt('.cc-err')) === 'To read mol/L the page needs the solution’s density.', 'conc: mol/L input without density is an error');
  await page.selectOption(R + '.cc-u', 'pww'); await page.fill(R + '.cc-v', '5'); await wait();
  check((await cell('g/L')) === 'needs the solution’s density' && (await cell('mol/kg (molality)')) === '0.900609', `conc: without density, mass units still convert (${await cell('mol/kg (molality)')})`);
  // Examples.
  await page.selectOption(R + '.cc-ex', 'etoh'); await wait();
  check((await big()) === '40 % v/v = 33.2211 % w/w' && (await cell('mol/L (M, molarity)')) === '6.85059' && (await cell('Mole fraction')) === '0.162855', `conc: ethanol example (${await big()})`);
  await page.selectOption(R + '.cc-ex', 'h2so4'); await wait();
  check((await big()) === '1 Normality (eq/L) = 4.62604 % w/w' && (await cell('mol/L (M, molarity)')) === '0.5' && (await cell('g/L')) === '49.036', `conc: sulfuric acid example (${await big()})`);
  await page.selectOption(R + '.cc-ex', 'co2'); await wait();
  check((await big()) === '400 ppmv (by volume) = 719.53 mg/m³' && (await page.isVisible(R + '.cc-t')) && !(await page.isVisible(R + '.cc-rho')), `conc: CO2 gas example (${await big()})`);
  check((await cell('µmol/L (µM)')) === '16.3496' && (await cell('ppm by mass')) === '607.634' && (await cell('% v/v')) === '0.04' && (await page.locator(R + '.cc-tab tbody tr').count()) === 21, 'conc: gas table');
  check((await txt('.cc-mnote')).includes('molar volume RT/P = 24.4654 L/mol'), 'conc: molar volume shown');
  await page.fill(R + '.cc-t', '0'); await wait();
  check((await txt('.cc-mnote')).includes('22.414 L/mol') && (await big()) === '400 ppmv (by volume) = 785.385 mg/m³', `conc: temperature changes mg/m³ (${await big()})`);
  await page.fill(R + '.cc-mg', ''); await wait();
  check((await cell('ppm by mass')) === 'needs the other gas’s molar mass', 'conc: mass units need the other gas');
  await page.fill(R + '.cc-mg', '28.0134'); await page.fill(R + '.cc-t', '-300'); await wait();
  check((await txt('.cc-perr')).includes('above −273.15 °C'), 'conc: impossible temperature');
  await page.fill(R + '.cc-t', '25'); await page.fill(R + '.cc-v', '2000000'); await wait();
  check((await txt('.cc-err')).includes('more than pure solute'), 'conc: over a million ppmv');
  // Back to liquid by the mixture switch; a typed molar mass number.
  await page.selectOption(R + '.cc-ex', 'nacl'); await wait();
  await page.fill(R + '.cc-m', '98.08'); await wait();
  check((await txt('.cc-mnote')).startsWith('Solvent H2O') && (await cell('g/L')) === '49.04', `conc: molar mass typed as a number (${await cell('g/L')})`);
  await page.fill(R + '.cc-m', 'Xq2'); await wait();
  check((await txt('.cc-perr')).startsWith('Solute:') && (await page.isHidden(R + '.cc-out')), 'conc: bad formula');
  await page.fill(R + '.cc-m', 'NaCl'); await page.fill(R + '.cc-v', 'abc'); await wait();
  check((await txt('.cc-err')).includes('Type a number'), 'conc: value not a number');
  await page.fill(R + '.cc-v', '-1'); await wait();
  check((await txt('.cc-err')).includes('0 or more'), 'conc: negative value');
  await page.selectOption(R + '.cc-u', 'gL'); await page.fill(R + '.cc-v', '1500'); await wait();
  check((await txt('.cc-err')).includes('more than pure solute'), 'conc: more solute than solution');
  await page.fill(R + '.cc-rho', '0'); await wait();
  check((await txt('.cc-perr')).includes('density is a positive number'), 'conc: zero density');
  await page.selectOption(R + '.cc-ex', 'nacl'); await wait();
  // CSV of the single conversion.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.cc-csv1')]); const f = OUT + 'conc1.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 21 && rows[0] === 'unit,value,working' && rows.some((r) => r.startsWith('mol/kg (molality),0.504652899736,')) && rows.some((r) => r.startsWith('% v/v,,needs')), 'conc: single CSV'); }
  // Batch.
  await page.selectOption(R + '.cc-bt', 'pww'); await wait();
  { const b = await page.$$eval(R + '.cc-btab tbody tr', (l) => l.map((tr) => [...tr.cells].map((c) => c.textContent))); check(b.length === 5 && b[3][1] === '2.86471' && b[0][0] === '0.01', `conc: batch column (${JSON.stringify(b[3])})`); }
  await page.fill(R + '.cc-batch', 'conc;rho\n0.5;1.02\n1;1.04\nx;1\n2;0'); await wait();
  { const b = await page.$$eval(R + '.cc-btab tbody tr', (l) => l.map((tr) => [...tr.cells].map((c) => c.textContent))); const h = await page.$$eval(R + '.cc-btab th', (l) => l.map((x) => x.textContent));
    check(h.join('|') === 'conc|rho|% w/w' && b[0][2] === '2.86471' && b[1][2] === (100 * 58.44 / 1040).toPrecision(6) && b[2][2] === 'not a number' && b[3][2] === 'density is not a positive number', `conc: batch with header and per-row density (${JSON.stringify(b)})`); }
  check((await txt('.cc-bnote')).includes('2 of 4 rows converted') && (await txt('.cc-bnote')).includes('own density'), 'conc: batch note');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.cc-csvb')]); const f = OUT + 'concb.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 5 && rows[0].startsWith('input,density_g_per_mL,"mol/L (M, molarity)",mmol/L (mM),') && rows[1].startsWith('0.5,1.02,0.5,500,') && rows[3].endsWith('not a number'), 'conc: batch CSV with every unit'); }
  // Batch from a file, values in mg/L to µmol/L.
  writeFileSync(OUT + 'conc.csv', 'mg_per_L\n58.44\n5.844\n');
  await page.selectOption(R + '.cc-bu', 'mgL'); await page.selectOption(R + '.cc-bt', 'umolL');
  await page.locator(R + '.dfb-in').setInputFiles(OUT + 'conc.csv'); await page.waitForTimeout(900);
  { const b = await page.$$eval(R + '.cc-btab tbody tr', (l) => l.map((tr) => [...tr.cells].map((c) => c.textContent))); check(b.length === 2 && b[0][1] === '1000' && b[1][1] === '100', `conc: batch from a file (${JSON.stringify(b)})`); }
  await page.fill(R + '.cc-batch', ''); await wait();
  check((await txt('.cc-berr')).includes('Paste or type'), 'conc: empty batch');
  // Report download offered.
  check(await page.isVisible(R + '.dl'), 'conc: report downloads offered');
  await page.selectOption(R + '.cc-ex', 'nacl'); await wait();
  check((await big()) === '0.5 mol/L (M, molarity) = 0.504653 mol/kg (molality)', 'conc: example restored');
};
