// #839 Gaussian and ORCA output reader
export const path = '/science/qc-output-parser/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.qcop';
  await page.goto(`${BASE}/science/qc-output-parser/`);
  await page.waitForFunction(() => document.querySelector('.qcop .qc-big')?.textContent?.startsWith('Final energy'), null, { timeout: 10000 });
  const big = () => page.textContent(`${R} .qc-big`), facts = () => page.textContent(`${R} .qc-facts`), st = () => page.textContent(`${R} .qc-status`);
  check((await big()) === 'Final energy: -76.408953 Eh', `qc: Gaussian example energy (${await big()})`);
  check((await st()).includes('Normal termination') && (await st()).includes('Optimisation converged (3 steps)') && (await st()).includes('No imaginary frequencies'), 'qc: status');
  { const f = await facts(); check(f.includes('−2079.1935 eV'.replace('−', '-')) && f.includes('#p B3LYP/6-31G(d) opt freq') && f.includes('H2O, 3 atoms') && f.includes('0, 1') && f.includes('-7.969 eV') && f.includes('1.788 eV') && f.includes('9.757 eV') && f.includes('2.0941 D') && f.includes('55.49 kJ/mol') && f.includes('0.003492 Eh = 9.17 kJ/mol'), `qc: Gaussian facts (${f})`); }
  check((await page.textContent(`${R} .qc-name`)).startsWith('water-example.log: Gaussian 16'), 'qc: file line');
  check((await page.locator(`${R} .qc-steps tbody tr`).count()) === 4 && (await page.textContent(`${R} .qc-steps tbody tr:nth-child(2)`)).includes('-7.004'), 'qc: steps table');
  check((await page.textContent(`${R} .qc-orb tbody`)).includes('5 (HOMO)') && (await page.locator(`${R} .qc-orb tbody tr`).count()) === 10, 'qc: orbitals table');
  check((await page.locator(`${R} .qc-freqs tbody tr`).count()) === 3 && (await page.textContent(`${R} .qc-imag`)) === 'No imaginary frequencies: 3 real modes.', 'qc: frequencies');
  check((await page.textContent(`${R} .qc-xyz`)).startsWith('3\nwater-example: final geometry from Gaussian, E = -76.408953 Eh\nO '), 'qc: XYZ');
  // Canvas drawn
  const ink = async (c) => page.$eval(`${R} ${c}`, (el) => { const d = el.getContext('2d').getImageData(0, 0, el.width, el.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 180 || d[i + 2] < 180) n++; return n; });
  check((await ink('.qc-efig')) > 1500 && (await ink('.qc-irfig')) > 1500, 'qc: charts drawn');
  // Scaling and width
  await page.fill(`${R} .qc-scale`, '0.96'); await page.waitForTimeout(80);
  check((await page.textContent(`${R} .qc-freqs tbody tr:first-child`)).includes('1644.4') && (await page.getAttribute(`${R} .qc-irfig`, 'aria-label')).includes('scaling 0.96'), 'qc: scaling factor');
  await page.fill(`${R} .qc-fwhm`, '0'); await page.waitForTimeout(80);
  check((await page.textContent(`${R} .qc-ferr`)).includes('between 1 and 200'), 'qc: bad band width');
  await page.fill(`${R} .qc-fwhm`, '10'); await page.waitForTimeout(80);
  check(await page.isHidden(`${R} .qc-ferr`), 'qc: width fixed');
  // Downloads
  const dl = async (sel, name) => { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} ${sel}`)]); const f = OUT + name; await d.saveAs(f); return { name: d.suggestedFilename(), text: readFileSync(f, 'utf8') }; };
  { const d = await dl('.qc-freq-csv', 'qcf.csv'); check(d.name === 'water-example-frequencies.csv' && d.text.startsWith('mode,frequency_cm-1,scaled_cm-1,ir_intensity_km_mol,imaginary\n1,1712.9,1644.384,74.6,no\n'), 'qc: frequencies CSV'); }
  { const d = await dl('.qc-spec-csv', 'qcs.csv'); const rows = d.text.trim().split('\n'); check(rows[0] === 'wavenumber_cm-1,intensity_km_mol_per_cm-1' && rows.length > 1000, 'qc: spectrum CSV'); }
  { const d = await dl('.qc-steps-csv', 'qcst.csv'); check(d.text.startsWith('step,energy_Eh,delta_E_kJ_mol,maximum_force,maximum_force_converged') && d.text.includes('\n3,-76.4089531,-0.424543,0.000094,yes'), `qc: steps CSV (${d.text.split('\n')[3]})`); }
  { const d = await dl('.qc-orb-csv', 'qco.csv'); check(d.text.split('\n')[5].startsWith('restricted,5,-0.29287,-7.9694'), `qc: orbitals CSV (${d.text.split('\n')[5]})`); }
  { const d = await dl('.qc-xyz-dl', 'qc.xyz'); check(d.name === 'water-example-final.xyz' && d.text.split('\n')[2].startsWith('O ') && d.text.split('\n').length === 6, 'qc: XYZ file'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .qc-out [data-f="pdf"]`)]); const f = OUT + 'qc.pdf'; await d.saveAs(f); check(d.suggestedFilename() === 'water-example-summary.pdf' && readFileSync(f).subarray(0, 5).toString() === '%PDF-', 'qc: PDF report'); }
  // ORCA example
  await page.click(`${R} .qc-ex[data-ex="o"]`); await page.waitForTimeout(300);
  check((await big()) === 'Final energy: -114.421533 Eh' && (await facts()).includes('! B3LYP def2-SVP Opt Freq') && (await facts()).includes('CH2O, 4 atoms') && (await facts()).includes('2.2716 D'), 'qc: ORCA example');
  check((await page.locator(`${R} .qc-freqs tbody tr`).count()) === 6 && (await page.textContent(`${R} .qc-irnote`)).includes('ORCA 5'), 'qc: ORCA frequencies');
  // Open a file with an imaginary frequency (Gaussian example with the first mode made negative)
  await page.click(`${R} .qc-ex[data-ex="g"]`); await page.waitForTimeout(200);
  const text = (await page.inputValue(`${R} .qc-in`)).replace(' Frequencies --   1712.9000', ' Frequencies --   -812.9000');
  await page.setInputFiles(`${R} .qc-file`, { name: 'ts.log', mimeType: 'text/plain', buffer: Buffer.from(text) }); await page.waitForTimeout(300);
  check((await st()).includes('1 imaginary frequency') && (await page.textContent(`${R} .qc-notes`)).includes('transition state') && (await page.textContent(`${R} .qc-imag`)).includes('-812.9 cm⁻¹ (mode 1)') && (await page.locator(`${R} .qc-freqs tr.imag`).count()) === 1, 'qc: imaginary frequency warning from a file');
  // Paste: error termination; and a bad file
  await page.fill(`${R} .qc-in`, text.replace(/ Normal termination of Gaussian.*\n/, ' Error termination via Lnk1e\n')); await page.waitForTimeout(500);
  check((await st()).includes('No normal termination') && (await page.textContent(`${R} .qc-notes`)).includes('error termination'), 'qc: pasted error termination');
  await page.setInputFiles(`${R} .qc-file`, { name: 'x.out', mimeType: 'text/plain', buffer: Buffer.from('hello world\n') }); await page.waitForTimeout(300);
  check((await page.textContent(`${R} .qc-err`)).includes('does not look like a Gaussian or ORCA output') && (await page.isHidden(`${R} .qc-out`)), 'qc: not an output file');
};
