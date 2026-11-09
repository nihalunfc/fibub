// #188 cryo-EM sampling and resolution calculator
export const path = '/science/cryo-em-calculator/';
export default async ({ page, check, OUT, readFileSync, BASE }) => {
  const R = '.cem ';
  const txt = (c) => page.textContent(R + c);
  const set = async (c, v) => { await page.fill(R + c, v); await page.waitForTimeout(60); };
  await page.goto(`${BASE}/science/cryo-em-calculator/`); await page.waitForTimeout(500);
  // The example, as the guide describes it.
  check((await txt('.ce-big')) === '0.8333 Å per pixel, Nyquist 1.667 Å', 'cryo-em: example pixel size and Nyquist');
  { const t = await txt('.ce-sfacts'); check(t.includes('recorded at 0.4167 Å (super-resolution), binned by 2') && t.includes('Super-resolution Nyquist0.8333 Å') && t.includes('0.6 per Å'), 'cryo-em: super-resolution and binning facts'); }
  { const t = await txt('.ce-dfacts'); check(t.includes('21.6 e⁻/Å²/s') && t.includes('Total dose54 e⁻/Å²') && t.includes('1.08 e⁻/Å²50 ms per frame; 0.75 e⁻ per camera pixel'), `cryo-em: example dose (${t})`); }
  { const t = await txt('.ce-ofacts'); check(t.includes('0.01969 Å') && t.includes('0.02239 Å without') && t.includes('First CTF zero17.46 Å') && t.includes('CTF zeros up to Nyquist92') && t.includes('1.688 and 1.677 Å'), `cryo-em: wavelength and CTF zeros (${t})`); }
  { const t = await txt('.ce-bfacts'); check(t.includes('450 px375 Å across; needs at least 362.1 Å') && t.includes('up to 106.1 Å') && t.includes('270 to 360 px') && t.includes('180 px'), `cryo-em: box size (${t})`); }
  { const t = await txt('.ce-rfacts'); check(t.includes('3.619 Å') && t.includes('3.035 Å') && t.includes('Particles for 3 Å227,000'), `cryo-em: particles guide (${t})`); }
  check((await txt('.ce-rtab')).includes('200,00010 ×3.04') && await page.isVisible(R + '.ce-ctf') && await page.isVisible(R + '.ce-rh'), 'cryo-em: particles table and both plots');

  // Options: no super-resolution, binning, calibrated pixel.
  await page.uncheck(R + '.ce-sr'); await page.waitForTimeout(80);
  check((await txt('.ce-big')) === '1.667 Å per pixel, Nyquist 3.333 Å', 'cryo-em: without super-resolution, binned by 2');
  check((await txt('.ce-berr')).includes('finer than the Nyquist limit (3.333 Å)') && await page.isHidden(R + '.ce-bfacts'), 'cryo-em: target finer than Nyquist message');
  await page.selectOption(R + '.ce-bin', '1'); await page.waitForTimeout(80);
  check((await txt('.ce-big')) === '0.8333 Å per pixel, Nyquist 1.667 Å' && await page.isVisible(R + '.ce-bfacts'), 'cryo-em: binning 1');
  await page.selectOption(R + '.ce-mode', 'cal'); await set('.ce-cal', '1.06');
  check((await txt('.ce-big')) === '1.06 Å per pixel, Nyquist 2.12 Å' && await page.isHidden(R + '.ce-mag') && (await txt('.ce-dfacts')).includes('(1.06 Å)²'), 'cryo-em: calibrated pixel size');
  await set('.ce-cal', '');
  check((await txt('.ce-serr')).includes('calibrated pixel size') && (await txt('.ce-derr')).includes('Fix the pixel size above first'), 'cryo-em: missing pixel size messages');
  await page.selectOption(R + '.ce-mode', 'mag'); await page.waitForTimeout(80);
  await set('.ce-mag', 'abc');
  check((await txt('.ce-serr')).includes('Type the magnification') && await page.isHidden(R + '.ce-sout'), 'cryo-em: bad magnification message');
  await page.click(R + '.ce-ex'); await page.waitForTimeout(100);
  check((await txt('.ce-big')) === '0.8333 Å per pixel, Nyquist 1.667 Å', 'cryo-em: example button restores everything');

  // Dose targets and bad dose input.
  await set('.ce-tt', '40'); await set('.ce-tf', '0.7');
  { const t = await txt('.ce-dfacts'); check(t.includes('Time for 40 e⁻/Å²1.85 s') && t.includes('Frames for 0.7 e⁻/Å² or less each58') && t.includes('0.69 e⁻/Å² each, out of 40'), `cryo-em: dose targets (${t})`); }
  await set('.ce-fr', '2.5');
  check((await txt('.ce-derr')).includes('whole number of frames') && await page.isHidden(R + '.ce-dfacts'), 'cryo-em: frames must be whole');
  await set('.ce-fr', '50');

  // Optics: 200 kV, overfocus, envelope, no Cs; bad amplitude contrast.
  await page.selectOption(R + '.ce-kv', '200'); await page.waitForTimeout(80);
  check((await txt('.ce-ofacts')).includes('0.02508 Å'), 'cryo-em: 200 kV wavelength');
  await set('.ce-df', '-1');
  check((await txt('.ce-ofacts')).includes('Overfocus'), 'cryo-em: overfocus noted');
  await page.selectOption(R + '.ce-kv', '300'); await set('.ce-df', '1'); await set('.ce-cs', '0');
  // No Cs: first zero at k² = (1 − asin(0.1)/π) / (λΔf); 1/k = 14.26 Å.
  check((await txt('.ce-ofacts')).includes('First CTF zero14.26 Å'), 'cryo-em: first zero without Cs, worked by hand');
  await set('.ce-eb', '80');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ce-ccsv')]); const f = OUT + 'cem-ctf.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); const last = rows[rows.length - 1].split(',');
    check(rows.length === 802 && rows[0] === 'frequency_per_A,resolution_A,ctf,envelope' && rows[1] === '0.000000,,-0.100000,1.000000' && Math.abs(Number(last[3]) - Math.exp(-80 * 0.36 / 4)) < 1e-6, 'cryo-em: CTF curve CSV with envelope'); }
  await set('.ce-amp', '0.9');
  check((await txt('.ce-oerr')).includes('amplitude contrast') && (await txt('.ce-berr')).includes('Fix the microscope'), 'cryo-em: bad amplitude contrast message');
  await page.click(R + '.ce-ex'); await page.waitForTimeout(100);

  // Box near focus: the 1.5 × rule wins.
  await set('.ce-df', '0.1');
  check((await txt('.ce-bfacts')).includes('270 px225 Å across') && (await txt('.ce-bfacts')).includes('already holds'), 'cryo-em: near focus the rule of thumb is enough');
  await set('.ce-dia', '0');
  check((await txt('.ce-berr')).includes('particle diameter'), 'cryo-em: bad diameter message');
  await page.click(R + '.ce-ex'); await page.waitForTimeout(100);

  // Particles: another B; too few particles; CSV.
  await set('.ce-b', '200');
  check((await txt('.ce-rfacts')).includes('Particles for 3 Å2,580,000'), 'cryo-em: B = 200 needs more particles');
  await set('.ce-n0', '0');
  check((await txt('.ce-rerr')).includes('how many particles') && await page.isHidden(R + '.ce-rout'), 'cryo-em: bad particle count message');
  await set('.ce-n0', '20000'); await set('.ce-b', '100');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ce-rcsv')]); const f = OUT + 'cem-rh.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows.length === 8 && rows[0] === 'particles,times_known,resolution_A' && rows[3] === '20000,1,4.00' && rows[6] === '200000,10,3.04', 'cryo-em: particles CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=png]')]); check((await d.suggestedFilename()).endsWith('.png'), 'cryo-em: report image download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=pdf]')]); check((await d.suggestedFilename()).endsWith('.pdf'), 'cryo-em: report PDF download'); }
};
