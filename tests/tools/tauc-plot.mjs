// #863 Tauc plot band gap
export const path = '/science/tauc-plot/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.taucp ';
  const txt = (s) => page.textContent(R + s);
  const big = () => txt('.tp-big');
  const wait = () => page.waitForTimeout(450);
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(800);
  check((await big()) === 'Direct allowed gap Eg = 2.39932 ± 0.00012 eV; Urbach energy 53.22 ± 0.33 meV', `tauc: example headline (${await big()})`);
  { const f = await txt('.tp-facts'); check(f.includes('516.7 nm') && f.includes('2.397 to 2.399 eV') && f.includes('2.417 to 2.678 eV') && f.includes('51 points') && f.includes('2.292 to 2.398 eV'), 'tauc: example facts (wavelength, spread, region, Urbach range)'); }
  check(await page.isVisible(R + '.tp-fig1') && await page.isVisible(R + '.tp-fig2'), 'tauc: Tauc and Urbach plots');
  // Transition types.
  await page.selectOption(R + '.tp-n', 'ia'); await wait();
  check((await big()).startsWith('Indirect allowed gap Eg = ') && !(await big()).includes('2.39932'), `tauc: indirect transition refits (${await big()})`);
  await page.selectOption(R + '.tp-n', 'df'); await wait();
  check((await big()).startsWith('Direct forbidden'), 'tauc: direct forbidden');
  await page.selectOption(R + '.tp-n', 'if'); await wait();
  check((await big()).startsWith('Indirect forbidden'), 'tauc: indirect forbidden');
  await page.selectOption(R + '.tp-n', 'da'); await wait();
  // Manual region starts from the automatic one.
  await page.selectOption(R + '.tp-mode', 'manual'); await wait();
  check((await page.inputValue(R + '.tp-e0')) === '2.417' && (await page.inputValue(R + '.tp-e1')) === '2.678' && (await big()).includes('2.399'), 'tauc: manual region filled from the automatic one');
  await page.fill(R + '.tp-e0', '2.45'); await page.fill(R + '.tp-e1', '2.9'); await wait();
  check((await txt('.tp-facts')).includes('2.450 to 2.897 eV79 points'), `tauc: manual region used (${(await txt('.tp-facts')).slice(0, 200)})`);
  await page.fill(R + '.tp-e0', '5'); await page.fill(R + '.tp-e1', '6'); await wait();
  check((await txt('.tp-err')).includes('At least 3 points') && await page.isHidden(R + '.tp-out'), 'tauc: empty manual region message');
  await page.fill(R + '.tp-e0', '1.8'); await page.fill(R + '.tp-e1', '2.0'); await wait();
  check((await txt('.tp-err')).includes('does not rise') || (await big()).includes('gap'), 'tauc: flat region handled');
  await page.selectOption(R + '.tp-mode', 'auto'); await wait();
  // Baseline.
  await page.check(R + '.tp-base'); await wait();
  { const f = await txt('.tp-facts'); check((await big()).startsWith('Direct allowed gap Eg = 2.39933') && f.includes('crossing the baseline') && /Baseline1\.80\d to 2\.(19\d|200) eV/.test(f), `tauc: baseline crossing (${await big()} ${f.slice(0, 400)})`); }
  await page.fill(R + '.tp-b0', ''); await wait();
  check((await txt('.tp-err')).includes('baseline region'), 'tauc: baseline needs a range');
  await page.uncheck(R + '.tp-base'); await wait();
  // Urbach options.
  await page.selectOption(R + '.tp-umode', 'manual'); await page.fill(R + '.tp-u0', '2.3'); await page.fill(R + '.tp-u1', '2.38'); await wait();
  check((await txt('.tp-facts')).includes('ln α from 2.30') && (await big()).includes('Urbach energy'), 'tauc: manual Urbach range');
  await page.uncheck(R + '.tp-urb'); await wait();
  check(!(await big()).includes('Urbach') && await page.isHidden(R + '.tp-fig2'), 'tauc: Urbach off');
  await page.check(R + '.tp-urb'); await page.selectOption(R + '.tp-umode', 'auto'); await wait();
  // Thickness off: same gap, relative units.
  await page.fill(R + '.tp-d', ''); await wait();
  check((await big()).includes('2.39932 ± 0.00012') && (await txt('.tp-note')).includes('relative units'), 'tauc: no thickness, same gap');
  await page.fill(R + '.tp-d', '-3'); await wait();
  check((await txt('.tp-err')).includes('thickness'), 'tauc: bad thickness');
  await page.fill(R + '.tp-d', '400'); await wait();
  // CSV.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.tp-csv')]); const f = OUT + 'tauc.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 302 && rows[0] === 'photon_energy_eV,wavelength_nm,alpha,tauc_y,in_linear_region,fit_line' && rows.filter((r) => r.split(',')[4] === '1').length === 51, 'tauc: Tauc CSV'); }
  // Diffuse reflectance (%) in eV for a made-up indirect-gap powder at 1.5 eV, opened from a file.
  const lines = ['energy_eV,R_percent'];
  for (let i = 0; i <= 200; i++) { const e = 1 + i * 0.005; const a = e > 1.5 ? 4 * (e - 1.5) ** 2 / e : 0; const F = a; lines.push(`${e.toFixed(3)},${(100 * (1 + F - Math.sqrt(F * F + 2 * F))).toFixed(6)}`); }
  writeFileSync(OUT + 'powder.csv', lines.join('\n') + '\n');
  await page.selectOption(R + '.tp-x', 'ev'); await page.selectOption(R + '.tp-y', 'rpct'); await page.selectOption(R + '.tp-n', 'ia');
  await page.locator(R + '.dfb-in').first().setInputFiles(OUT + 'powder.csv'); await page.waitForTimeout(900);
  check(Math.abs(Number((await big()).match(/Indirect allowed gap Eg = ([\d.]+)/)?.[1]) - 1.5) < 1e-6 && (await txt('.tp-note')).includes('Kubelka-Munk'), `tauc: Kubelka-Munk powder from a file (${await big()})`);
  await page.selectOption(R + '.tp-y', 'rfrac'); await wait();
  check((await txt('.tp-err')).includes('Reflectance above 100 %'), 'tauc: reflectance unit mismatch');
  // Transmittance in per cent, wavelength.
  const tl = []; for (let l = 900; l >= 500; l -= 2) { const e = 1239.8419843320026 / l; const a = e > 1.9 ? 2e4 * Math.sqrt(e - 1.9) / e : 0; tl.push(`${l}\t${(100 * Math.exp(-a * 1e-4)).toFixed(6)}`); }
  await page.selectOption(R + '.tp-x', 'nm'); await page.selectOption(R + '.tp-y', 'tpct'); await page.selectOption(R + '.tp-n', 'da'); await page.fill(R + '.tp-d', '1000');
  await page.fill(R + '.tp-data', tl.join('\n')); await page.waitForTimeout(600);
  check(Math.abs(Number((await big()).match(/Eg = ([\d.]+)/)[1]) - 1.9) < 1e-6, `tauc: transmittance % spectrum (${await big()})`);
  await page.selectOption(R + '.tp-y', 'tfrac'); await wait();
  check((await txt('.tp-err')).includes('per cent'), 'tauc: transmittance unit mismatch');
  // Bad input.
  await page.fill(R + '.tp-data', '400 0.5\n401 0.4'); await wait();
  check((await txt('.tp-err')).includes('at least 10 lines'), 'tauc: too few points');
  await page.fill(R + '.tp-data', Array.from({ length: 12 }, (_, i) => `${-i} 0.5`).join('\n')); await wait();
  check((await txt('.tp-err')).includes('positive'), 'tauc: negative wavelengths');
  await page.click(R + '.tp-ex'); await page.waitForTimeout(500);
  await page.fill(R + '.tp-sd', '0'); await wait();
  check((await txt('.tp-err')).includes('stopping distance'), 'tauc: bad stopping distance');
  await page.fill(R + '.tp-sd', '3'); await wait();
  check((await big()).startsWith('Direct allowed gap Eg = 2.39932'), 'tauc: example restored');
};
