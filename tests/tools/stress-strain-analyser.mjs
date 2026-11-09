// #846 stress-strain analyser
export const path = '/science/stress-strain-analyser/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.ssa ';
  await page.goto(`${BASE}/science/stress-strain-analyser/`); await page.waitForTimeout(500);
  const big = () => page.textContent(R + '.ssa-big'), facts = () => page.textContent(R + '.ssa-facts');
  check((await big()) === 'E 199.7 GPa · yield 304.7 MPa · UTS 437.0 MPa', `stress-strain: example headline (${await big()})`);
  { const t = await facts(); check(t.includes('199.75 GPa') && t.includes('13 points from 50.2 to 170.2 MPa') && t.includes('16.26 % plastic') && t.includes('25.68 % plastic') && t.includes('105.7 MJ/m³') && t.includes('0.232 MJ/m³') && t.includes('509.1 MPa') && t.includes('0.157') && t.includes('25 mm² area, 50 mm gauge length'), 'stress-strain: example facts match the NumPy check'); }
  check(await page.isVisible(R + '.ssa-fig') && await page.isVisible(R + '.ssa-zfig'), 'stress-strain: both plots drawn');
  // CSV of the curves.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ssa-csv')]); const f = OUT + 'ssa.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'engineering_strain,engineering_stress_MPa,true_strain,true_stress_MPa' && rows.length === 156 && rows[rows.length - 1].endsWith(',,'), `stress-strain: curves CSV (${rows.length} rows)`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); check((await d.suggestedFilename()) === 'stress-strain.pdf', 'stress-strain: PDF report'); }
  // Offset and fit range.
  await page.fill(R + '.ssa-off', '0.1'); await page.waitForTimeout(150);
  check((await facts()).includes('0.1 % offset yield strength') && !(await big()).includes('304.7'), 'stress-strain: 0.1 % offset changes the yield');
  await page.fill(R + '.ssa-off', '0.2'); await page.fill(R + '.ssa-hi', '90'); await page.waitForTimeout(150);
  check((await facts()).includes('not straight, so narrow the range') && !(await facts()).includes('199.75 GPa'), 'stress-strain: a fit range into the plastic part lowers the modulus');
  await page.fill(R + '.ssa-hi', '40');
  // Round specimen: area π·d²/4 = 25 mm² when d = 5.6419 mm gives the same answer.
  await page.selectOption(R + '.ssa-shape', 'round'); await page.fill(R + '.ssa-a', '5.641896'); await page.waitForTimeout(150);
  check(await page.isHidden(R + '.ssa-t') && (await big()) === 'E 199.7 GPa · yield 304.7 MPa · UTS 437.0 MPa', 'stress-strain: round specimen of the same area');
  await page.selectOption(R + '.ssa-shape', 'area'); await page.fill(R + '.ssa-a', '50'); await page.waitForTimeout(150);
  check((await big()).includes('UTS 218.5 MPa'), 'stress-strain: area typed directly (double area halves stress)');
  await page.fill(R + '.ssa-a', '0'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.ssa-err')).includes('specimen size') && await page.isHidden(R + '.ssa-out'), 'stress-strain: zero area message');
  await page.fill(R + '.ssa-a', '25');
  // Units: force in N (×1000 smaller), so stress drops 1000 times.
  await page.selectOption(R + '.ssa-fu', 'N'); await page.waitForTimeout(150);
  check((await big()).includes('UTS 0.4 MPa'), 'stress-strain: force unit N');
  await page.selectOption(R + '.ssa-fu', 'kN');
  // Stress-strain mode with strain in %.
  const ss = 'stress_MPa\tstrain_pct\n' + [[0, 0], [35, 0.05], [70, 0.1], [105, 0.15], [140, 0.2], [210, 0.3], [250, 0.4], [270, 0.6], [290, 1], [300, 2], [295, 3]].map((r) => r.join('\t')).join('\n');
  await page.selectOption(R + '.ssa-mode', 'ss'); await page.selectOption(R + '.ssa-eu', '100'); await page.fill(R + '.ssa-data', ss); await page.waitForTimeout(150);
  check(await page.isHidden(R + '.ssa-shape') && (await big()).startsWith('E 70.0 GPa') && (await big()).endsWith('UTS 300.0 MPa'), `stress-strain: stress and strain (%) mode (${await big()})`);
  await page.selectOption(R + '.ssa-su', 'ksi'); await page.waitForTimeout(150);
  check((await big()).startsWith('E 482.6 GPa'), 'stress-strain: ksi converted to MPa');
  // Bad input.
  await page.fill(R + '.ssa-data', '1\t2\n3\t4'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.ssa-err')).includes('at least five lines'), 'stress-strain: too few lines message');
  await page.fill(R + '.ssa-data', '0\t0\n1\t1\nx\t2\n3\t3\n4\t4\n5\t5'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.ssa-err')).includes('Line 3'), 'stress-strain: bad line message');
  await page.selectOption(R + '.ssa-eu', '1'); await page.fill(R + '.ssa-data', ss.replace('\t3', '\t30')); await page.waitForTimeout(150);
  check((await page.textContent(R + '.ssa-err')).includes('in % rather than mm/mm'), 'stress-strain: strain unit warning');
  // Open a file.
  writeFileSync(OUT + 'ssa.csv', 'stress,strain\n' + [[0, 0], [50, 0.00025], [100, 0.0005], [150, 0.00075], [200, 0.001], [300, 0.0015], [400, 0.002], [450, 0.004], [480, 0.01], [470, 0.02]].map((r) => r.join(',')).join('\n'));
  await page.setInputFiles(R + '.dfb-in', OUT + 'ssa.csv'); await page.waitForTimeout(300);
  await page.selectOption(R + '.ssa-su', 'MPa'); await page.waitForTimeout(150);
  check((await big()).startsWith('E 200.0 GPa') && (await big()).endsWith('UTS 480.0 MPa') && (await page.textContent(R + '.dfb-note')).includes('Opened ssa.csv'), `stress-strain: opened CSV (${await big()})`);
};
