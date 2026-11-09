// #760 Catchment buffers: the made-up town, distances, walkability types, GeoJSON polygons, files, downloads and
// bad input messages.
export const path = '/science/catchment-buffer/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(BASE + path);
  const until = async (fn, ok) => { let v; for (let i = 0; i < 80; i++) { v = await fn(); if (ok(v)) return v; await page.waitForTimeout(100); } return v; };
  await page.waitForSelector('.cb-out:not([hidden])');
  const big = () => page.innerText('.cb-big'), facts = () => page.innerText('.cb-facts'), err = () => page.innerText('.cb-err');
  const drawn = (part) => page.waitForFunction((p) => (document.querySelector('.cb-fig').getAttribute('aria-label') || '').includes(p), part);
  const wait = async (fn) => { await page.waitForTimeout(400); return fn(); };
  check((await big()) === '41.3 % of people live within 1,000 m of a facility (straight line)', `catchment: example headline (${await big()})`);
  check((await page.innerText('.cb-warn')).includes('not along roads'), 'catchment: straight-line warning shown');
  const f = await facts();
  check(f.includes('14,120 in 70 places') && f.includes('1,307 m') && f.includes('1,211 m') && f.includes('2,415 m'), 'catchment: people, mean, median and 90 % distance');
  const fac = await page.$$eval('.cb-fac tbody tr', (r) => r.map((x) => [...x.cells].map((c) => c.textContent)));
  check(fac[0].join('|') === 'Clinic North|2,040|14.4 %|4,317|30.6 %', `catchment: Clinic North row (${fac[0].join('|')})`);
  const cov = await page.$$eval('.cb-cov tbody tr', (r) => r.map((x) => x.cells[0].textContent + '=' + x.cells[2].textContent));
  check(cov.join(',') === '500 m=14.9 %,1,000 m=41.3 %,1,500 m=66.7 %,2,000 m=79.0 %', `catchment: coverage table (${cov.join(',')})`);
  check((await page.$$('.cb-types input')).length === 5 && f.includes('Walkability score'), 'catchment: 5 amenity types found, walkability shown');
  await drawn('1,000 m circles');

  // Walkability with three types at 800 m (the maths test's case).
  for (const t of ['pharmacy', 'bus stop']) await page.uncheck(`.cb-types input[data-t="${t}"]`);
  await page.waitForTimeout(200);
  const wRows = await page.$$eval('.cb-walk tbody tr', (r) => r.map((x) => x.cells[0].textContent));
  check(wRows.join(',') === 'grocery,park,school,All ticked types', `catchment: walkability table follows ticked types (${wRows.join(',')})`);
  await page.fill('.cb-r', '1500'); await drawn('1,500 m circles');
  check((await big()).startsWith('66.7 %'), `catchment: 1,500 m catchment (${await big()})`);
  await page.fill('.cb-r', '0');
  check((await until(err, (v) => v.includes('catchment distance'))).includes('catchment distance'), 'catchment: zero distance refused');
  await page.fill('.cb-r', '1000'); await page.fill('.cb-list', '500, abc');
  check((await until(err, (v) => v.includes('Also report within'))).includes('Also report within'), 'catchment: bad distance list refused');
  await page.fill('.cb-list', '500, 1500, 2000');

  // Downloads.
  await page.waitForSelector('.cb-out:not([hidden])');
  const dl = async (sel) => { const [d] = await Promise.all([page.waitForEvent('download'), page.click(sel)]); const p = OUT + d.suggestedFilename(); await d.saveAs(p); return { name: d.suggestedFilename(), p }; };
  const p1 = await dl('.cb-pcsv'), pr = readFileSync(p1.p, 'utf8').trim().split('\n');
  check(p1.name === 'catchment-people.csv' && pr.length === 71 && pr[0] === 'name,lat,lon,population,nearest_facility,distance_m,walk_score,amenities_within' && /^Block 1,.*,Clinic East,2164\.5,/.test(pr[1]), `catchment: people CSV (${pr[1]})`);
  const f1 = await dl('.cb-fcsv'), fr = readFileSync(f1.p, 'utf8').trim().split('\n');
  check(fr.length === 5 && fr[1].endsWith(',2040,4317'), `catchment: facilities CSV (${fr[1]})`);
  const w1 = await dl('.dl button[data-f="docx"]');
  check(w1.name === 'catchment-buffers.docx' && readFileSync(w1.p).subarray(0, 2).toString() === 'PK', 'catchment: Word report');

  // No amenities: walkability goes away.
  await page.click('.cb-box[data-k="a"] .cb-clear');
  await page.waitForTimeout(200);
  check(!(await page.isVisible('.cb-ww')) && !(await facts()).includes('Walkability'), 'catchment: walkability hidden without amenities');

  // GeoJSON polygons for people, opened from a file.
  const sq = (lon, lat, d) => [[[lon, lat], [lon + d, lat], [lon + d, lat + d], [lon, lat + d], [lon, lat]]];
  const gj = { type: 'FeatureCollection', features: [
    { type: 'Feature', properties: { name: 'Near', population: 300 }, geometry: { type: 'Polygon', coordinates: sq(9.999, 49.999, 0.002) } },
    { type: 'Feature', properties: { name: 'Far', population: 100 }, geometry: { type: 'Polygon', coordinates: sq(10.1, 50.1, 0.002) } },
  ] };
  writeFileSync(OUT + 'people.geojson', JSON.stringify(gj));
  await page.fill('.cb-f', 'name,lat,lon\nHub,50.0,10.0');
  await page.setInputFiles('.cb-box[data-k="p"] .cb-file', OUT + 'people.geojson');
  await page.waitForFunction(() => document.querySelector('.cb-box[data-k="p"] .cb-note').textContent.includes('people.geojson'));
  await page.waitForTimeout(400);
  check((await big()).startsWith('75.0 %') && (await page.innerText('.cb-foot')).includes('Polygons are counted at their centre'), `catchment: GeoJSON polygons by centroid (${await big()})`);
  await page.fill('.cb-p', '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"name":"x"},"geometry":{"type":"Point","coordinates":[10,50]}}]}');
  check((await until(err, (v) => v.includes('no population property'))).includes('no population property'), 'catchment: GeoJSON without population refused');
  await page.fill('.cb-p', '{"type": "Feat');
  check((await until(err, (v) => v.includes('could not be read'))).includes('could not be read'), 'catchment: broken GeoJSON refused');
  await page.fill('.cb-p', 'name,lat,lon,population\nA,95,10,5');
  check((await until(err, (v) => v.includes('latitude must be −90 to 90'))).includes('latitude must be −90 to 90'), 'catchment: impossible latitude refused');
  await page.fill('.cb-p', 'name,lat,lon,population\nA,50,10,-5');
  check((await until(err, (v) => v.includes('zero or more'))).includes('zero or more'), 'catchment: negative population refused');
  await page.fill('.cb-p', '50.001 10.0 120\n50.02 10.0 80');
  check((await until(big, (v) => v.startsWith('60.0 %'))).startsWith('60.0 %'), `catchment: rows without a header (${await big()})`);
  await page.fill('.cb-f', '');
  check((await until(err, (v) => v.includes('at least one facility'))).includes('at least one facility'), 'catchment: no facilities refused');
};
