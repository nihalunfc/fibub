// #630 Sampling and aliasing explorer
export const path = '/science/aliasing-demo/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.ald ';
  const big = () => page.textContent(R + '.al-big');
  const facts = () => page.textContent(R + '.al-facts');
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  check((await big()) === '70 Hz looks like 30 Hz', 'aliasing: example 70 Hz at 100 Hz');
  { const f = await facts(); check(f.includes('Nyquist frequency50 Hz') && f.includes('Signed alias−30 Hz') && f.includes('Nyquist zone2') && f.includes('more than 140 Hz') && f.includes('0.714'), `aliasing: example facts`); }
  const pre = async (v) => { await page.selectOption(R + '.al-pre', v); await page.waitForTimeout(100); };
  await pre('23,24,0'); check((await big()) === '23 Hz looks like 1 Hz' && (await facts()).includes('Signed alias−1 Hz'), 'aliasing: wagon wheel backwards');
  await pre('30000,44100,0'); check((await big()) === '30 kHz looks like 14.1 kHz' && (await facts()).includes('Nyquist frequency22.05 kHz'), 'aliasing: 30 kHz in CD audio');
  await pre('60,50,0'); check((await big()) === '60 Hz looks like 10 Hz' && (await facts()).includes('Nyquist zone3'), 'aliasing: hum at 50 Hz sampling, zone 3');
  await pre('30,100,0'); check((await big()) === '30 Hz is recorded as 30 Hz: no aliasing' && (await facts()).includes('Nyquist zone1'), 'aliasing: no aliasing below Nyquist');
  await pre('50,100,90'); check((await big()).includes('exactly on the Nyquist frequency') && (await facts()).includes('amplitude unreliable'), 'aliasing: edge case');
  await pre('70,100,0');
  // Slider.
  await page.locator(R + '.al-slide').fill('130'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.al-f')) === '130' && (await big()) === '130 Hz looks like 30 Hz' && (await facts()).includes('Signed alias+30 Hz'), 'aliasing: slider to 130 Hz');
  await page.fill(R + '.al-f', '70'); await page.waitForTimeout(80);
  check((await page.inputValue(R + '.al-slide')) === '70', 'aliasing: typed frequency moves the slider');
  for (const n of ['10', '40', '80']) { await page.selectOption(R + '.al-n', n); await page.waitForTimeout(60); check((await page.getAttribute(R + '.al-tfig', 'aria-label')).includes(`${n} samples`), `aliasing: ${n} samples shown`); }
  await page.check(R + '.al-sinc'); await page.waitForTimeout(150);
  check(await page.isVisible(R + '.al-tfig'), 'aliasing: sinc reconstruction drawn');
  await page.fill(R + '.al-ph', '45'); await page.waitForTimeout(60);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.al-csv')]); const f = OUT + 'alias.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 82 && rows[0] === 'n,time_s,sample,alias_at_sample' && rows.slice(1).every((r) => { const c = r.split(',').map(Number); return Math.abs(c[2] - c[3]) < 1e-8; }), 'aliasing: samples CSV, alias equal at every sample'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=docx]')]); check(/\.docx$/.test(d.suggestedFilename()), 'aliasing: Word download'); }
  await page.fill(R + '.al-fs', '0'); await page.waitForTimeout(60);
  check((await page.textContent(R + '.al-err')).includes('Give the sample rate') && await page.isHidden(R + '.al-out'), 'aliasing: bad sample rate message');
  await page.fill(R + '.al-fs', '100'); await page.fill(R + '.al-f', '-5'); await page.waitForTimeout(60);
  check((await page.textContent(R + '.al-err')).includes('signal frequency'), 'aliasing: bad frequency message');
  await page.fill(R + '.al-f', '70'); await page.fill(R + '.al-ph', 'x'); await page.waitForTimeout(60);
  check((await page.textContent(R + '.al-err')).includes('phase'), 'aliasing: bad phase message');
};
