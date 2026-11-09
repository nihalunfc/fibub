// #346 Notch filter and PSD
export const path = '/science/notch-filter-psd/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const P = '.nf ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(1000);
  const facts = () => page.textContent(P + '.nf-facts'), tab = () => page.textContent(P + '.nf-tab');
  { const f = await facts(); check(f.includes('Notches50, 100, 150 Hz, Q 30') && f.includes('Line noise power (±1.95 Hz)463 → 0.204 µV²') && f.includes('33.6 dB') && f.includes('5,000 samples, 10 s at 500 Hz'), `notch: example result (${f})`); }
  { const t = await tab(); check(t.includes('Alpha8–13202.3202.3−0.0151 %78.1 %') && t.includes('Gamma30–451.4591.443−1.14 %'), 'notch: example band table'); }
  check((await page.inputValue(P + '.nf-fs')) === '500' && await page.isDisabled(P + '.nf-fs'), 'notch: sample rate from the time column');
  check(await page.isVisible(P + '.nf-psd') && await page.isVisible(P + '.nf-tr'), 'notch: spectrum and trace drawn');
  // Options.
  await page.selectOption(P + '.nf-h', '1'); await page.waitForTimeout(300);
  check((await facts()).includes('Notches50 Hz, Q 30'), 'notch: mains only');
  await page.selectOption(P + '.nf-h', '5'); await page.waitForTimeout(300);
  check((await facts()).includes('Notches50, 100, 150, 200 Hz'), 'notch: up to 5th harmonic stops below Nyquist (250 Hz)');
  await page.fill(P + '.nf-q', '10'); await page.waitForTimeout(500);
  check((await facts()).includes('Notch width (−3 dB)5 Hz at 50 Hz'), 'notch: Q 10 gives 5 Hz width');
  await page.fill(P + '.nf-q', '30'); await page.selectOption(P + '.nf-h', '3');
  const zp = await facts(); await page.click(P + '.nf-zp'); await page.waitForTimeout(300);
  check((await facts()) !== zp && /removed\d/.test(await facts()), 'notch: single causal pass');
  await page.click(P + '.nf-zp');
  await page.selectOption(P + '.nf-seg', '2048'); await page.waitForTimeout(300);
  check((await page.textContent(P + '.nf-segn')).includes('frequency step 0.244 Hz'), 'notch: Welch segment 2048');
  await page.selectOption(P + '.nf-seg', '512');
  await page.selectOption(P + '.nf-f0', '60'); await page.waitForTimeout(300);
  { const f = await facts(); check(f.includes('Notches60, 120, 180 Hz') && f.includes('Total power734.5 → 725.1'), `notch: 60 Hz removes little from 50 Hz hum (${f})`); }
  await page.selectOption(P + '.nf-f0', '50');
  await page.fill(P + '.nf-bands', 'Low 1-13; High 13-45'); await page.waitForTimeout(500);
  check((await tab()).includes('Low1–13') && (await tab()).includes('High13–45'), 'notch: custom bands');
  await page.fill(P + '.nf-unit', 'pA'); await page.waitForTimeout(500);
  check((await facts()).includes('pA²'), 'notch: units label');
  await page.fill(P + '.nf-t0', '2'); await page.fill(P + '.nf-tl', '0.5'); await page.waitForTimeout(500);
  check(await page.isVisible(P + '.nf-tr'), 'notch: trace window');
  // Downloads.
  { await page.locator(P + '.nf-csv').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.nf-csv')]); const f = OUT + 'nf.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 5001 && r[0] === 'time_s,original,filtered' && r[2].startsWith('0.002,') && Math.abs(Number(r[1].split(',')[2]) - 6.947876) < 0.01, `notch: filtered CSV close to SciPy filtfilt of the unrounded example (${r[1]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.nf-pcsv')]); const f = OUT + 'nfp.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 258 && r[0] === 'frequency_Hz,psd_before,psd_after' && Math.abs(Number(r[52].split(',')[1]) - 288.4395) < 1e-3, 'notch: spectra CSV matches SciPy welch'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.dl [data-f=docx]')]); const f = OUT + 'nf.docx'; await d.saveAs(f); check(readFileSync(f).subarray(0, 2).toString() === 'PK', 'notch: Word report'); }
  // Several columns without time: sample rate typed.
  const rows = ['a\tb', ...Array.from({ length: 600 }, (_, i) => `${Math.sin(2 * Math.PI * 60 * i / 1000).toFixed(5)}\t${(Math.sin(2 * Math.PI * 7 * i / 1000) + Math.sin(2 * Math.PI * 60 * i / 1000)).toFixed(5)}`)];
  await page.fill(P + '.nf-in', rows.join('\n')); await page.waitForTimeout(600);
  check((await page.textContent(P + '.nf-fsn')).includes('No time column') && !(await page.isDisabled(P + '.nf-fs')), 'notch: no time column asks for the rate');
  await page.fill(P + '.nf-fs', '1000'); await page.selectOption(P + '.nf-f0', '60'); await page.selectOption(P + '.nf-seg', '256'); await page.selectOption(P + '.nf-col', '1'); await page.waitForTimeout(600);
  check((await facts()).includes('600 samples, 0.6000 s at 1000 Hz') && (await page.$$eval(P + '.nf-col option', (o) => o.length)) === 2, 'notch: second column, typed rate');
  // Bad inputs.
  await page.fill(P + '.nf-fs', '100'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.nf-err')).includes('too low to contain 60 Hz'), 'notch: rate too low message');
  await page.fill(P + '.nf-fs', '1000'); await page.fill(P + '.nf-bands', 'Alpha 13-8'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.nf-err')).includes('upper edge'), 'notch: bad band message');
  await page.fill(P + '.nf-bands', 'Alpha 8-13'); await page.fill(P + '.nf-in', 'time_s\tv\n0\t1\n0.001\tx\n0.002\t3'); await page.waitForTimeout(600);
  check((await page.textContent(P + '.nf-err')).includes('row 2 is not a number'), 'notch: gap in trace message');
  await page.fill(P + '.nf-in', 'time_s\tv\n0\t1\n0.001\t2\n0.005\t3\n0.006\t3'); await page.waitForTimeout(600);
  check((await page.textContent(P + '.nf-err')).includes('not evenly spaced'), 'notch: uneven time message');
  // WAV file and a CSV file with a time column in ms.
  const { encodeWav16 } = await import('../../src/lib/sci/spectro.ts');
  writeFileSync(OUT + 'hum.wav', encodeWav16(Array.from({ length: 8000 }, (_, i) => 0.3 * Math.sin(2 * Math.PI * 50 * i / 8000) + 0.2 * Math.sin(2 * Math.PI * 9 * i / 8000)), 8000));
  await page.selectOption(P + '.nf-f0', '50'); await page.selectOption(P + '.nf-seg', '2048'); await page.setInputFiles(P + '.nf-wav', OUT + 'hum.wav'); await page.waitForTimeout(800);
  { const f = await facts(); check((await page.textContent(P + '.nf-src')).includes('hum.wav: 1 channel, 8000 Hz') && f.includes('8,000 samples, 1 s at 8000 Hz') && f.includes('RMS0.2549 → 0.1451') && /removed\d\d/.test(f), `notch: WAV opened and hum removed (${f})`); }
  writeFileSync(OUT + 'trace.csv', 't_ms,Im_pA\n' + Array.from({ length: 2000 }, (_, i) => `${i * 0.5},${(10 * Math.sin(2 * Math.PI * 60 * i / 2000)).toFixed(4)}`).join('\n'));
  await page.setInputFiles(P + '.dfb-in', OUT + 'trace.csv'); await page.waitForTimeout(800);
  check((await page.inputValue(P + '.nf-fs')) === '2000' && await page.isHidden(P + '.nf-src'), 'notch: CSV with time in ms gives 2000 Hz, WAV dropped');
};
