// #549 Fourier series and FFT visualiser
export const path = '/science/fourier-visualiser/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.fvz ';
  const txt = (c) => page.textContent(R + c);
  const dl = async (sel, name) => { await page.locator(R + sel).scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + sel)]); const f = OUT + name; await d.saveAs(f); return readFileSync(f, 'utf8').trim().split('\n'); };
  const slide = (c, v) => page.$eval(R + c, (el, v) => { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  await page.goto(`${BASE}/science/fourier-visualiser/`); await page.waitForTimeout(1000);
  // Series.
  check((await txt('.fv-big')) === '9 terms: mean square error 0.04040 (4.04 % of the mean square)', 'fourier: square wave, 9 terms, Parseval error');
  check((await txt('.fv-facts')).includes('1.182328 at t = 0.3142') && (await txt('.fv-facts')).includes('9.116 %'), 'fourier: Gibbs overshoot with 9 terms');
  check((await txt('.fv-ct')).includes('1.27324') && (await txt('.fv-ct')).includes('0.424413') && (await txt('.fv-form')).includes('4/(nπ)'), 'fourier: exact square-wave coefficients');
  await slide('.fv-ns', '99'); await page.waitForTimeout(400);
  check((await page.inputValue(R + '.fv-n')) === '99' && (await txt('.fv-facts')).includes('1.179013'), 'fourier: 99 terms overshoot 1.179013');
  await page.selectOption(R + '.fv-sm', 'fejer'); await page.waitForTimeout(400);
  check((await txt('.fv-facts')).includes('Overshootnone'), 'fourier: Fejér sum does not overshoot');
  await page.selectOption(R + '.fv-sm', 'lanczos'); await page.waitForTimeout(400);
  check(/Overshoot1\.\d+ %/.test(await txt('.fv-facts')), 'fourier: Lanczos overshoot about 1 %');
  await page.selectOption(R + '.fv-sm', 'none'); await page.check(R + '.fv-each'); await page.waitForTimeout(300);
  check(await page.isVisible(R + '.fv-sfig'), 'fourier: separate terms drawn');
  { const rows = await dl('.fv-ccsv', 'coef.csv'); check(rows.length === 101 && rows[0] === 'n,a_n,b_n,amplitude' && Math.abs(Number(rows[2].split(',')[2]) - 4 / Math.PI) < 1e-12, 'fourier: coefficient CSV'); }
  await page.fill(R + '.fv-n', '5'); await page.selectOption(R + '.fv-w', 'sawtooth'); await page.waitForTimeout(500);
  { const t = await txt('.fv-ct'); check(t.includes('0.636620') && t.includes('−0.318310'), 'fourier: sawtooth bₙ = 2(−1)ⁿ⁺¹/(nπ)'); }
  await page.selectOption(R + '.fv-w', 'pulse'); await page.waitForTimeout(300);
  check(await page.isVisible(R + '.fv-d') && (await txt('.fv-facts')).includes('Mean a₀/20.25'), 'fourier: pulse train, mean = duty');
  await page.fill(R + '.fv-d', '1.5'); await page.waitForTimeout(500);
  check((await txt('.fv-err')).includes('between 0 and 1'), 'fourier: duty checked');
  await page.fill(R + '.fv-d', '0.25'); await page.selectOption(R + '.fv-w', 'own'); await page.waitForTimeout(500);
  { const t = await txt('.fv-ct'); check(t.includes('6.57974 (a₀)') && t.includes('−4') && (await txt('.fv-form')).includes('numerically'), 'fourier: own f(t) = t², a₀ = 2π²/3, a₁ = −4'); }
  await page.fill(R + '.fv-ft', 'x + 1'); await page.waitForTimeout(500);
  check((await txt('.fv-err')).includes('only t') && await page.isHidden(R + '.fv-sout'), 'fourier: bad f(t) message');
  await page.fill(R + '.fv-ft', 't^2'); await page.fill(R + '.fv-n', '0'); await page.waitForTimeout(500);
  check((await txt('.fv-err')).includes('between 1 and 1000'), 'fourier: term count checked');
  await page.fill(R + '.fv-n', '9'); await page.selectOption(R + '.fv-w', 'square'); await page.waitForTimeout(400);
  // Epicycles.
  await page.click(R + '[data-tab=epi]'); await page.waitForTimeout(600);
  check((await txt('.fv-ef')).includes('20 of 256') && await page.isVisible(R + '.fv-ec') && await page.isHidden(R + '.fv-p-ser'), 'fourier: star drawn by 20 circles');
  await slide('.fv-ks', '256'); await page.waitForTimeout(300);
  check((await txt('.fv-ef')).includes('256 of 256') && (await txt('.fv-ef')).includes('0 % of its size'), 'fourier: all circles redraw the star exactly');
  await page.selectOption(R + '.fv-sh', 'heart'); await page.fill(R + '.fv-k', '9'); await page.waitForTimeout(500);
  check((await txt('.fv-ef')).includes('9 of 256') && (await txt('.fv-ef')).includes('0 % of its size'), 'fourier: heart needs only 9 circles');
  await page.fill(R + '.fv-k', '3'); await page.waitForTimeout(500);
  check(!(await txt('.fv-ef')).includes('Gap from the shape (RMS)0 %'), 'fourier: 3 circles leave a gap');
  await page.click(R + '.fv-play'); check((await txt('.fv-play')) === 'Play', 'fourier: pause');
  await page.click(R + '.fv-eclear'); await page.waitForTimeout(200);
  check((await txt('.fv-ehelp')).includes('Drag on the picture'), 'fourier: clear and draw');
  { await page.locator(R + '.fv-ec').scrollIntoViewIfNeeded(); const b = await page.locator(R + '.fv-ec').boundingBox(); const cx = b.x + b.width / 2, cy = b.y + b.height / 2, r = b.height / 3;
    await page.mouse.move(cx + r, cy); await page.mouse.down(); for (let i = 1; i <= 40; i++) await page.mouse.move(cx + r * Math.cos((i * Math.PI) / 20), cy + r * Math.sin((i * Math.PI) / 20)); await page.mouse.up(); await page.waitForTimeout(300); }
  { const t = await txt('.fv-ef'); check(t.includes('3 of 256') && /Speeds of the largest0, [−+]1,/.test(t), `fourier: drawn circle is mostly one circle (${t})`); }
  await page.click(R + '.fv-play'); check((await txt('.fv-play')) === 'Pause', 'fourier: play');
  // FFT.
  await page.click(R + '[data-tab=fft]'); await page.waitForTimeout(800);
  check((await txt('.fv-fbig')) === 'Strongest peak: 50 Hz, amplitude 1' && (await txt('.fv-pt')).includes('1200.5000−90'), 'fourier: FFT of 50 Hz + 0.5 × 120 Hz');
  check((await txt('.fv-ff')).includes('Frequency step (resolution)1 Hz') && (await txt('.fv-ff')).includes('500 Hz') && (await txt('.fv-ff')).includes('1.500 bins'), 'fourier: resolution, Nyquist, Hann bandwidth');
  { const rows = await dl('.fv-scsv', 'spec.csv'); check(rows.length === 502 && rows[0] === 'frequency_hz,amplitude,phase_deg' && Math.abs(Number(rows[51].split(',')[1]) - 1) < 1e-9, 'fourier: spectrum CSV'); }
  await page.fill(R + '.fv-sig', 'sin(2*pi*50.3*t) + 0.5*sin(2*pi*120*t)'); await page.selectOption(R + '.fv-win', 'rect'); await page.waitForTimeout(700);
  check((await txt('.fv-fbig')) === 'Strongest peak: 50.134 Hz, amplitude 0.8584' && (await txt('.fv-whelp')).includes('leakage'), 'fourier: leakage with no window');
  await page.selectOption(R + '.fv-win', 'flattop'); await page.waitForTimeout(500);
  check((await txt('.fv-fbig')).endsWith('amplitude 1'), 'fourier: flat top gives the true amplitude');
  for (const w of ['hamming', 'blackman']) { await page.selectOption(R + '.fv-win', w); await page.waitForTimeout(300); check((await txt('.fv-fbig')).startsWith('Strongest peak: 50.'), `fourier: ${w} window`); }
  await page.selectOption(R + '.fv-db', 'db'); await page.uncheck(R + '.fv-dc'); await page.waitForTimeout(500);
  check(await page.isVisible(R + '.fv-afig') && (await txt('.fv-ff')).includes('Mean of the signal'), 'fourier: decibel scale and mean kept');
  await page.fill(R + '.fv-N', '4'); await page.waitForTimeout(600);
  check((await txt('.fv-ferr')).includes('between 8 and 1,048,576'), 'fourier: sample count checked');
  await page.fill(R + '.fv-N', '1000');
  // My data: two columns (time, value), 64 samples of cos(2π·8t) at 64 Hz.
  await page.selectOption(R + '.fv-src', 'data'); await page.selectOption(R + '.fv-db', 'lin'); await page.selectOption(R + '.fv-win', 'rect');
  await page.fill(R + '.fv-dat', Array.from({ length: 64 }, (_, i) => `${i / 64}\t${Math.cos((2 * Math.PI * 8 * i) / 64)}`).join('\n')); await page.waitForTimeout(700);
  check((await txt('.fv-fbig')) === 'Strongest peak: 8 Hz, amplitude 1' && (await txt('.fv-ff')).includes('time step 0.01563'), 'fourier: pasted time and value columns');
  await page.fill(R + '.fv-dat', ['0\t1', '1\t2', '2\t3', '3\t1', '5\t2', '6\t3', '7\t1', '8\t2', '9\t3'].join('\n')); await page.waitForTimeout(700);
  check((await txt('.fv-ferr')).includes('not evenly spaced'), 'fourier: uneven times message');
  await page.fill(R + '.fv-dat', Array.from({ length: 100 }, (_, i) => String(3 * Math.sin((2 * Math.PI * 10 * i) / 100))).join('\n')); await page.fill(R + '.fv-dfs', '100'); await page.waitForTimeout(700);
  check((await txt('.fv-fbig')) === 'Strongest peak: 10 Hz, amplitude 3', 'fourier: one column with a sample rate');
  await page.setInputFiles(R + '.dfb-in', { name: 'sig.csv', mimeType: 'text/csv', buffer: Buffer.from('t,x\n' + Array.from({ length: 128 }, (_, i) => `${i / 128},${2 * Math.cos((2 * Math.PI * 16 * i) / 128)}`).join('\n')) }); await page.waitForTimeout(800);
  check((await txt('.fv-fbig')) === 'Strongest peak: 16 Hz, amplitude 2' && (await txt('.dfb-note')).includes('Opened sig.csv'), 'fourier: data from a CSV file');
  // Report.
  await page.locator(R + '.dl').scrollIntoViewIfNeeded();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=docx]')]); check(d.suggestedFilename() === 'fourier-visualiser.docx', 'fourier: Word report'); }
};
