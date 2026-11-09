// #629 FIR/IIR filter designer
export const path = '/science/digital-filter-designer/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.dfd ';
  const big = () => page.textContent(R + '.fd-big');
  const facts = () => page.textContent(R + '.fd-facts');
  const code = () => page.inputValue(R + '.fd-code');
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  check((await big()) === 'FIR low-pass, 51 taps, Hamming window', 'filter: example design');
  { const f = await facts(); check(f.includes('Gain at the cut-off−6.05 dB') && f.includes('91.923 Hz') && f.includes('25 samples = 25 ms') && f.includes('−61.66 dB'), `filter: example facts (${f})`); }
  { const c = await code(); check(c.startsWith('// FIR low-pass, 51 taps') && c.includes('const double b[51] = {') && c.includes('const double a[1] = {\n  1\n};'), 'filter: example C arrays'); }
  check((await page.textContent(R + '.fd-pznote')).includes('49 zeros') && await page.isVisible(R + '.fd-pz'), 'filter: FIR pole-zero plot');
  for (const [w, n] of [['hann', 'Hann'], ['blackman', 'Blackman'], ['rect', 'rectangular']]) { await page.selectOption(R + '.fd-win', w); await page.waitForTimeout(60); check((await big()).endsWith(`${n} window`), `filter: ${n} window`); }
  await page.selectOption(R + '.fd-win', 'kaiser'); await page.waitForTimeout(80);
  check((await big()) === 'FIR low-pass, 74 taps, Kaiser window' && (await facts()).includes('74 taps, β = 5.653') && await page.isHidden(R + '.fd-taps'), 'filter: Kaiser taps from 60 dB and 50 Hz (scipy kaiserord: 74, 5.653)');
  await page.selectOption(R + '.fd-type', 'highpass'); await page.waitForTimeout(80);
  check((await big()) === 'FIR high-pass, 75 taps, Kaiser window' && (await facts()).includes('made odd'), 'filter: Kaiser high-pass made odd');
  await page.fill(R + '.fd-tw', '0.5'); await page.waitForTimeout(80);
  check((await page.textContent(R + '.fd-err')).includes('the limit is 1,001'), 'filter: too many Kaiser taps message');
  await page.fill(R + '.fd-tw', '50'); await page.selectOption(R + '.fd-win', 'hamming'); await page.fill(R + '.fd-taps', '50'); await page.waitForTimeout(80);
  check((await page.textContent(R + '.fd-err')).includes('needs an odd number of taps') && await page.isHidden(R + '.fd-out'), 'filter: even-tap high-pass message');
  await page.fill(R + '.fd-taps', '51'); await page.selectOption(R + '.fd-type', 'bandpass'); await page.waitForTimeout(80);
  { const f = await facts(); check((await big()) === 'FIR band-pass, 51 taps, Hamming window' && f.includes('Gain at the edges') && f.includes('100 Hz and 200 Hz') && await page.isVisible(R + '.fd-e2'), 'filter: FIR band-pass'); }
  await page.selectOption(R + '.fd-type', 'bandstop'); await page.waitForTimeout(80);
  check((await big()).startsWith('FIR band-stop'), 'filter: FIR band-stop');
  await page.fill(R + '.fd-e2', '90'); await page.waitForTimeout(80);
  check((await page.textContent(R + '.fd-err')).includes('upper edge above the lower edge'), 'filter: bad band edges message');
  await page.fill(R + '.fd-e2', '200'); await page.selectOption(R + '.fd-type', 'lowpass');
  // Butterworth.
  await page.selectOption(R + '.fd-fam', 'butter'); await page.waitForTimeout(80);
  { const f = await facts(); check((await big()) === 'Butterworth low-pass, order 4' && f.includes('Gain at the cut-off−3.01 dB') && f.includes('−27.97 dB') && f.includes('Stableyes') && f.includes('2 second-order sections'), `filter: Butterworth order 4 (${f})`); }
  check((await page.textContent(R + '.fd-pznote')).includes('Crosses are poles'), 'filter: IIR pole-zero note');
  await page.selectOption(R + '.fd-fmt', 'sos'); await page.waitForTimeout(60);
  check((await code()).includes('const double sos[2][6] = {'), 'filter: second-order sections in C');
  await page.selectOption(R + '.fd-fmt', 'csv'); await page.waitForTimeout(60);
  { const c = await code(); check(c.startsWith('n,b,a\n0,') && c.includes('section,b0,b1,b2,a0,a1,a2\n1,'), 'filter: CSV with sections'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.fd-dl')]); const f = OUT + 'filter.csv'; await d.saveAs(f); check(d.suggestedFilename() === 'butter-lowpass-4.csv' && readFileSync(f, 'utf8').split('\n')[0] === 'n,b,a', 'filter: CSV download'); }
  await page.selectOption(R + '.fd-fmt', 'c'); await page.fill(R + '.fd-ord', '8'); await page.waitForTimeout(80);
  check((await page.textContent(R + '.fd-codenote')).includes('use the second-order sections'), 'filter: high-order b/a warning');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.fd-dl')]); check(d.suggestedFilename() === 'butter-lowpass-8.h', 'filter: C header download'); }
  await page.fill(R + '.fd-ord', '25'); await page.waitForTimeout(80);
  check((await page.textContent(R + '.fd-err')).includes('order from 1 to 20'), 'filter: order limit message');
  await page.fill(R + '.fd-ord', '4');
  await page.selectOption(R + '.fd-fam', 'cheby1'); await page.waitForTimeout(80);
  { const f = await facts(); check((await big()) === 'Chebyshev I (1 dB ripple) low-pass, order 4' && f.includes('cut-off−1 dB') && f.includes('−38.27 dB') && f.includes('0.920988'), `filter: Chebyshev I order 4 (${f})`); }
  await page.fill(R + '.fd-rp', '20'); await page.waitForTimeout(80);
  check((await page.textContent(R + '.fd-err')).includes('ripple between 0 and 10 dB'), 'filter: ripple limit message');
  await page.fill(R + '.fd-rp', '1');
  for (const t of ['highpass', 'bandpass', 'bandstop']) { await page.selectOption(R + '.fd-type', t); await page.waitForTimeout(60); check((await facts()).includes('Stableyes'), `filter: Chebyshev ${t} stable`); }
  check((await big()).includes('(8 poles)'), 'filter: band filters double the poles');
  for (const p of ['lin', 'phase', 'gd', 'db']) { await page.selectOption(R + '.fd-plot', p); await page.waitForTimeout(50); }
  await page.selectOption(R + '.fd-floor', '-160'); await page.waitForTimeout(50);
  check(/group delay|gain/i.test(await page.getAttribute(R + '.fd-rfig', 'aria-label')), 'filter: plot options');
  await page.fill(R + '.fd-e1', '600'); await page.waitForTimeout(60);
  check((await page.textContent(R + '.fd-err')).includes('below 500 Hz') || (await page.textContent(R + '.fd-err')).includes('between 0 and 500 Hz'), 'filter: edge above Nyquist message');
  await page.fill(R + '.fd-e1', '100'); await page.fill(R + '.fd-fs', ''); await page.waitForTimeout(60);
  check((await page.textContent(R + '.fd-err')).includes('Give the sample rate'), 'filter: missing sample rate message');
  await page.fill(R + '.fd-fs', '1000'); await page.waitForTimeout(60);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=pdf]')]); check(/\.pdf$/.test(d.suggestedFilename()), 'filter: report PDF download'); }
};
