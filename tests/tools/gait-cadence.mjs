// #491 gait and cadence analyser
export const path = '/science/gait-cadence/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/gait-cadence/`); await page.waitForTimeout(700);
  const R = '.gc ', big = () => page.textContent(R + '.gc-big'), facts = () => page.textContent(R + '.gc-facts');
  check((await page.textContent(R + '.gc-med')).includes('not medical advice'), 'gait: medical line');
  check((await big()) === 'Cadence 111.2 steps/min', 'gait: example cadence (scipy find_peaks 37 steps, 111.2255)');
  { const f = await facts(); check(f.includes('Steps found37') && f.includes('539 ms') && f.includes('15.5 ms') && f.includes('2.87 %') && f.includes('1080 ms') && f.includes('2.29 %') && f.includes('1.855 Hz = 111.3 steps/min') && f.includes('50 samples/s'), 'gait: step and stride times, CV, spectrum'); }
  check((await page.textContent(R + '.gc-note')).includes('agree') && await page.isVisible(R + '.gc-f1') && await page.isVisible(R + '.gc-f2') && await page.isVisible(R + '.gc-f3'), 'gait: three charts, methods agree');
  // settings (values from scipy on the same data)
  await page.fill(R + '.gc-fc', '4'); await page.fill(R + '.gc-ms', '0.35'); await page.fill(R + '.gc-k', '0.8'); await page.waitForTimeout(500);
  check((await facts()).includes('3.25 %'), 'gait: other settings (scipy CV 3.2547 %)');
  await page.fill(R + '.gc-k', '4.9'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.gc-err')).includes('too few') && await page.isHidden(R + '.gc-out'), 'gait: threshold too high message');
  await page.fill(R + '.gc-k', '0.5'); await page.fill(R + '.gc-fc', '40'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.gc-err')).includes('half the sampling rate'), 'gait: cut-off above Nyquist message');
  await page.fill(R + '.gc-fc', '3'); await page.fill(R + '.gc-ms', '0.3'); await page.waitForTimeout(500);
  // downloads
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.gc-csv')]); const f = OUT + 'gait.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 38 && rows[0] === 'step,time_s,step_time_s,filtered_peak_m_s2' && rows[1].startsWith('1,0.12,,'), `gait: steps CSV (${rows[1]})`); }
  for (const f of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl button[data-f=${f}]`)]); check(d.suggestedFilename().endsWith('.' + f), `gait: ${f} download`); }
  // a CSV file with millisecond times and irregular sampling: 2.2 steps a second for 12 s at about 100 Hz
  { const lines = ['time_ms;x;y;z']; let t = 5000; for (let i = 0; i < 1200; i++) { t += 10 + ((i * 7) % 5) - 2; const s = t / 1000; lines.push(`${t};0.1;0.2;${(9.81 + 3 * Math.sin(2 * Math.PI * 2.2 * s)).toFixed(4)}`); } writeFileSync(OUT + 'gait-ms.csv', lines.join('\n')); }
  await page.setInputFiles(R + '.dfb-in', OUT + 'gait-ms.csv'); await page.waitForTimeout(800);
  { const b = await big(); const c = Number(b.match(/[\d.]+/)[0]); check(Math.abs(c - 132) < 0.6 && (await page.textContent(R + '.gc-note')).includes('milliseconds'), `gait: opened CSV in ms, 2.2 Hz -> 132 steps/min (${b})`); }
  // bad input
  await page.fill(R + '.gc-in', 't,ax,ay,az\n0,1,2'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.gc-err')).includes('4 numbers'), 'gait: bad row message');
  // recording, with a mocked devicemotion stream at 1.8 steps a second
  await page.locator(R + '.gc-start').scrollIntoViewIfNeeded(); await page.click(R + '.gc-start'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.gc-rerr')).includes('not allowed') && await page.isDisabled(R + '.gc-stop'), 'gait: motion permission refused message');
  await page.context().grantPermissions(['accelerometer', 'gyroscope'], { origin: BASE });
  await page.click(R + '.gc-start'); await page.waitForTimeout(200);
  await page.evaluate(async () => {
    const t0 = performance.now();
    while (performance.now() - t0 < 7000) {
      const s = (performance.now() - t0) / 1000;
      window.dispatchEvent(new DeviceMotionEvent('devicemotion', { accelerationIncludingGravity: { x: 0.2, y: 0.1, z: 9.81 + 2.5 * Math.sin(2 * Math.PI * 1.8 * s) }, interval: 16 }));
      await new Promise((r) => setTimeout(r, 16));
    }
  });
  check((await page.textContent(R + '.gc-rec')).includes('Recording'), 'gait: recording status shown');
  await page.click(R + '.gc-stop'); await page.waitForTimeout(600);
  { const b = await big(); const c = Number(b.match(/[\d.]+/)[0]); check(Math.abs(c - 108) < 4 && (await page.textContent(R + '.gc-rec')).startsWith('Recorded') && (await page.inputValue(R + '.gc-in')).startsWith('t,ax,ay,az\n0.0000,'), `gait: mocked devicemotion recording, 1.8 Hz -> about 108 steps/min (${b})`); }
  // no readings at all
  await page.click(R + '.gc-start'); await page.waitForTimeout(300); await page.click(R + '.gc-stop'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.gc-rerr')).includes('No motion readings'), 'gait: no sensor message');
};
