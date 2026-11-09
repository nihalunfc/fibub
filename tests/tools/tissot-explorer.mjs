// #894 Tissot explorer
export const path = '/science/tissot-explorer/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.tsx ', big = () => page.textContent(R + '.ts-big'), facts = () => page.textContent(R + '.ts-facts'), wait = (ms = 400) => page.waitForTimeout(ms);
  const row = (name) => page.$$eval(R + '.ts-tab tr', (r, n) => (r.map((x) => Array.from(x.children, (c) => c.textContent)).find((c) => c[0] === n) || []).join('|'), name);
  await page.goto(`${BASE}${path}`); await wait(1200);
  check((await big()) === '60° N, 30° E: area × 4.000, ω 0.00°', `tissot: Mercator at 60° N (${await big()})`);
  { const f = await facts(); check(f.includes('2.0000') && f.includes('areas shown 4.00 × too big') && f.includes('a 2.0000, b 2.0000') && f.includes('100.00 %'), 'tissot: h = k = 2, area ×4, scale error 100 %'); }
  check((await row('Mollweide')) === 'Mollweide|0.9220|1.1652|1.0000|25.68' && (await row('Sinusoidal')) === 'Sinusoidal|1.0980|1.0000|1.0000|25.55' && (await row('Lambert conformal conic')).endsWith('|0.00'), 'tissot: comparison table (equal-area rows s = 1, conformal ω = 0)');
  check(await page.$eval(R + '.ts-tab tr.ts-cur td', (e) => e.textContent) === 'Mercator', 'tissot: current projection in bold');
  check(await page.isHidden(R + '.ts-p-lat1') && await page.isHidden(R + '.ts-p-lat0'), 'tissot: Mercator hides parallels');
  // Each projection draws and gives numbers at the point.
  for (const id of ['tmerc', 'eqc', 'lcc', 'aea', 'aeqd', 'laea', 'stere', 'ortho', 'moll', 'sinu']) {
    await page.selectOption(R + '.ts-proj', id); await wait(300);
    const b = await big(), ok = /^60° N, 30° E: area × [\d.]+, ω [\d.]+°$/.test(b);
    const painted = await page.$eval(R + '.ts-fig', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (x[i] !== x[0] || x[i + 1] !== x[1]) n++; return n; });
    check(ok && painted > 1000, `tissot: ${id} draws and reads the point (${b})`);
  }
  await page.selectOption(R + '.ts-proj', 'laea'); await wait();
  check((await big()).startsWith('60° N, 30° E: area × 1.000,') && !(await page.isHidden(R + '.ts-p-lat0')) && (await page.textContent(R + '.ts-lat0-l')) === 'Centre latitude (°)', 'tissot: Lambert azimuthal equal-area keeps area; centre latitude shown');
  await page.selectOption(R + '.ts-proj', 'lcc'); await wait();
  await page.fill(R + '.ts-lat', '20'); await wait();
  check((await facts()).includes('1.0000') && (await big()) === '20° N, 30° E: area × 1.000, ω 0.00°', 'tissot: Lambert conic scale 1 on the standard parallel 20°');
  await page.fill(R + '.ts-lat2', '-20'); await wait();
  check((await page.textContent(R + '.ts-err')).includes('either side of the equator') && await page.isHidden(R + '.ts-out'), 'tissot: opposite parallels message');
  await page.fill(R + '.ts-lat2', '95'); await wait();
  check((await page.textContent(R + '.ts-err')).includes('second standard parallel'), 'tissot: bad parallel message');
  await page.fill(R + '.ts-lat2', '50'); await wait();
  await page.selectOption(R + '.ts-proj', 'eqc'); await wait();
  check((await page.textContent(R + '.ts-lat1-l')) === 'Latitude of true scale (°)' && await page.isHidden(R + '.ts-p-lat2'), 'tissot: equirectangular true-scale latitude');
  check((await facts()).includes('Scale along the meridian (h)1.0000'), 'tissot: equirectangular h = 1');
  await page.fill(R + '.ts-lon0', '200'); await wait();
  check((await page.textContent(R + '.ts-err')).includes('central meridian'), 'tissot: bad central meridian message');
  await page.fill(R + '.ts-lon0', '0'); await wait();
  // Orthographic: far side not shown.
  await page.selectOption(R + '.ts-proj', 'ortho'); await page.fill(R + '.ts-lat', '-40'); await page.fill(R + '.ts-lon', '170'); await wait();
  check((await page.textContent(R + '.ts-perr')).includes('outside the part of the Orthographic'), 'tissot: far side of the orthographic');
  await page.fill(R + '.ts-lat', '95'); await wait();
  check((await page.textContent(R + '.ts-perr')).includes('Latitude is from −90° to 90°'), 'tissot: bad latitude message');
  // Tap the map: Mercator, centre of the map = equator, scale 1.
  await page.selectOption(R + '.ts-proj', 'merc'); await page.fill(R + '.ts-lat', '60'); await page.fill(R + '.ts-lon', '30'); await wait();
  { const c = await page.$(R + '.ts-fig'); await c.evaluate((e) => e.scrollIntoView({ block: 'center' })); await wait(200); const b = await c.boundingBox();
    await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2); await wait();
    const lat = +(await page.inputValue(R + '.ts-lat')), lon = +(await page.inputValue(R + '.ts-lon'));
    check(Math.abs(lat) < 3 && Math.abs(lon) < 3 && /area × 1\.00\d/.test(await big()), `tissot: tap the map centre reads the equator (${lat}, ${lon})`); }
  // Options.
  for (const [s, v] of [['.ts-grid', '15'], ['.ts-size', '7'], ['.ts-col', 'omega'], ['.ts-col', 'none']]) { await page.selectOption(R + s, v); await wait(200); }
  check((await page.textContent(R + '.ts-legend')) === '' , 'tissot: one colour has no legend');
  await page.selectOption(R + '.ts-col', 'omega'); await wait();
  check((await page.textContent(R + '.ts-legend')).startsWith('Angular distortion ω:'), 'tissot: ω legend');
  await page.click(R + '.ts-land'); await page.click(R + '.ts-grat'); await wait();
  check(!(await page.isHidden(R + '.ts-out')), 'tissot: land and graticule switches');
  await page.click(R + '.ts-land'); await page.click(R + '.ts-grat'); await page.selectOption(R + '.ts-grid', '30'); await page.selectOption(R + '.ts-size', '5'); await page.selectOption(R + '.ts-col', 'area');
  // Downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ts-csv')]); const f = OUT + 'tissot.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n');
    const r60 = t.find((l) => l.startsWith('60,0,')).split(',');
    check(t[1] === 'lat,lon,x,y,h,k,areal_scale,a,b,omega_deg' && t.length === 2 + 11 * 23 && Math.abs(+r60[4] - 2) < 1e-8 && Math.abs(+r60[6] - 4) < 1e-7 && d.suggestedFilename() === 'tissot-merc.csv', 'tissot: grid CSV (Mercator 60°: h 2, area 4)'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=pdf]')]); const f = OUT + 'tissot.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'tissot: PDF report'); }
};
