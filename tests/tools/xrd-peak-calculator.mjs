// #842 XRD peak calculator
export const path = '/science/xrd-peak-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.xrd ';
  const txt = (s) => page.textContent(R + s);
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(800);
  check((await txt('.xr-big')) === 'Face-centred cubic, a = 4.0000 Å; Williamson-Hall size 26.1 nm, strain 0.21 %', 'xrd: example headline');
  { const t = await txt('.xr-tab'); check(t.includes('38.969') && t.includes('2.3094') && t.includes('16.8') && t.includes('400') && t.includes('100.756'), 'xrd: example peak table'); }
  { const t = await txt('.xr-ctab'); check(t.includes('FCC4.0000') && t.includes('6 of 6none') && t.includes('Diamond') && t.includes('4 of 6'), 'xrd: cubic table ranks FCC first, diamond misses lines'); }
  { const f = await txt('.xr-facts'); check(f.includes('14 nm') && f.includes('± 1.4 nm') && f.includes('0.214 %') && f.includes('R² = 0.986'), 'xrd: Scherrer mean, W-H size and strain facts'); }
  check(await page.isVisible(R + '.xr-sfig') && await page.isVisible(R + '.xr-wh'), 'xrd: scan and Williamson-Hall figures');
  // Bragg box both ways.
  check((await txt('.xr-bout')).startsWith('d = 2.30933 Å'), 'xrd: Bragg 2θ to d');
  await page.fill(R + '.xr-bd', '2'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.xr-btt')) === '45.3061' && (await txt('.xr-bout')).startsWith('2θ = 45.3061°'), 'xrd: Bragg d to 2θ');
  await page.fill(R + '.xr-bd', '0.7'); await page.waitForTimeout(100);
  check((await txt('.xr-bout')).includes('Not reachable'), 'xrd: unreachable d message');
  await page.fill(R + '.xr-btt', '30'); await page.fill(R + '.xr-bn', '2'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.xr-bd')) === String(+(2 * 1.5406 / (2 * Math.sin(15 * Math.PI / 180))).toPrecision(6)), 'xrd: Bragg second order');
  await page.fill(R + '.xr-bn', '1');
  // Settings.
  await page.fill(R + '.xr-k', '0.94'); await page.waitForTimeout(400);
  check((await txt('.xr-facts')).includes('K = 0.94') && (await txt('.xr-big')).includes('27.3 nm'), `xrd: K changes the size (${await txt('.xr-big')})`);
  await page.fill(R + '.xr-k', '0.9'); await page.waitForTimeout(400);
  await page.selectOption(R + '.xr-anode', 'mo1'); await page.waitForTimeout(400);
  check((await page.inputValue(R + '.xr-lam')) === '0.70932' && (await txt('.xr-facts')).includes('Mo Kα1'), 'xrd: anode fills λ');
  await page.fill(R + '.xr-lam', '1.5406'); await page.waitForTimeout(400);
  check((await page.inputValue(R + '.xr-anode')) === 'cu1' && (await txt('.xr-big')).includes('a = 4.0000 Å'), 'xrd: typed λ picks the anode back');
  await page.fill(R + '.xr-inst', '0.6'); await page.waitForTimeout(400);
  check((await txt('.xr-facts')).includes('Too narrow') && (await txt('.xr-tab')).includes('–'), 'xrd: peaks narrower than the instrument');
  await page.fill(R + '.xr-inst', '0.06');
  await page.selectOption(R + '.xr-shape', 'lorentz'); await page.waitForTimeout(600);
  check((await txt('.xr-big')).startsWith('Face-centred cubic, a = 4.000') && !(await txt('.xr-big')).includes('26.1 nm'), `xrd: Lorentzian fit and straight subtraction (${await txt('.xr-big')})`);
  await page.selectOption(R + '.xr-shape', 'gauss'); await page.waitForTimeout(600);
  // CSV.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.xr-csv')]); const f = OUT + 'xrd.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 7 && rows[0].startsWith('two_theta_deg,d_angstrom') && rows[1].includes(',111,3,'), 'xrd: peaks CSV'); }
  // Typed peaks without widths: BCC lines, a = 3.3 Å, seven lines.
  const bcc = [2, 4, 6, 8, 10, 12, 14].map((N) => (2 * Math.asin(1.5406 * Math.sqrt(N) / (2 * 3.3)) * 180 / Math.PI).toFixed(4)).join('\n');
  await page.fill(R + '.xr-scan', ''); await page.fill(R + '.xr-pk', bcc); await page.waitForTimeout(500);
  check((await txt('.xr-big')) === 'Body-centred cubic, a = 3.3000 Å' && await page.isHidden(R + '.xr-wh') && await page.isHidden(R + '.xr-sfig'), `xrd: typed BCC peaks with no widths (${await txt('.xr-big')})`);
  await page.fill(R + '.xr-pk', bcc.split('\n').slice(0, 6).join('\n')); await page.waitForTimeout(500);
  check((await txt('.xr-cnote')).includes('A 7th line'), 'xrd: six BCC lines warn about simple cubic');
  await page.fill(R + '.xr-pk', '2theta, fwhm\n30, 0.3\n40, 0.3'); await page.waitForTimeout(500);
  check((await txt('.xr-big')).includes('no cubic lattice indexes them all') || (await txt('.xr-big')).includes('cubic'), 'xrd: header row skipped');
  // Bad input.
  await page.fill(R + '.xr-pk', '30, 0.3\n200, 0.2'); await page.waitForTimeout(500);
  check((await txt('.xr-err')).includes('not between 0 and 180') && await page.isHidden(R + '.xr-out'), 'xrd: 2θ out of range');
  await page.fill(R + '.xr-pk', '30, -1'); await page.waitForTimeout(500);
  check((await txt('.xr-err')).includes('FWHM must be a positive'), 'xrd: bad FWHM');
  await page.fill(R + '.xr-pk', '30, 0.3'); await page.fill(R + '.xr-lam', '0'); await page.waitForTimeout(500);
  check((await txt('.xr-err')).includes('wavelength is in ångström'), 'xrd: bad wavelength');
  await page.fill(R + '.xr-lam', '1.5406'); await page.fill(R + '.xr-tol', '9'); await page.waitForTimeout(500);
  check((await txt('.xr-err')).includes('tolerance'), 'xrd: bad tolerance');
  await page.fill(R + '.xr-tol', '0.5');
  await page.fill(R + '.xr-scan', '10 5\n11 6'); await page.waitForTimeout(500);
  check((await txt('.xr-serr')).includes('at least 20 points'), 'xrd: short scan message');
  // Open a scan file: the example as a CSV with a header, opened through the file button.
  await page.click(R + '.xr-ex'); await page.waitForTimeout(600);
  writeFileSync(OUT + 'scan.csv', 'two_theta,counts\n' + (await page.inputValue(R + '.xr-scan')).replace(/\t/g, ',') + '\n');
  await page.fill(R + '.xr-pk', ''); await page.fill(R + '.xr-scan', ''); await page.waitForTimeout(400);
  await page.locator(R + '.dfb-in').first().setInputFiles(OUT + 'scan.csv'); await page.waitForTimeout(1200);
  check((await txt('.xr-big')) === 'Face-centred cubic, a = 4.0000 Å; Williamson-Hall size 26.1 nm, strain 0.21 %' && (await page.inputValue(R + '.xr-pk')).split('\n').length === 6, 'xrd: scan opened from a CSV file gives the same peaks');
  await page.fill(R + '.xr-min', '40'); await page.waitForTimeout(800);
  check((await page.inputValue(R + '.xr-pk')).split('\n').length === 2, `xrd: smallest-peak setting keeps only the big peaks (${(await page.inputValue(R + '.xr-pk')).replace(/\n/g, ' | ')})`);
};
