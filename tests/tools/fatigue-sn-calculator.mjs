// #847 fatigue S-N calculator
export const path = '/science/fatigue-sn-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.fsn ', t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/science/fatigue-sn-calculator/`); await page.waitForTimeout(500);
  check((await t('.fsn-big')) === 'σa = 832.9 · N^−0.0837', 'fatigue: example Basquin fit (matches SciPy)');
  { const f = await t('.fsn-facts'); check(f.includes('2 run-outs left out') && f.includes('882.7') && f.includes('216.2') && f.includes('r² 0.9766') && f.includes('0.198'), 'fatigue: fit facts'); }
  { const m = await t('.fsn-mtab'); check(m.includes('Goodman180∞1.16') && m.includes('Gerber154.3∞1.37') && m.includes('Soderberg192.9∞1.09') && m.includes('Morrow169.2∞1.24') && (await t('.fsn-yld')).includes('safety factor 1.80'), 'fatigue: mean stress table (matches SciPy brentq)'); }
  check((await t('.fsn-dbig')) === 'Damage D = 0.925: the spectrum can be repeated 1.08 times', 'fatigue: Miner damage');
  check(await page.isVisible(R + '.fsn-fig') && await page.isVisible(R + '.fsn-hfig'), 'fatigue: S-N plot and Haigh diagram drawn');
  // Fit direction.
  await page.selectOption(R + '.fsn-mode', 'logS'); await page.waitForTimeout(150);
  check((await t('.fsn-big')) === 'σa = 815.5 · N^−0.0817', 'fatigue: log S on log N fit');
  await page.selectOption(R + '.fsn-mode', 'logN');
  // Bigger load: Goodman fails, life finite.
  await page.fill(R + '.fsn-sa', '250'); await page.fill(R + '.fsn-sm', '150'); await page.waitForTimeout(150);
  check((await t('.fsn-mbig')).includes('fatigue failure expected') && !(await t('.fsn-mtab')).includes('Goodman333.3∞'), 'fatigue: overload gives a safety factor below 1');
  await page.fill(R + '.fsn-sm', '-100'); await page.waitForTimeout(150);
  check((await t('.fsn-yld')).includes('compressive mean stress') && (await t('.fsn-mtab')).includes('Gerber257.1'), 'fatigue: compressive mean stress');
  await page.fill(R + '.fsn-sa', '150'); await page.fill(R + '.fsn-sm', '100'); await page.fill(R + '.fsn-se', '150'); await page.waitForTimeout(150);
  check((await t('.fsn-mbig')).includes('factor 0.86'), 'fatigue: typed endurance limit');
  await page.fill(R + '.fsn-se', ''); await page.fill(R + '.fsn-sf', '700'); await page.waitForTimeout(150);
  check((await t('.fsn-mtab')).includes('Morrow175'), 'fatigue: typed Morrow σf\'');
  await page.fill(R + '.fsn-sf', '');
  // Miner options.
  await page.selectOption(R + '.fsn-cut', '0'); await page.waitForTimeout(150);
  check(!(await t('.fsn-dtab')).includes('∞') && !(await t('.fsn-dbig')).includes('0.925'), 'fatigue: extend the line below the endurance limit');
  await page.selectOption(R + '.fsn-cut', '1'); await page.selectOption(R + '.fsn-mm', 'none'); await page.waitForTimeout(150);
  check((await t('.fsn-dtab')).includes('25050200,000250'), 'fatigue: no mean stress correction');
  await page.selectOption(R + '.fsn-mm', 'goodman'); await page.waitForTimeout(150);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.locator(R + '.fsn-csv').scrollIntoViewIfNeeded().then(() => page.click(R + '.fsn-csv'))]); const f = OUT + 'miner.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 5 && rows[0].startsWith('stress_amplitude,mean_stress,cycles') && rows[4].endsWith(',inf,0'), 'fatigue: damage CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=docx]')]); check((await d.suggestedFilename()) === 'fatigue-sn.docx', 'fatigue: Word report'); }
  // Bad input.
  await page.fill(R + '.fsn-spec', '100\t0\t-5'); await page.waitForTimeout(150);
  check((await t('.fsn-derr')).includes('Block 1') && await page.isHidden(R + '.fsn-dout'), 'fatigue: bad block message');
  await page.fill(R + '.fsn-sy', '700'); await page.waitForTimeout(150);
  check((await t('.fsn-err')).includes('yield strength no higher') && (await t('.fsn-merr')).includes('Fit the S-N data first'), 'fatigue: yield above tensile message');
  await page.fill(R + '.fsn-sy', '450');
  await page.fill(R + '.fsn-data', '400\t1000\n300\tabc\n200\t1e6'); await page.waitForTimeout(150);
  check((await t('.fsn-err')).includes('Line 2'), 'fatigue: bad S-N line');
  // Open a file: exact power law σa = 1000 N^−0.1, no scatter.
  writeFileSync(OUT + 'sn.csv', 'S,N\n' + [1e3, 1e4, 1e5, 1e6].map((n) => `${1000 * n ** -0.1},${n}`).join('\n'));
  await page.locator(R + '.dfb-in').first().setInputFiles(OUT + 'sn.csv'); await page.waitForTimeout(400);
  check((await t('.fsn-big')) === 'σa = 1000 · N^−0.1000' && (await t('.fsn-facts')).includes('r² 1.0000'), `fatigue: opened CSV with an exact power law (${await t('.fsn-big')})`);
};
