// #845 Electron diffraction indexer
export const path = '/science/electron-diffraction-indexer/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.edi ';
  const txt = (s) => page.textContent(R + s);
  const set = async (s, v) => { await page.fill(R + s, v); await page.waitForTimeout(350); };
  const pick = async (s, v) => { await page.selectOption(R + s, v); await page.waitForTimeout(150); };
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(700);
  check((await txt('.ed-big')) === 'Body-centred cubic, a = 2.872 Å', 'ediff: example headline');
  { const f = await txt('.ed-mfacts'); check(f.includes('2.5079 pm') && f.includes('0.6953 c') && f.includes('25.079 Å·mm') && f.includes('0.050 % from the nominal') && f.includes('25.092 Å·mmcalibrated'), 'ediff: wavelength, nominal and calibrated camera constant'); }
  check((await txt('.ed-cbig')) === 'λL = 25.092 ± 0.081 Å·mm' && (await txt('.ed-ctab')).includes('331'), 'ediff: calibration table');
  { const t = await txt('.ed-tab'); check(t.includes('2.0383') && t.includes('110') && t.includes('8.079') && t.includes('400'), 'ediff: ring table'); }
  check((await txt('.ed-ltab')).includes('FCC4.044') && (await txt('.ed-ltab')).includes('111, 311, 331'), 'ediff: FCC listed with missing rings');
  check((await txt('.ed-snote')).includes('Best zone axis: [001]') && (await txt('.ed-stab')).includes('110'), `ediff: spot pattern zone axis (${await txt('.ed-snote')})`);
  check(await page.isVisible(R + '.ed-fig'), 'ediff: ring ratio figure');
  // Nominal camera constant instead.
  await pick('.ed-src', 'nom');
  check((await txt('.ed-mfacts')).includes('25.079 Å·mmnominal') && (await txt('.ed-big')).startsWith('Body-centred cubic, a = 2.87'), 'ediff: nominal camera constant');
  await page.check(R + '.ed-exact'); await page.waitForTimeout(200);
  check((await txt('.ed-big')).startsWith('Body-centred cubic, a = 2.87'), 'ediff: exact geometry');
  await pick('.ed-src', 'cal');
  check((await txt('.ed-merr')).includes('Exact geometry uses the camera length'), 'ediff: exact geometry needs the nominal camera constant');
  await page.uncheck(R + '.ed-exact'); await page.waitForTimeout(200);
  // Voltage changes λ.
  await set('.ed-kv', '300');
  check((await txt('.ed-mfacts')).includes('1.9687 pm'), 'ediff: 300 kV wavelength');
  await set('.ed-kv', '200');
  // Diameters halve.
  await pick('.ed-rd', 'd');
  check((await txt('.ed-cbig')).startsWith('λL = 12.546') && (await txt('.ed-big')) === 'Body-centred cubic, a = 2.872 Å', `ediff: diameters are halved (${await txt('.ed-cbig')})`);
  await pick('.ed-rd', 'r');
  // 1/nm input: d = 1/R.
  await pick('.ed-unit', 'inv');
  await set('.ed-smp', ['2.0383', '1.4314', '1.1747', '1.0114', '0.9108', '0.8273'].map((d) => (10 / Number(d)).toFixed(4)).join('\n'));
  check(await page.isHidden(R + '.ed-calcard') && (await txt('.ed-big')).startsWith('Body-centred cubic, a = 2.87') && (await txt('.ed-ltab')).includes('SC'), `ediff: distances in 1/nm (${await txt('.ed-big')})`);
  // Pixels with no pixel size and no standard: ratios only.
  await pick('.ed-unit', 'px'); await pick('.ed-src', 'nom');
  check(await page.isVisible(R + '.ed-pxl') && (await txt('.ed-big')) === 'Body-centred cubic (no camera constant, so no a)', `ediff: pixels without a camera constant index by ratios (${await txt('.ed-big')})`);
  await set('.ed-px', '14');
  check((await txt('.ed-mfacts')).includes('Å·px') && (await txt('.ed-mfacts')).includes('14 µm pixels'), 'ediff: pixel size gives a nominal constant');
  // Bad input.
  await page.click(R + '.ed-ex'); await page.waitForTimeout(500);
  await set('.ed-smp', '12.31\n-3');
  check((await txt('.ed-err')).includes('distances are positive') && await page.isHidden(R + '.ed-out'), 'ediff: negative distance message');
  await set('.ed-smp', '12.31\n17.53'); await set('.ed-tol', '50');
  check((await txt('.ed-err')).includes('tolerance'), 'ediff: bad tolerance message');
  await set('.ed-tol', '2'); await set('.ed-kv', '0');
  check((await txt('.ed-merr')).includes('voltage'), 'ediff: bad voltage message');
  await set('.ed-kv', '200'); await pick('.ed-slat', 'bcc');
  check((await txt('.ed-cerr')).includes('do not fit') && await page.isHidden(R + '.ed-out'), 'ediff: wrong standard lattice is caught');
  await pick('.ed-slat', 'fcc'); await set('.ed-std', '10.69\n12.26\n15.00\n17.42\n20.31');
  check((await txt('.ed-cerr')).includes('One ring does not fit') && (await txt('.ed-cbig')).startsWith('λL = 25.0'), 'ediff: one stray standard ring is left out with a note');
  await set('.ed-std', '10.69\n12.26\n17.42'); await set('.ed-L', '800');
  check((await txt('.ed-cerr')).includes('% from the nominal one'), 'ediff: calibration far from nominal is flagged');
  await set('.ed-L', '1000'); await set('.ed-sa', '');
  check((await txt('.ed-cerr')).includes('lattice parameter'), 'ediff: missing standard a');
  // Spot pattern options.
  await page.click(R + '.ed-ex'); await page.waitForTimeout(500);
  await set('.ed-phi', '13');
  check((await txt('.ed-snote')).includes('do not fit'), 'ediff: impossible spot angle');
  await set('.ed-phi', '45'); await pick('.ed-plat', 'fcc'); await set('.ed-pa', '4.06');
  check((await txt('.ed-snote')).includes('on face-centred cubic, a = 4.060 Å. Best zone axis: [010]'), 'ediff: chosen lattice and a for spots (200 and 220 of FCC)');
  await pick('.ed-plat', 'auto'); await set('.ed-pa', '');
  // Rings opened from a file.
  writeFileSync(OUT + 'rings.csv', 'radius_mm,intensity\n12.31,100\n17.53,20\n21.36,40\n24.81,10\n27.55,15\n30.33,5\n32.60,12\n34.99,3\n');
  await page.fill(R + '.ed-smp', ''); await page.locator(R + '.dfb-in').nth(1).setInputFiles(OUT + 'rings.csv'); await page.waitForTimeout(700);
  check((await txt('.ed-big')) === 'Body-centred cubic, a = 2.872 Å', 'ediff: rings opened from a CSV file');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ed-csv')]); const f = OUT + 'ed.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 9 && rows[0] === 'radius_mm,d_angstrom,hkl,N,a_angstrom' && rows[1].startsWith('12.31,2.03') && rows[1].includes(',110,2,'), 'ediff: rings CSV'); }
};
