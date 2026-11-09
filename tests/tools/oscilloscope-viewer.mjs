// #979 Oscilloscope CSV viewer
export const path = '/science/oscilloscope-viewer/';
export default async ({ page, check, OUT, BASE, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/oscilloscope-viewer/`); await page.waitForTimeout(1000);
  const t = (c) => page.textContent('.osc ' + c), wait = () => page.waitForTimeout(250);
  check((await t('.os-parse')).startsWith('4,000 samples, 2 channels, every 1 µs (from the time column); 3 header'), 'scope: example parsed, settings lines skipped');
  check((await t('.os-big')) === 'CH1: 999.99 Hz, rise 21.9 µs, 3.408 V peak to peak', 'scope: example headline');
  check((await t('.os-phase')) === 'CH2 lags CH1 by 41.39° at the fundamental (over 3 whole periods); between 50 % rising edges the delay is 118.2 µs, that is 42.53°.', 'scope: phase between channels');
  { const tab = await t('.os-tab'); check(tab.includes('21.8 µs') && tab.includes('50 %') && tab.includes('707.1 mV') && tab.includes('299 µs') && tab.includes('4 / 4') && tab.includes('1 ms'), 'scope: measurement table'); }
  check(await page.isVisible('.osc .os-fig1') && await page.isVisible('.osc .os-fig2'), 'scope: trace and edge plots');
  await page.selectOption('.osc .os-lv', '20'); await wait();
  check((await t('.os-big')).includes('rise 13.8 µs'), 'scope: 20 to 80 % levels');
  await page.selectOption('.osc .os-lv', '10'); await page.selectOption('.osc .os-a', '1'); await wait();
  check((await t('.os-big')).startsWith('CH2: 1 kHz') && (await t('.os-phase')).includes('Choose another channel'), 'scope: measure the other channel');
  await page.selectOption('.osc .os-b', '0'); await wait();
  check((await t('.os-phase')).startsWith('CH1 leads CH2 by 41.4'), 'scope: phase the other way round');
  await page.selectOption('.osc .os-a', '0'); await page.selectOption('.osc .os-b', '1'); await page.fill('.osc .os-t1', '0'); await page.fill('.osc .os-t2', '0.0008'); await wait();
  check((await t('.os-big')).startsWith('CH1: fewer than two full cycles'), 'scope: time window');
  await page.fill('.osc .os-t2', 'x'); await wait();
  check((await t('.os-err')).includes('time window'), 'scope: bad window message');
  await page.fill('.osc .os-t1', ''); await page.fill('.osc .os-t2', ''); await page.fill('.osc .os-h', '60'); await wait();
  check((await t('.os-err')).includes('hysteresis'), 'scope: bad hysteresis message');
  await page.fill('.osc .os-h', '5'); await wait();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.osc .os-csv')]); const f = OUT + 'os.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r[0] === 'measurement,CH1,CH2' && r.length === 16 && r[1].startsWith('Frequency,999.99 Hz'), 'scope: measurements CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.osc .dl button[data-f=pdf]')]); check((await d.suggestedFilename()) === 'scope-measurements.pdf', 'scope: PDF report'); }
  // A one-column file with a sample interval: a 10 kHz square wave sampled every 1 µs.
  writeFileSync(OUT + 'sq.csv', 'Volts\n' + Array.from({ length: 1000 }, (_, i) => ((i % 100) < 30 ? 5 : 0)).join('\n'));
  await page.setInputFiles('.osc .dfb-in', OUT + 'sq.csv'); await page.waitForTimeout(800);
  check((await t('.os-err')).includes('sample interval'), 'scope: asks for a sample interval');
  await page.fill('.osc .os-dt', '1e-6'); await wait();
  check((await t('.os-big')).startsWith('Volts: 10 kHz') && (await t('.os-tab')).includes('30 %'), 'scope: one column with a sample interval, duty cycle');
  await page.click('.osc .os-ex'); await page.waitForTimeout(800);
  check((await t('.os-big')) === 'CH1: 999.99 Hz, rise 21.9 µs, 3.408 V peak to peak', 'scope: example button');
  await page.fill('.osc .os-in', 'nothing here'); await page.waitForTimeout(600);
  check((await t('.os-err')).includes('No block of at least 4 rows'), 'scope: not a scope file message');
};
