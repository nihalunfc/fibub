// #939 decibel distance
export const path = '/science/decibel-distance/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.dbd ';
  const t = (s) => page.textContent(R + s);
  const set = async (sel, v) => { await page.fill(R + sel, v); await page.waitForTimeout(300); };
  await page.goto(`${BASE}/science/decibel-distance/`); await page.waitForTimeout(600);
  check((await t('.dd-big')) === '49.5 dB at 100 m', 'dB distance: 90 dB at 1 m → 49.5 dB at 100 m (NumPy 49.54)');
  { const f = await t('.dd-facts'); check(f.includes('−40.0 dB') && f.includes('−0.46 dB') && f.includes('4.66 dB per km') && f.includes('49.5 dB(A)') && f.includes('0.3432 m'), 'dB distance: spreading, air absorption, A-weighted, wavelength'); }
  { const f = await t('.dd-facts'); check(f.includes('Distance to reach 45 dB163 m') && f.includes('177.8 m without air'), 'dB distance: 45 dB reached at 163 m (SciPy 163.01), 177.8 m without air'); }
  check((await t('.dd-sum')).includes('87.4 dB') && (await t('.dd-sum')).includes('82.7 dB') && (await t('.dd-sum')).includes('plain average 82.0 dB') && (await t('.dd-sum')).includes('correction −0.08 dB'), 'dB adder: 87.4 total, 82.7 energy mean, background correction');
  check(await page.isVisible(R + '.dd-fig') && await page.isHidden(R + '.dd-oct') && await page.isHidden(R + '.dd-tw'), 'dB distance: chart, octave inputs hidden');
  // Line and plane sources.
  await page.selectOption(R + '.dd-kind', 'line'); await page.waitForTimeout(300);
  check((await t('.dd-big')) === '69.5 dB at 100 m' && (await t('.dd-facts')).includes('−20.0 dB'), 'dB distance: line source −3 dB per doubling');
  await page.selectOption(R + '.dd-kind', 'plane'); await page.uncheck(R + '.dd-air'); await page.waitForTimeout(300);
  check((await t('.dd-big')) === '90.0 dB at 100 m' && (await t('.dd-facts')).includes('does not fall off'), 'dB distance: plane source, no air: no fall, target not reached');
  await page.check(R + '.dd-air'); await page.selectOption(R + '.dd-kind', 'line'); await set('.dd-L1', '70'); await set('.dd-f', '2000'); await set('.dd-r1', '5'); await set('.dd-r2', '300'); await set('.dd-t', '10'); await set('.dd-rh', '80'); await set('.dd-p', '95');
  check((await t('.dd-big')) === '49.6 dB at 300 m', 'dB distance: line source 2 kHz 10 °C 80 % 95 kPa (NumPy 49.64)');
  await set('.dd-x', '5');
  check((await t('.dd-big')) === '44.6 dB at 300 m' && (await t('.dd-facts')).includes('Other losses'), 'dB distance: other losses');
  await set('.dd-x', '0'); await set('.dd-target', '');
  check(!(await t('.dd-facts')).includes('Distance to reach'), 'dB distance: empty target skipped');
  // Octave bands.
  await page.selectOption(R + '.dd-kind', 'point'); await set('.dd-r1', '10'); await set('.dd-r2', '500'); await set('.dd-t', '15'); await set('.dd-rh', '70'); await set('.dd-p', '101.325');
  await page.selectOption(R + '.dd-mode', 'oct'); await page.waitForTimeout(300);
  check((await t('.dd-big')) === '54.6 dB(A) at 500 m' && (await t('.dd-facts')).includes('91.3 dB(A)') && await page.isHidden(R + '.dd-L1'), 'dB distance: octave spectrum 91.3 → 54.6 dB(A) (NumPy)');
  { const tb = await t('.dd-tab'); check(tb.includes('−6.5') && tb.includes('46.0') && (await page.$$eval(R + '.dd-tab tbody tr', (r) => r.length)) === 8, 'dB distance: band table (8 kHz −6.5 dB)'); }
  await set('.dd-B7', '');
  check((await page.$$eval(R + '.dd-tab tbody tr', (r) => r.length)) === 7, 'dB distance: empty band left out');
  await set('.dd-target', '50');
  check(/Distance to reach 50 dB\(A\)[\d.]+ m/.test(await t('.dd-facts')), 'dB distance: target in dB(A)');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dd-csv')]); const f = OUT + 'dbd.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 122 && rows[0] === 'distance_m,level_dba,level_without_air_dba' && rows[1].startsWith('10,'), 'dB distance: curve CSV'); }
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl button[data-f=${fmt}]`)]); check(d.suggestedFilename() === `decibel-distance.${fmt}`, `dB distance: ${fmt} download`); }
  // Bad input.
  await set('.dd-B0', 'loud');
  check((await t('.dd-err')).includes('63 Hz band') && await page.isHidden(R + '.dd-out'), 'dB distance: bad band message');
  await set('.dd-B0', '80'); await page.selectOption(R + '.dd-mode', 'one'); await page.waitForTimeout(300); await set('.dd-f', '5');
  check((await t('.dd-err')).includes('frequency from 10 Hz'), 'dB distance: bad frequency message');
  await set('.dd-f', '1000'); await set('.dd-r2', '-3');
  check((await t('.dd-err')).includes('distance r₂'), 'dB distance: bad distance message');
  await set('.dd-r2', '100'); await set('.dd-rh', '150');
  check((await t('.dd-err')).includes('relative humidity'), 'dB distance: bad humidity message');
  await set('.dd-rh', '70'); await set('.dd-list', '85, abc');
  check((await t('.dd-serr')).includes('Every level'), 'dB adder: bad level message');
  await set('.dd-list', '60, 60'); await set('.dd-bg', '64');
  check((await t('.dd-sum')).includes('63.0 dB') && (await t('.dd-sum')).includes('cannot tell'), 'dB adder: 60 + 60 = 63.0 dB, background above total');
};
