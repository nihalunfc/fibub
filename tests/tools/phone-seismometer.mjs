// #885 phone seismometer
import { readSac } from '../../src/lib/sci/seisio.ts';
import { demo } from '../../src/lib/sci/phoneseis.ts';
export const path = '/science/phone-seismometer/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/phone-seismometer/`); await page.waitForTimeout(900);
  await page.evaluate(() => localStorage.removeItem('fibub-phoneseis-v1'));
  const R = '.phs ', wait = (ms = 500) => page.waitForTimeout(ms);
  check((await page.textContent(R + '.ps-toy')).includes('not an earthquake detector'), 'phone-seis: says it is a toy');
  check((await page.textContent(R + '.ps-big')) === 'PGA 0.314 m/s² (3.20 % g) on z', 'phone-seis: demo PGA');
  { const t = await page.textContent(R + '.ps-tab'); check(t.includes('0.1882') && t.includes('0.09402') && t.includes('3.17') && t.includes('12') && t.includes('21.06'), 'phone-seis: per-component PGA, time and dominant frequency'); }
  { const f = await page.textContent(R + '.ps-facts'); check(f.includes('0.378 m/s²') && f.includes('0.210 m/s²') && f.includes('29.98 s at 63 Hz') && f.includes('1,876 readings'), 'phone-seis: 3-D and horizontal peaks, rate'); }
  await page.fill(R + '.ps-lp', '5'); await wait();
  check((await page.textContent(R + '.ps-tab')).includes('0.1593') && (await page.textContent(R + '.ps-tab')).includes('3.14'), 'phone-seis: remove above 5 Hz drops the lorry');
  await page.fill(R + '.ps-lp', '40'); await wait();
  check((await page.textContent(R + '.ps-aerr')).includes('below half the sampling rate (31.5 Hz)'), 'phone-seis: lowpass above Nyquist refused');
  await page.fill(R + '.ps-lp', ''); await page.fill(R + '.ps-hp', 'abc'); await wait();
  check(await page.isVisible(R + '.ps-aerr'), 'phone-seis: bad highpass refused');
  await page.fill(R + '.ps-hp', '0.5'); await page.selectOption(R + '.ps-ord', '4'); await wait();
  check(await page.isHidden(R + '.ps-aerr') && (await page.textContent(R + '.ps-big')).startsWith('PGA 0.3'), 'phone-seis: order 4');
  await page.selectOption(R + '.ps-ord', '2'); await page.selectOption(R + '.ps-comp', '1'); await wait();
  check((await page.getAttribute(R + '.ps-spec', 'aria-label')) === 'Amplitude spectrum of y', 'phone-seis: spectrum of another component');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ps-csv')]); const f = OUT + 'ps.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 1891 && rows[0] === 'time_s,x_m_s2,y_m_s2,z_m_s2,x_clean,y_clean,z_clean' && rows[1].startsWith('0,0.1195'), `phone-seis: CSV (${rows.length} rows)`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ps-sac')]); const f = OUT + 'ps.sac'; await d.saveAs(f); const s = readSac(new Uint8Array(readFileSync(f))); check(s.fs === 63 && s.data.length === 1890 && s.sta === 'PHONE' && s.cha === 'HN2' && Math.abs(Math.max(...s.data.map(Math.abs)) - 0.09402) < 1e-4, 'phone-seis: SAC of y reads back'); }
  // Save in this browser, survive a reload, open, delete.
  await page.fill(R + '.ps-name', 'Kitchen table'); await page.click(R + '.ps-save'); await wait(300);
  check((await page.textContent(R + '.ps-smsg')).includes('Saved "Kitchen table"') && (await page.textContent(R + '.ps-list')).includes('Kitchen table'), 'phone-seis: saved in this browser');
  await page.reload(); await wait(900);
  check((await page.textContent(R + '.ps-list')).includes('Kitchen table') && (await page.textContent(R + '.ps-list')).includes('30 s'), 'phone-seis: saved recording listed after reload');
  await page.fill(R + '.ps-hp', '1'); await wait(); await page.click(R + '.ps-list button:text("Open")'); await wait();
  check((await page.textContent(R + '.ps-status')).includes('Saved recording "Kitchen table"') && (await page.textContent(R + '.ps-big')).includes('on z'), 'phone-seis: open a saved recording');
  await page.fill(R + '.ps-hp', '0.5'); await wait();
  check((await page.textContent(R + '.ps-big')) === 'PGA 0.314 m/s² (3.20 % g) on z', 'phone-seis: saved recording gives the same PGA (5 decimals kept)');
  await page.click(R + '.ps-list button:text("Delete")'); await wait(300);
  check(!(await page.textContent(R + '.ps-list')).includes('Kitchen') && (await page.evaluate(() => localStorage.getItem('fibub-phoneseis-v1'))) === null, 'phone-seis: delete removes it from storage');
  await page.click(R + '.ps-save'); await page.click(R + '.ps-clearall'); await wait(300);
  check((await page.evaluate(() => localStorage.getItem('fibub-phoneseis-v1'))) === null && (await page.textContent(R + '.ps-smsg')).includes('All saved recordings deleted'), 'phone-seis: delete all');
  // A CSV recording (time in ms).
  const d = demo();
  await page.click(R + '.ps-file summary');
  await page.fill(R + '.ps-text', 'time_ms,x,y,z\n' + d.t.slice(0, 700).map((t, i) => `${(t * 1000).toFixed(1)},${d.x[i]},${d.y[i]},${d.z[i]}`).join('\n')); await wait(700);
  check((await page.textContent(R + '.ps-status')).includes('Read 700 rows') && (await page.textContent(R + '.ps-facts')).includes('at 63 Hz'), 'phone-seis: CSV with times in ms');
  await page.fill(R + '.ps-text', '0.1 0.2 9.8\n'.repeat(40)); await wait(700);
  check((await page.textContent(R + '.ps-err')).includes('need the sampling rate'), 'phone-seis: three columns need a rate');
  await page.fill(R + '.ps-fsin', '20'); await wait(700);
  check((await page.textContent(R + '.ps-status')).includes('Read 40 rows at 20 Hz') && (await page.textContent(R + '.ps-facts')).includes('1.950 s at 20 Hz'), 'phone-seis: three columns at a typed rate');
  // Live recording with simulated motion events (50 a second).
  await page.context().grantPermissions(['accelerometer', 'gyroscope'], { origin: BASE });
  await page.click(R + '.ps-start'); await wait(100);
  check(await page.isEnabled(R + '.ps-stop') && await page.isDisabled(R + '.ps-start'), 'phone-seis: start enables Stop');
  await page.evaluate(() => new Promise((res) => { let k = 0; const id = setInterval(() => { const t = k / 50; window.dispatchEvent(new DeviceMotionEvent('devicemotion', { accelerationIncludingGravity: { x: 0.1, y: 0.05 * Math.sin(2 * Math.PI * 5 * t), z: 9.8 + 0.2 * Math.sin(2 * Math.PI * 5 * t) }, interval: 20 })); if (++k >= 100) { clearInterval(id); res(); } }, 20); }));
  check((await page.textContent(R + '.ps-status')).startsWith('Recording:') && await page.isVisible(R + '.ps-live'), 'phone-seis: live trace while recording');
  await page.click(R + '.ps-stop'); await wait();
  { const s = await page.textContent(R + '.ps-status'), t = await page.textContent(R + '.ps-tab'); const n = parseInt(s.match(/Recorded (\d+) readings/)?.[1] ?? '0'); const dom = [0, await page.textContent(R + '.ps-tab tr:nth-child(4) td:last-child')];
    check(n >= 95 && n <= 100 && (await page.isHidden(R + '.ps-live')), `phone-seis: recorded ${n} simulated readings`);
    check((await page.textContent(R + '.ps-facts')).includes('Phone recording') === false && dom && Math.abs(parseFloat(dom[1]) - 5) < 0.6, `phone-seis: simulated 5 Hz shaking found (${dom && dom[1]} Hz)`); }
  // No readings: a clear message.
  await page.click(R + '.ps-start'); await wait(3400);
  check((await page.textContent(R + '.ps-err')).includes('No motion readings') && await page.isEnabled(R + '.ps-start'), 'phone-seis: no accelerometer explained');
};
