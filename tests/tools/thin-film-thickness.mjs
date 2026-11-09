// #865 Thin-film thickness from fringes
export const path = '/science/thin-film-thickness/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.tfilm ';
  const txt = (s) => page.textContent(R + s);
  const big = () => txt('.tf-big');
  const wait = () => page.waitForTimeout(600);
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(1000);
  check((await big()) === 'Thickness d = 999.5 ± 0.6 nm (11 extrema, Swanepoel envelope)', `thin film: example headline (${await big()})`);
  { const f = await txt('.tf-facts'); check(f.includes('1001 ± 10 nm') && f.includes('8.5 down to 3.5') && f.includes('2.303 at 541.49 nm') && f.includes('2.217 at 1266.2 nm') && f.includes('cm⁻¹'), 'thin film: example facts'); }
  { const t = await txt('.tf-tab'); check(t.includes('541.5min0.90970.66172.30210058.5999.92.303') && t.includes('1266.2min'), 'thin film: fringe table'); }
  check(await page.isVisible(R + '.tf-fig1') && await page.isVisible(R + '.tf-fig2'), 'thin film: spectrum and index plots');
  // Substrate from Ts.
  await page.fill(R + '.tf-ts', '92'); await wait();
  check((await txt('.tf-facts')).includes('s = 1.5130') && !(await big()).includes('999.5 ±'), 'thin film: substrate index from bare substrate T');
  await page.fill(R + '.tf-ts', ''); await wait();
  // Order shift.
  await page.fill(R + '.tf-shift', '1'); await wait();
  check((await txt('.tf-facts')).includes('9.5 down to 4.5') && (await txt('.tf-note')).includes('order shift'), 'thin film: order shift warns');
  await page.fill(R + '.tf-shift', '0'); await wait();
  // Known index, Cauchy.
  await page.selectOption(R + '.tf-m', 'known'); await page.fill(R + '.tf-a', '2.2'); await page.fill(R + '.tf-b', '30000'); await wait();
  check((await big()) === 'Thickness d = 999.8 ± 0.6 nm (13 extrema)', `thin film: known Cauchy index (${await big()})`);
  await page.fill(R + '.tf-b', '0'); await page.fill(R + '.tf-a', '2.25'); await wait();
  check((await big()).startsWith('Thickness d = ') && (await txt('.tf-facts')).includes('2.2500'), 'thin film: constant index');
  await page.fill(R + '.tf-th', '30'); await wait();
  check((await txt('.tf-facts')).includes('effective index at 30°'), 'thin film: angle of incidence');
  await page.fill(R + '.tf-th', '0'); await page.fill(R + '.tf-a', '2.2'); await page.fill(R + '.tf-b', '30000'); await wait();
  // Reflectance: 100 − T has minima at the T maxima.
  const data = (await page.inputValue(R + '.tf-data')).split('\n').slice(1).map((l) => l.split('\t').map(Number));
  writeFileSync(OUT + 'refl.csv', 'nm,R\n' + data.map(([l, t]) => `${l},${(100 - t).toFixed(3)}`).join('\n') + '\n');
  await page.selectOption(R + '.tf-y', 'rpct'); await page.locator(R + '.dfb-in').first().setInputFiles(OUT + 'refl.csv'); await page.waitForTimeout(1000);
  check((await big()) === 'Thickness d = 999.8 ± 0.6 nm (13 extrema)', `thin film: reflectance from a file (${await big()})`);
  await page.selectOption(R + '.tf-m', 'envelope'); await wait();
  check((await txt('.tf-err')).includes('works on transmittance'), 'thin film: envelope refuses reflectance');
  // Wavenumber input.
  await page.selectOption(R + '.tf-m', 'known'); await page.selectOption(R + '.tf-y', 'tpct'); await page.selectOption(R + '.tf-x', 'cm1');
  await page.fill(R + '.tf-data', data.map(([l, t]) => `${(1e7 / l).toFixed(4)}\t${t}`).join('\n')); await wait();
  check((await big()).startsWith('Thickness d = 999.') || (await big()).startsWith('Thickness d = 1000.'), `thin film: wavenumber input (${await big()})`);
  // CSV.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.tf-csv')]); const f = OUT + 'fringes.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 14 && rows[0].startsWith('wavelength_nm,type,reading'), 'thin film: fringe CSV'); }
  // Count method.
  await page.selectOption(R + '.tf-m', 'count'); await page.fill(R + '.tf-a', '2'); await wait();
  check((await big()) === 'Thickness d = 4500.0 nm (4.500 µm)' && await page.isHidden(R + '.tf-spec') && (await txt('.tf-facts')).includes('4050.0 to 4950.0 nm'), `thin film: fringe count (${await big()})`);
  await page.fill(R + '.tf-th', '30'); await wait();
  check((await big()).startsWith('Thickness d = 4647.6 nm'), 'thin film: fringe count at 30°');
  await page.fill(R + '.tf-l2', '600'); await wait();
  check((await txt('.tf-err2')).includes('two different'), 'thin film: same wavelengths');
  await page.fill(R + '.tf-l2', '900'); await page.fill(R + '.tf-th', '95'); await wait();
  check((await txt('.tf-err2')).includes('angle'), 'thin film: bad angle');
  await page.fill(R + '.tf-th', '0');
  // Bad spectrum input.
  await page.selectOption(R + '.tf-m', 'envelope'); await page.selectOption(R + '.tf-x', 'nm');
  await page.fill(R + '.tf-data', '500 90\n501 91'); await wait();
  check((await txt('.tf-err')).includes('at least 20 lines'), 'thin film: too few points');
  await page.fill(R + '.tf-data', Array.from({ length: 30 }, (_, i) => `${500 + i} 90`).join('\n')); await wait();
  check((await txt('.tf-err')).includes('fringe extrema found'), 'thin film: no fringes');
  await page.click(R + '.tf-ex'); await wait();
  await page.selectOption(R + '.tf-y', 'tfrac'); await wait();
  check((await txt('.tf-err')).includes('per cent'), 'thin film: unit mismatch');
  await page.selectOption(R + '.tf-y', 'tpct'); await page.fill(R + '.tf-s', '0.5'); await wait();
  check((await txt('.tf-err2')).includes('substrate index'), 'thin film: bad substrate index');
  await page.fill(R + '.tf-s', '1.5'); await wait();
  check((await big()) === 'Thickness d = 999.5 ± 0.6 nm (11 extrema, Swanepoel envelope)', 'thin film: example restored');
};
