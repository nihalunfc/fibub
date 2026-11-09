// #680 ECG viewer and HRV
export const path = '/science/ecg-viewer/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/ecg-viewer/`); await page.waitForTimeout(1500);
  const big = () => page.textContent('.egv .eg-big'), facts = () => page.textContent('.egv .eg-facts'), ff = () => page.textContent('.egv .eg-ffacts');
  const wait = () => page.waitForTimeout(700);
  check((await big()) === 'Heart rate 68.3 bpm · SDNN 37.6 ms · RMSSD 33.7 ms', 'ecg: example heart rate and HRV');
  { const f = await facts(); check(f.includes('Beats found204') && f.includes('203 of 203') && f.includes('28 · 13.9 %') && f.includes('23.9 · 47.5 ms') && f.includes('45,000 samples at 250 Hz'), 'ecg: example facts (beats, pNN50, SD1/SD2)'); }
  { const f = await ff(); check(f.includes('LF power875.4 ms²') && f.includes('HF power496.7 ms²') && f.includes('peak at 0.100 Hz') && f.includes('peak at 0.250 Hz') && f.includes('LF/HF1.76'), 'ecg: example spectrum LF/HF'); }
  check(await page.isVisible('.egv .eg-strip') && await page.isVisible('.egv .eg-tach') && await page.isVisible('.egv .eg-psd') && await page.isVisible('.egv .eg-poin'), 'ecg: four figures shown');
  // Strip window and position.
  await page.selectOption('.egv .eg-win', '30'); await page.locator('.egv .eg-pos').fill('60'); await page.waitForTimeout(200);
  check((await page.textContent('.egv .eg-posv')) === '60 s' && (await page.getAttribute('.egv .eg-pos', 'max')) === '150', 'ecg: strip window 30 s, start at 60 s');
  await page.selectOption('.egv .eg-win', '0'); await page.waitForTimeout(200);
  check(await page.isDisabled('.egv .eg-pos'), 'ecg: whole recording disables the slider');
  // Options.
  await page.selectOption('.egv .eg-pol', 'down'); await wait();
  check((await facts()).includes('R waves point down') && (await facts()).includes('Beats found204'), 'ecg: R waves forced down (beats placed on the S waves)');
  await page.selectOption('.egv .eg-pol', 'auto'); await page.selectOption('.egv .eg-notch', '0'); await page.fill('.egv .eg-lp', ''); await wait();
  check((await facts()).includes('Beats found204'), 'ecg: no notch and no low-pass still finds every beat');
  await page.selectOption('.egv .eg-notch', '50'); await page.fill('.egv .eg-lp', '40'); await page.selectOption('.egv .eg-tol', '0'); await page.click('.egv .eg-detr'); await wait();
  check((await facts()).includes('203 of 203') && (await ff()).includes('LF power'), 'ecg: irregular-interval filter off, no detrend');
  await page.click('.egv .eg-detr'); await page.selectOption('.egv .eg-tol', '0.2'); await wait();
  // Beats CSV.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.egv .eg-csv')]); const f = OUT + 'ecg-beats.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 205 && rows[0].startsWith('beat,R time (s),RR before (ms)') && rows[2].split(',')[4] === 'yes', 'ecg: beats CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.egv .dl button[data-f=png]')]); check((await d.suggestedFilename()) === 'ecg-hrv.png', 'ecg: report image download'); }
  // A time column at 500 Hz (the example upsampled by repeating, so heart rate is unchanged), opened as a file.
  { const vals = (await page.inputValue('.egv .eg-data')).trim().split('\n').slice(1);
    const csvText = 'time_s,lead_I\n' + vals.flatMap((v, i) => [`${(2 * i * 0.002).toFixed(3)},${v}`, `${((2 * i + 1) * 0.002).toFixed(3)},${v}`]).join('\n');
    writeFileSync(OUT + 'ecg-time.csv', csvText); }
  await page.selectOption('.egv .eg-fmt', 'tv'); await page.setInputFiles('.egv .dfb-in', OUT + 'ecg-time.csv'); await page.waitForTimeout(2500);
  { const f = await facts(); check(f.includes('90,000 samples at 500 Hz (from the time column)') && f.includes('Beats found204') && (await big()).startsWith('Heart rate 68.3 bpm'), 'ecg: time column, opened as a file'); }
  // Bad input messages.
  const err = () => page.textContent('.egv .eg-err');
  await page.selectOption('.egv .eg-fmt', 'v'); await page.fill('.egv .eg-data', '0.1\n0.2\n0.3'); await wait();
  check((await err()).includes('at least 10 seconds') && await page.isHidden('.egv .eg-out'), 'ecg: too short a recording');
  await page.click('.egv .eg-ex'); await page.fill('.egv .eg-fs', ''); await wait();
  check((await err()).includes('Give the sample rate'), 'ecg: missing sample rate');
  await page.fill('.egv .eg-fs', '250'); await page.fill('.egv .eg-hp', '50'); await wait();
  check((await err()).includes('high-pass cut-off must be lower'), 'ecg: high-pass above low-pass');
  await page.fill('.egv .eg-hp', '0.5'); await page.fill('.egv .eg-lp', '200'); await wait();
  check((await err()).includes('below half the sample rate'), 'ecg: low-pass above Nyquist');
  await page.fill('.egv .eg-lp', '40'); await page.fill('.egv .eg-col', '3'); await wait();
  check((await err()).includes('No numbers found in column 3'), 'ecg: empty value column');
  await page.fill('.egv .eg-col', '1');
  await page.evaluate(() => { const t = document.querySelector('.egv .eg-data'); t.value = 'flat\n' + Array.from({ length: 5000 }, () => '0.01').join('\n'); t.dispatchEvent(new Event('input')); }); await wait();
  check((await err()).includes('Fewer than 4 beats') && await page.isHidden('.egv .eg-out'), 'ecg: a flat line gives a clear message');
  await page.click('.egv .eg-ex'); await wait();
  check((await big()) === 'Heart rate 68.3 bpm · SDNN 37.6 ms · RMSSD 33.7 ms', 'ecg: example button restores the example');
};
