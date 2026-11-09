// #631 Wavelet transform viewer
export const path = '/science/wavelet-viewer/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.wvv ';
  const big = () => page.textContent(R + '.wv-big');
  const tab = () => page.textContent(R + '.wv-tab');
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(800);
  check((await big()) === 'Strongest at 7.69 Hz, 0.64 s', `wavelet: example strongest point (${await big()})`);
  check((await page.textContent(R + '.wv-facts')).includes('scales 2.5 to 100 samples') && (await page.textContent(R + '.wv-facts')).includes('400 values at 200 Hz'), 'wavelet: example scales and signal');
  { const t = await tab(); check(t.includes('D350 to') === false && t.includes('D312.5 to 255634.6') && t.includes('D46.25 to 12.53135.8') && t.includes('A50 to 3.1251918.7'), `wavelet: example db4 energy table (${t})`); }
  for (const [w, txt] of [['cmor4', 'B = 4'], ['cmor0.5', 'B = 0.5'], ['morl', 'real Morlet']]) { await page.selectOption(R + '.wv-cw', w); await page.waitForTimeout(150); check((await page.textContent(R + '.wv-facts')).includes(txt), `wavelet: ${txt} wavelet`); }
  check((await page.textContent(R + '.wv-facts')).includes('centre frequency 0.8125'), 'wavelet: real Morlet centre frequency 0.8125');
  await page.selectOption(R + '.wv-cw', 'cmor1.5');
  await page.selectOption(R + '.wv-nf', '32'); await page.selectOption(R + '.wv-col', 'pow'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.wv-facts')).includes('32 rows') && (await page.getAttribute(R + '.wv-sfig', 'aria-label')).startsWith('Scalogram'), 'wavelet: 32 rows, power');
  await page.fill(R + '.wv-f0', '15'); await page.fill(R + '.wv-f1', '500'); await page.waitForTimeout(150);
  { const f = await page.textContent(R + '.wv-facts'); check(f.includes('15 to 100 Hz') && f.includes('limited to the Nyquist'), 'wavelet: range limited to Nyquist'); }
  check((await big()).startsWith('Strongest at 2'), `wavelet: with 15 Hz and up, the 25 Hz part is strongest (${await big()})`);
  await page.fill(R + '.wv-f0', '2'); await page.fill(R + '.wv-f1', '80'); await page.selectOption(R + '.wv-nf', '64'); await page.selectOption(R + '.wv-col', 'mag'); await page.waitForTimeout(150);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.wv-ccsv')]); const f = OUT + 'wv-cwt.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 65 && rows[0].startsWith('frequency_Hz,0,0.005,') && rows[1].startsWith('80,') && rows[1].split(',').length === 401, 'wavelet: scalogram CSV'); }
  // DWT options.
  for (const [w, lvMax] of [['haar', 8], ['db2', 7], ['db4', 5]]) { await page.selectOption(R + '.wv-dw', w); await page.waitForTimeout(150); const n = (await page.$$(R + '.wv-lv option')).length; check(n === lvMax, `wavelet: ${w} offers ${lvMax} levels for 400 values (pywt.dwt_max_level)`); }
  await page.selectOption(R + '.wv-dw', 'haar'); await page.selectOption(R + '.wv-lv', '3'); await page.waitForTimeout(150);
  { const t = await tab(); check(t.includes('D1') && t.includes('A3') && !t.includes('D4') && t.includes('200'), 'wavelet: Haar 3 levels'); }
  await page.selectOption(R + '.wv-dm', 'periodization'); await page.waitForTimeout(150);
  { const t = await tab(); const e = await page.$$eval(R + '.wv-tab tr td:last-child', (els) => els.map((x) => +x.textContent)); check(t.includes('A30 to 12.5') && Math.abs(e.reduce((a, b) => a + b, 0) - 100) < 0.3, `wavelet: periodic edges, energy shares add to 100 % (${e})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.wv-dcsv')]); const f = OUT + 'wv-dwt.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'part,index,coefficient' && rows.length === 1 + 200 + 100 + 50 + 50, 'wavelet: coefficients CSV (Haar periodic, 400 values)'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=png]')]); check(/\.png$/.test(d.suggestedFilename()), 'wavelet: report image'); }
  // Values only from a file.
  writeFileSync(OUT + 'wv.csv', Array.from({ length: 512 }, (_, i) => Math.sin(2 * Math.PI * 64 * i / 512).toFixed(6)).join('\n'));
  await page.selectOption(R + '.wv-mode', 'values'); await page.fill(R + '.wv-fs', '512');
  await page.setInputFiles(R + '.dfb-in', OUT + 'wv.csv'); await page.waitForTimeout(400);
  check((await big()).startsWith('Strongest at 6') && (await page.textContent(R + '.wv-facts')).includes('512 values at 512 Hz'), `wavelet: opened file, 64 Hz tone (${await big()})`);
  await page.fill(R + '.wv-fs', ''); await page.waitForTimeout(100);
  check((await page.textContent(R + '.wv-err')).includes('Give the sample rate') && await page.isHidden(R + '.wv-out'), 'wavelet: missing sample rate message');
  await page.selectOption(R + '.wv-mode', 'auto'); await page.fill(R + '.wv-data', '1\n2\n3'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.wv-err')).includes('at least 16 values'), 'wavelet: too few values message');
  await page.fill(R + '.wv-data', Array.from({ length: 20 }, (_, i) => `${i < 10 ? i : i * 1.5},${i % 3}`).join('\n')); await page.waitForTimeout(100);
  check((await page.textContent(R + '.wv-err')).includes('uneven'), 'wavelet: uneven times message');
};
