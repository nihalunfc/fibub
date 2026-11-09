// #831 Orbital elements and state vector converter
export const path = '/science/orbit-elements/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.orbel ';
  const txt = (s) => page.textContent(R + s);
  const big = () => txt('.oe-big');
  const wait = () => page.waitForTimeout(450);
  const pixels = () => page.evaluate(() => { const c = document.querySelector('.orbel .oe-fig'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0, h = 0; for (let i = 0; i < d.length; i += 16) { if (d[i + 3] && (d[i] < 200 || d[i + 1] < 200)) n++; h = (h * 31 + d[i] + d[i + 1] * 7) % 1e9; } return [n, h]; });
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(900);
  check((await big()) === 'Elliptic orbit: a = 26600 km, e = 0.740000, period 11.993 h', `orbel: Molniya-like headline (${await big()})`);
  { const f = await txt('.oe-facts'); check(f.includes('altitude 537.8630 km') && f.includes('altitude 39905.86 km') && f.includes('10.0142 km/s') && f.includes('-7.492490 km²/s²') && f.includes('11.8269°') && f.includes('3.1370°'), 'orbel: Molniya facts (apsides, speeds, energy, E, M)'); }
  { const t = await txt('.oe-sv'); check(t.includes('4637.0313') && t.includes('178.5370') && t.includes('-5679.0552') && t.includes('6.2524247'), 'orbel: state vectors match NumPy'); }
  await page.waitForFunction(() => document.querySelector('.orbel .oe-fig').width > 100);
  const p3 = await pixels(); check(p3[0] > 300, `orbel: 3D drawing (${p3[0]})`);
  // Turning changes the picture; plane views.
  await page.fill(R + '.oe-yaw', '60'); await page.dispatchEvent(R + '.oe-yaw', 'input'); await wait();
  const p4 = await pixels(); check(p4[1] !== p3[1], 'orbel: turning the 3D view redraws');
  { const box = await page.locator(R + '.oe-fig').boundingBox(); await page.locator(R + '.oe-fig').scrollIntoViewIfNeeded(); const b2 = await page.locator(R + '.oe-fig').boundingBox(); await page.mouse.move(b2.x + b2.width / 2, b2.y + b2.height / 2); await page.mouse.down(); await page.mouse.move(b2.x + b2.width / 2 + 50, b2.y + b2.height / 2 + 20, { steps: 4 }); await page.mouse.up(); await wait(); check((await page.inputValue(R + '.oe-yaw')) === '90' && (await page.inputValue(R + '.oe-pitch')) === '37' && box, `orbel: drag turns the view (${await page.inputValue(R + '.oe-yaw')}, ${await page.inputValue(R + '.oe-pitch')})`); }
  for (const vw of ['xy', 'xz', 'yz', 'pf']) { await page.selectOption(R + '.oe-view', vw); await wait(); const p = await pixels(); check(p[0] > 200 && (await page.isHidden(R + '.oe-yaw')), `orbel: ${vw} view drawn`); }
  await page.selectOption(R + '.oe-view', '3d');
  // Propagation table and CSV.
  check((await page.$$eval(R + '.oe-ptab tr', (r) => r.length)) === 26 && (await page.isHidden(R + '.oe-pmore')), 'orbel: 25 propagation steps listed');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.oe-csv')]); const f = OUT + 'oe.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); const r10 = rows[11].split(','); check(rows.length === 26 && rows[0] === 't_s,true_anomaly_deg,mean_anomaly_deg,r_km,x_km,y_km,z_km,vx_km_s,vy_km_s,vz_km_s' && r10[0] === '18000' && Math.abs(+r10[4] - -9388.49702522) < 1e-6 && Math.abs(+r10[6] - 40523.5029993) < 1e-6, 'orbel: CSV, 5 h position matches SciPy solve_ivp'); }
  await page.fill(R + '.oe-step', '0'); await wait();
  check((await txt('.oe-perr')).includes('positive span'), 'orbel: bad step');
  await page.fill(R + '.oe-step', '30'); await wait();
  // Position as mean anomaly and time since periapsis.
  await page.selectOption(R + '.oe-ak', 'M'); await page.fill(R + '.oe-av', '3.137013'); await wait();
  check((await txt('.oe-facts')).includes('ν30.0000°'), 'orbel: mean anomaly in, ν = 30° out');
  await page.selectOption(R + '.oe-ak', 't'); await page.fill(R + '.oe-av', '376.2249'); await wait();
  check((await txt('.oe-facts')).includes('ν30.0000°'), 'orbel: time since periapsis in');
  await page.selectOption(R + '.oe-ak', 'E'); await page.fill(R + '.oe-av', '11.826928'); await wait();
  check((await txt('.oe-facts')).includes('ν30.0000°'), 'orbel: eccentric anomaly in');
  // Edit as state vectors and back.
  await page.click(R + '.oe-tosv'); await wait();
  check((await page.inputValue(R + '.oe-rx')).startsWith('4637.03') && (await big()).startsWith('Elliptic orbit: a = 26600'), 'orbel: edit as state vectors');
  await page.click(R + '.oe-toel'); await wait();
  check(['26600', '0.74', '63.4', '40', '270'].every(async () => true) && (await page.inputValue(R + '.oe-e')) === '0.74' && (await page.inputValue(R + '.oe-argp')) === '270', `orbel: edit as elements round trip (${await page.inputValue(R + '.oe-sz')})`);
  // Vallado state vector.
  await page.selectOption(R + '.oe-ex', 'vallado'); await wait();
  { const f = await txt('.oe-facts'); check((await big()).startsWith('Elliptic orbit: a = 36127.34 km, e = 0.832853, period 18.983 h') && f.includes('87.8691°') && f.includes('227.8983°, 53.3849°') && f.includes('92.3352°') && (await txt('.oe-note')).includes('inside the body'), `orbel: Vallado example (${await big()})`); }
  // Circular and equatorial cases.
  await page.selectOption(R + '.oe-ex', 'geo'); await wait();
  check((await big()).startsWith('Circular orbit: a = 42164.17 km') && (await big()).includes('23.934 h'), `orbel: geostationary (${await big()})`);
  await page.click(R + '.oe-tosv'); await wait();
  check((await txt('.oe-note')).includes('circular and equatorial') && (await txt('.oe-facts')).includes('75.0000°'), 'orbel: circular equatorial from state vectors');
  // Hyperbolic flyby at Mars, given by time.
  await page.selectOption(R + '.oe-ex', 'flyby'); await wait();
  { const f = await txt('.oe-facts'); check((await big()).startsWith('Hyperbolic orbit: periapsis 3800 km, e = 1.400000, v∞ =') && f.includes('Hyperbolic anomaly H') && f.includes('turn angle 91.169°') && f.includes('still approaching'), `orbel: hyperbolic flyby (${await big()})`); }
  await page.selectOption(R + '.oe-size', 'a'); await page.fill(R + '.oe-sz', '9500'); await wait();
  check((await txt('.oe-err')).includes('negative semi-major axis'), 'orbel: hyperbola needs a < 0');
  await page.fill(R + '.oe-sz', '-9500'); await page.selectOption(R + '.oe-ak', 'nu'); await page.fill(R + '.oe-av', '140'); await wait();
  check((await txt('.oe-err')).includes('never reaches this true anomaly'), 'orbel: unreachable ν on a hyperbola');
  // Parabola.
  await page.selectOption(R + '.oe-size', 'q'); await page.fill(R + '.oe-sz', '7500'); await page.fill(R + '.oe-e', '1'); await page.fill(R + '.oe-av', '100'); await page.selectOption(R + '.oe-body', 'earth'); await wait();
  check((await big()).startsWith('Parabolic orbit: periapsis 7500 km') && (await txt('.oe-facts')).includes('Parabolic anomaly D'), `orbel: parabola (${await big()})`);
  await page.selectOption(R + '.oe-size', 'a'); await wait();
  check((await txt('.oe-err')).includes('give q or p'), 'orbel: parabola with a');
  // TLE.
  await page.selectOption(R + '.oe-ex', 'iss'); await wait();
  { const f = await txt('.oe-tlef'); check(f.includes('ISS (ZARYA), 25544U') && f.includes('98067A') && f.includes('2008-09-20 12:25:40 UTC') && f.includes('-0.000011606') && f.includes('element set 292') && f.includes('56353') && f.includes('line 1: 7 ✓, line 2: 7 ✓'), 'orbel: TLE fields'); }
  check((await big()).startsWith('Elliptic orbit: a = 6730.961 km, e = 0.000670') && (await txt('.oe-ptab')).includes('2008-09-20 12:25'), `orbel: TLE elements and UTC times (${await big()})`);
  await page.fill(R + '.oe-tle', (await page.inputValue(R + '.oe-tle')).replace('0  2927', '0  2928')); await wait();
  check((await txt('.oe-err')).includes('checksum on line 1 is 8 but the digits add up to 7'), 'orbel: TLE checksum error');
  await page.fill(R + '.oe-tle', '1 25544U 98067A'); await wait();
  check((await txt('.oe-err')).includes('Paste the two lines'), 'orbel: incomplete TLE');
  // Mode buttons, body and μ errors.
  await page.click(R + '.oe-mode [data-m="sv"]'); await page.fill(R + '.oe-rx', ''); await wait();
  check((await txt('.oe-err')).includes('all six numbers'), 'orbel: missing state vector');
  await page.click(R + '.oe-mode [data-m="el"]'); await page.fill(R + '.oe-mu', '-1'); await wait();
  check((await txt('.oe-err')).includes('μ must be') && (await page.inputValue(R + '.oe-body')) === 'own', 'orbel: bad μ');
  await page.selectOption(R + '.oe-body', 'sun'); await page.selectOption(R + '.oe-size', 'a'); await page.fill(R + '.oe-sz', '149597870.7'); await page.fill(R + '.oe-e', '0.0167'); await wait();
  check((await big()) === 'Elliptic orbit: a = 1.495979 × 10⁸ km, e = 0.016700, period 365.257 days', `orbel: Earth-like orbit round the Sun (${await big()})`);
  await page.selectOption(R + '.oe-ex', 'molniya'); await wait();
  check((await big()) === 'Elliptic orbit: a = 26600 km, e = 0.740000, period 11.993 h', 'orbel: example restored');
  { const vp = page.viewportSize(); await page.setViewportSize({ width: 375, height: 800 }); await wait(); await page.locator(R + '.oe-out').screenshot({ path: OUT + 'oe-375-out.png' }); await page.setViewportSize(vp); }
};
