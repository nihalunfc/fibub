// #628 FFT workbench
export const path = '/science/fft-workbench/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.ffw ';
  const big = () => page.textContent(R + '.fw-big');
  const facts = () => page.textContent(R + '.fw-facts');
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  check((await big()) === 'Strongest peak 49.985 Hz, amplitude 1.01 V', `fft: example strongest peak (${await big()})`);
  { const t = await page.textContent(R + '.fw-peaks'); check(t.includes('120.006') && t.includes('0.4858') && (await page.$$(R + '.fw-peaks tr')).length === 6, 'fft: example peak table (5 peaks, 120 Hz at 0.486 V)'); }
  { const f = await facts(); check(f.includes('1000 Hz') && f.includes('Nyquist frequency500 Hz') && f.includes('Resolution1 Hz') && f.includes('0.1928 V'), 'fft: example facts (rate, Nyquist, resolution, mean)'); }
  check((await page.textContent(R + '.fw-ffacts')).includes('0.8464 V → 0.7185 V'), 'fft: example low-pass at 80 Hz lowers the spread');
  for (const [w, name] of [['hamming', 'Hamming'], ['blackman', 'Blackman'], ['rect', 'Rectangular'], ['hann', 'Hann']]) {
    await page.selectOption(R + '.fw-win', w); await page.waitForTimeout(80);
    const b = await big(); check(/^Strongest peak (49\.9\d*|50(\.0\d*)?) Hz/.test(b) && (await facts()).includes(name), `fft: ${name} window (${b})`);
  }
  for (const [v, lab] of [['db', 'amplitude in dB'], ['psd', 'power spectral density'], ['pow', 'power'], ['amp', 'amplitude']]) {
    await page.selectOption(R + '.fw-show', v); await page.waitForTimeout(80);
    check((await page.getAttribute(R + '.fw-sfig', 'aria-label')).includes(`(${lab})`), `fft: show ${lab}`);
  }
  await page.selectOption(R + '.fw-pad', '4'); await page.waitForTimeout(80);
  check((await facts()).includes('bins every 0.25 Hz after padding to 4,000 points'), 'fft: zero padding 4×');
  await page.selectOption(R + '.fw-pad', 'p2'); await page.waitForTimeout(80);
  check((await facts()).includes('padding to 1,024 points'), 'fft: padding to a power of 2');
  await page.selectOption(R + '.fw-pad', '1');
  await page.selectOption(R + '.fw-np', '10'); await page.waitForTimeout(80);
  check((await page.$$(R + '.fw-peaks tr')).length === 11, 'fft: 10 peaks listed');
  await page.fill(R + '.fw-fmax', '200'); await page.waitForTimeout(80);
  check(await page.isVisible(R + '.fw-sfig'), 'fft: frequency axis limit');
  await page.fill(R + '.fw-fmax', '');
  await page.uncheck(R + '.fw-dc'); await page.waitForTimeout(80);
  check((await facts()).includes('kept in the 0 Hz bin'), 'fft: keep the mean');
  await page.check(R + '.fw-dc');
  // Filters.
  await page.selectOption(R + '.fw-ft', 'high'); await page.waitForTimeout(80);
  check((await page.textContent(R + '.fw-ffacts')).includes('high-pass, keeps 80 Hz and up'), 'fft: high-pass');
  await page.selectOption(R + '.fw-ft', 'band'); await page.fill(R + '.fw-f1', '40'); await page.fill(R + '.fw-f2', '60'); await page.waitForTimeout(80);
  { const t = await page.textContent(R + '.fw-ffacts'); check(t.includes('band-pass, keeps 40 to 60 Hz') && await page.isVisible(R + '.fw-f2'), `fft: band-pass 40 to 60 Hz (${t})`); }
  await page.selectOption(R + '.fw-ft', 'stop'); await page.waitForTimeout(80);
  check((await page.textContent(R + '.fw-ffacts')).includes('band-stop, removes 40 to 60 Hz'), 'fft: band-stop');
  await page.fill(R + '.fw-f2', '30'); await page.waitForTimeout(80);
  check((await page.textContent(R + '.fw-ffacts')).includes('Give an upper edge above the lower edge'), 'fft: bad band edges message');
  await page.fill(R + '.fw-f2', '60');
  await page.selectOption(R + '.fw-ft', 'none'); await page.waitForTimeout(80);
  check(await page.isHidden(R + '.fw-f1') && (await page.textContent(R + '.fw-ffacts')).includes('no filter'), 'fft: no filter');
  await page.selectOption(R + '.fw-ft', 'low'); await page.fill(R + '.fw-f1', '80');
  for (const v of ['1', '0.5', '0.02']) { await page.selectOption(R + '.fw-tshow', v); await page.waitForTimeout(50); }
  check(await page.isVisible(R + '.fw-tfig'), 'fft: time shown options');
  // CSV downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.fw-scsv')]); const f = OUT + 'fft-spec.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 502 && rows[0].startsWith('frequency_Hz,amplitude_V,amplitude_dB') && rows[51].startsWith('50,'), 'fft: spectrum CSV (501 frequencies)'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.fw-tcsv')]); const f = OUT + 'fft-time.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 1001 && rows[0] === 'time_s,value,filtered', 'fft: filtered signal CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=png]')]); check(/\.png$/.test(d.suggestedFilename()), 'fft: report image download'); }
  // Values only with a typed sample rate, from a file.
  writeFileSync(OUT + 'fft-vals.txt', Array.from({ length: 256 }, (_, i) => (Math.cos(2 * Math.PI * 32 * i / 256) * 2).toFixed(6)).join('\n'));
  await page.setInputFiles(R + '.dfb-in', OUT + 'fft-vals.txt'); await page.waitForTimeout(400);
  await page.fill(R + '.fw-fs', '256'); await page.waitForTimeout(150);
  check((await big()) === 'Strongest peak 32 Hz, amplitude 2 V' && (await facts()).includes('as typed'), `fft: opened file of values at 256 Hz (${await big()})`);
  await page.selectOption(R + '.fw-mode', 'values'); await page.fill(R + '.fw-fs', ''); await page.waitForTimeout(100);
  check((await page.textContent(R + '.fw-err')).includes('Give the sample rate') && await page.isHidden(R + '.fw-out'), 'fft: missing sample rate message');
  await page.selectOption(R + '.fw-mode', 'time');
  await page.fill(R + '.fw-data', 't,v\n0,1\n1,2\n2,3\n3,2\n4,1\n5,2\n7,3\n8,2\n9,1'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.fw-err')).includes('time steps are uneven'), 'fft: uneven times message');
  await page.fill(R + '.fw-data', '1\n2\n3'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.fw-err')).includes('at least 8 values'), 'fft: too few values message');
  await page.selectOption(R + '.fw-mode', 'auto'); await page.fill(R + '.fw-data', '0,5\n1,5\n2,5\n3,5\n4,5\n5,5\n6,5\n7,5\n8,5'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.fw-err')).includes('All the values are the same'), 'fft: constant signal message');
  // Third column as the value.
  await page.selectOption(R + '.fw-col', '2'); await page.fill(R + '.fw-data', Array.from({ length: 64 }, (_, i) => `${i / 64}\t0\t${Math.sin(2 * Math.PI * 8 * i / 64).toFixed(6)}`).join('\n')); await page.waitForTimeout(150);
  check((await big()).startsWith('Strongest peak 8 Hz, amplitude 1'), `fft: third column chosen (${await big()})`);
};
