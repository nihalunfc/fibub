// #866 phone clinometer
export const path = '/science/phone-clinometer/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/phone-clinometer/`); await page.waitForTimeout(800);
  await page.evaluate(() => localStorage.removeItem('fibub-clinometer-v1')); await page.reload(); await page.waitForTimeout(800);
  const R = '.pcl ', wait = (ms = 250) => page.waitForTimeout(ms), live = () => page.textContent(R + '.pc-live');
  check((await live()) === '—' && (await page.textContent(R + '.pc-hint')).includes('use the demo') && await page.isDisabled(R + '.pc-take') && await page.isHidden(R + '.pc-net'), 'clino: starts empty, waiting for the sensor or demo');
  await page.click(R + '.pc-demo summary'); await page.check(R + '.pc-use'); await wait();
  check((await live()) === 'Strike/dip 150/40.0' && await page.isEnabled(R + '.pc-take'), 'clino: demo angles 300/40/0 give strike/dip 150/40');
  await page.selectOption(R + '.pc-fmt', 'dd'); await wait();
  check((await live()) === 'Dip direction/dip 240/40.0', 'clino: dip direction format');
  await page.selectOption(R + '.pc-fmt', 'rhr'); await page.fill(R + '.pc-decl', '5'); await wait();
  check((await live()) === 'Strike/dip 155/40.0', 'clino: declination east adds 5°');
  await page.fill(R + '.pc-decl', '0'); await page.selectOption(R + '.pc-kind', 'line'); await wait();
  check((await live()) === 'Plunge → trend 40.0 → 240', 'clino: line along the long edge');
  // Slider: gamma raises the left edge.
  await page.selectOption(R + '.pc-kind', 'plane');
  await page.$eval(R + '.pc-b', (e) => { e.value = '0'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.$eval(R + '.pc-g', (e) => { e.value = '25'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await wait();
  check((await live()) === 'Strike/dip 060/25.0' && (await page.textContent(R + '.pc-go')) === '25', 'clino: gamma 25 with top at 060 dips 25° to 150');
  await page.fill(R + '.pc-ldd', '120'); await page.fill(R + '.pc-ldip', '35'); await page.click(R + '.pc-lay'); await wait();
  check((await live()) === 'Strike/dip 030/35.0' && (await page.inputValue(R + '.pc-a')) === '60', 'clino: set the angles for a plane');
  // Position by tap (simulated).
  await page.context().grantPermissions(['geolocation'], { origin: BASE }); await page.context().setGeolocation({ latitude: 45.123456, longitude: -66.5, accuracy: 8 });
  await page.click(R + '.pc-gps'); await wait(600);
  check((await page.textContent(R + '.pc-pos')).includes('45.12346, -66.50000 (±8 m) will be added'), 'clino: position on request');
  await page.fill(R + '.pc-note', 'bedding, site 4'); await page.click(R + '.pc-take'); await wait();
  await page.fill(R + '.pc-note', 'fold axis'); await page.selectOption(R + '.pc-kind', 'line'); await page.click(R + '.pc-take'); await wait();
  { const t = await page.textContent(R + '.pc-log'); check(t.includes('Plane 030/35.0') && t.includes('Line 35.0 → 120') && t.includes('45.12346, -66.50000') && t.includes('bedding, site 4') && (await page.textContent(R + '.pc-pos')).includes('added to that reading'), 'clino: two readings logged with note and position'); }
  check(await page.isVisible(R + '.pc-net'), 'clino: readings drawn on the net');
  check(!(await page.isChecked(R + '.pc-keep')) && (await page.evaluate(() => localStorage.getItem('fibub-clinometer-v1'))) === null, 'clino: nothing stored (positions included) before the remember box is ticked');
  await page.check(R + '.pc-keep'); await wait();
  check(JSON.parse(await page.evaluate(() => localStorage.getItem('fibub-clinometer-v1'))).length === 2, 'clino: ticking the box saves the log now');
  await page.reload(); await wait(800);
  check((await page.textContent(R + '.pc-log')).includes('Plane 030/35.0') && await page.isChecked(R + '.pc-keep'), 'clino: log kept in this browser after reload');
  await page.selectOption(R + '.pc-fmt', 'dd'); await wait();
  check((await page.textContent(R + '.pc-log')).includes('Plane 120/35.0'), 'clino: log follows the plane format');
  await page.selectOption(R + '.pc-fmt', 'rhr');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.pc-csv')]); const f = OUT + 'clino.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows.length === 3 && rows[0].startsWith('id,time_utc,type,strike_rhr,dip,dip_direction,trend,plunge,declination_deg') && /^1,[\dT:Z-]+,plane,30,35,120,,,0,0,1,45.123456,-66.5,8,"bedding, site 4",demo$/.test(rows[1]) && rows[2].includes(',line,,,,120,35,'), 'clino: log CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.pc-splanes')]); const f = OUT + 'clino-p.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 2 && rows[0].startsWith('#') && rows[1] === '030 35 # bedding, site 4', 'clino: planes file for the stereonet'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.pc-slines')]); const f = OUT + 'clino-l.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 2 && rows[1] === '35 120 # fold axis', 'clino: lines file for the stereonet'); }
  // The stereonet plotter reads the planes file as it is.
  const planes = readFileSync(OUT + 'clino-p.csv', 'utf8');
  await page.goto(`${BASE}/science/stereonet/`); await page.waitForTimeout(700);
  await page.fill('.sn .sn-planes', planes); await page.fill('.sn .sn-lines', readFileSync(OUT + 'clino-l.csv', 'utf8')); await page.waitForTimeout(500);
  check(await page.isHidden('.sn .sn-err'), 'clino: stereonet plotter takes both files without complaint');
  await page.goto(`${BASE}/science/phone-clinometer/`); await page.waitForTimeout(800);
  await page.click(R + '.pc-log button[aria-label="Delete reading 2"]'); await wait();
  check(!(await page.textContent(R + '.pc-log')).includes('Line') && await page.isDisabled(R + '.pc-slines'), 'clino: delete one reading');
  page.once('dialog', (d) => d.accept());
  await page.click(R + '.pc-clear'); await wait();
  check((await page.evaluate(() => localStorage.getItem('fibub-clinometer-v1'))) === null && await page.isHidden(R + '.pc-net'), 'clino: delete all clears storage');
  // Simulated sensor: absolute orientation events for one second.
  await page.uncheck(R + '.pc-use').catch(() => {});
  await page.context().grantPermissions(['accelerometer', 'gyroscope', 'magnetometer'], { origin: BASE });
  await page.click(R + '.pc-on'); await wait(200);
  const fire = () => page.evaluate(() => new Promise((res) => { let k = 0; const ev = 'ondeviceorientationabsolute' in window ? 'deviceorientationabsolute' : 'deviceorientation'; const id = setInterval(() => { const e = new DeviceOrientationEvent(ev, { alpha: 300 + 0.3 * Math.sin(k), beta: 40 + 0.2 * Math.cos(k), gamma: 0, absolute: true }); window.dispatchEvent(e); if (++k >= 70) { clearInterval(id); res(); } }, 20); }));
  await page.selectOption(R + '.pc-kind', 'plane');
  await Promise.all([fire(), (async () => { await wait(150); await page.click(R + '.pc-take'); })()]); await wait(1000);
  { const t = await page.textContent(R + '.pc-log'), sp = parseFloat(await page.textContent(R + '.pc-log tr:nth-child(2) td:nth-child(3)')); check(t.includes('Plane 150/40.0') && sp > 0 && sp < 1, `clino: one-second sensor average (spread ${sp}°)`); }
  page.once('dialog', (d) => d.accept()); await page.click(R + '.pc-clear');
};
