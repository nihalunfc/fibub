// #860 Quantum dot size (Brus equation)
export const path = '/science/quantum-dot-size/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.qdots ';
  const txt = (s) => page.textContent(R + s);
  const big = () => txt('.qd-big');
  const wait = () => page.waitForTimeout(450);
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(800);
  check((await big()) === 'Diameter 5.12 nm (radius 2.56 nm) for 2.214 eV (560.0 nm)', `qdot: example headline (${await big()})`);
  { const f = await txt('.qd-facts'); check(f.includes('+0.5688 eV') && f.includes('−0.0948 eV') && f.includes('5.561 nm') && f.includes('0.460 × the exciton Bohr radius'), 'qdot: example facts'); }
  check(await page.isVisible(R + '.qd-fig') && (await txt('.qd-note')).includes('strong-confinement'), 'qdot: plot and regime note');
  // Switch to diameter: the value carries over.
  await page.selectOption(R + '.qd-mode', 'd'); await wait();
  check((await page.inputValue(R + '.qd-v')) === '5.12' && (await big()).startsWith('Band gap 2.21'), `qdot: switching to diameter keeps the dot (${await big()})`);
  await page.fill(R + '.qd-v', '4'); await wait();
  check((await big()).startsWith('Band gap 2.') && (await big()).endsWith('for a 4 nm dot'), `qdot: diameter to gap (${await big()})`);
  await page.selectOption(R + '.qd-mode', 'e'); await page.fill(R + '.qd-v', '2.2'); await wait();
  check((await big()) === 'Diameter 5.19 nm (radius 2.60 nm) for 2.200 eV (563.6 nm)', `qdot: gap to size (${await big()})`);
  await page.check(R + '.qd-pol'); await wait();
  check((await big()).startsWith('Diameter 5.18 nm (radius 2.59 nm)') && (await txt('.qd-facts')).includes('Polarisation term'), `qdot: polarisation term (${await big()})`);
  await page.uncheck(R + '.qd-pol'); await wait();
  // Presets.
  await page.selectOption(R + '.qd-pre', 'cds'); await wait();
  check((await page.inputValue(R + '.qd-eg')) === '2.42' && (await txt('.qd-err')).includes('not above the bulk gap'), 'qdot: CdS-like preset, 2.2 eV below its gap');
  await page.selectOption(R + '.qd-pre', 'pbs'); await page.selectOption(R + '.qd-mode', 'l'); await page.fill(R + '.qd-v', '1300'); await wait();
  check((await big()).startsWith('Diameter ') && (await txt('.qd-facts')).includes('19.99 nm'), `qdot: PbS-like infrared peak (${await big()})`);
  await page.fill(R + '.qd-me', '0.1'); await wait();
  check((await page.inputValue(R + '.qd-pre')) === 'own', 'qdot: editing switches to your own values');
  await page.selectOption(R + '.qd-pre', 'cdse'); await page.fill(R + '.qd-v', '560'); await wait();
  // Sizing polynomial (made-up coefficients).
  await page.fill(R + '.qd-poly', '1, 0.008'); await wait();
  check((await txt('.qd-facts')).includes('Your sizing curve5.480 nm at 560.0 nm'), 'qdot: user polynomial');
  await page.fill(R + '.qd-poly', '1, x'); await wait();
  check((await txt('.qd-perr')).includes('Coefficients are numbers'), 'qdot: bad polynomial');
  await page.fill(R + '.qd-poly', '1, 0.008'); await page.fill(R + '.qd-p0', '600'); await page.fill(R + '.qd-p1', '700'); await wait();
  check((await txt('.qd-facts')).includes('outside 600–700 nm'), 'qdot: polynomial out of its range');
  await page.fill(R + '.qd-poly', ''); await page.fill(R + '.qd-p0', '450'); await page.fill(R + '.qd-p1', '650');
  // CSV.
  await wait();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.qd-csv')]); const f = OUT + 'qd.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 161 && rows[0].startsWith('diameter_nm,radius_nm,gap_eV,peak_nm') && rows[1].startsWith('1.5,0.75,'), 'qdot: curve CSV'); }
  // Bad input.
  await page.fill(R + '.qd-v', '900'); await wait();
  check((await txt('.qd-err')).includes('not above the bulk gap'), 'qdot: peak beyond the bulk gap');
  await page.fill(R + '.qd-v', '-5'); await wait();
  check((await txt('.qd-err')).includes('positive wavelength'), 'qdot: negative wavelength');
  await page.fill(R + '.qd-v', '560'); await page.fill(R + '.qd-eps', '0.5'); await wait();
  check((await txt('.qd-err')).includes('dielectric'), 'qdot: bad dielectric constant');
  await page.fill(R + '.qd-eps', '10.6'); await page.fill(R + '.qd-d1', '1'); await wait();
  check((await txt('.qd-err')).includes('plot runs'), 'qdot: bad plot range');
  await page.fill(R + '.qd-d1', '12'); await wait();
  check((await big()) === 'Diameter 5.12 nm (radius 2.56 nm) for 2.214 eV (560.0 nm)', 'qdot: example restored');
};
