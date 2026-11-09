// #889 watershed delineation
import { TIF } from '../sci-tools/dem-terrain.mjs';
import { ringArea2 } from '../../src/lib/sci/vecmap.ts';
export const path = '/science/watershed-delineation/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/watershed-delineation/`);
  await page.waitForFunction(() => document.querySelector('.wsd .wsd-map')?.dataset.drawn, null, { timeout: 8000 });
  const txt = async (c) => (await page.textContent(c)).replace(/\s+/g, ' ').trim();
  const facts = () => page.evaluate(() => Object.fromEntries([...document.querySelectorAll('.wsd .wsd-facts > div')].map((d) => [d.querySelector('dt').textContent, d.querySelector('dd').textContent])));
  check((await txt('.wsd .wsd-big')) === '1.938 km² drain to the outlet', 'ws: example watershed');
  { const f = await facts(); check(f['Outlet cell'] === 'row 84, column 64' && f['Cells draining in'] === '19,377' && f['Perimeter'] === '6.64 km' && f['Longest flow path'] === '2.399 km' && f['Mean slope'] === '12.8°' && f['Highest Strahler order'] === '3', 'ws: example numbers'); }
  check((await txt('.wsd .wsd-gfacts')).includes('Cells raised by filling6') && (await txt('.wsd .wsd-thrhelp')).includes('192 cells (1.92 ha)'), 'ws: grid facts and threshold');
  // Tap the map near a tributary: snaps, smaller watershed
  await page.locator('.wsd .wsd-map').scrollIntoViewIfNeeded();
  const tap = async (row, col) => { const b = await page.locator('.wsd .wsd-map').boundingBox(); const d0 = await page.getAttribute('.wsd .wsd-map', 'data-drawn'); await page.mouse.click(b.x + ((col + 0.5) / 240) * b.width, b.y + ((row + 0.5) / 200) * b.height); await page.waitForFunction((d) => document.querySelector('.wsd .wsd-map').dataset.drawn !== d, d0); };
  await tap(160, 75);
  { const f = await facts(); check(f['Outlet cell'] !== 'row 84, column 64' && Number(f['Cells draining in'].replace(/,/g, '')) > 19377, 'ws: tap lower on the main stream gives a bigger watershed'); }
  await page.fill('.wsd .wsd-snap', '0'); await tap(30, 200);
  { const f = await facts(); check(f['Outlet cell'] === 'row 31, column 201', 'ws: snap distance 0 keeps the tapped cell'); }
  await page.fill('.wsd .wsd-snap', '5');
  await page.click('.wsd .wsd-big1'); await page.waitForTimeout(300);
  check((await txt('.wsd .wsd-big')) === '4.8 km² drain to the outlet', 'ws: largest watershed is the whole grid');
  // Threshold
  await page.fill('.wsd .wsd-thr', '2000'); await page.dispatchEvent('.wsd .wsd-thr', 'change'); await page.waitForTimeout(300);
  { const f = await facts(); check(f['Highest Strahler order'] === '2' && (await txt('.wsd .wsd-thrhelp')).includes('2,000 cells (20 ha)'), 'ws: higher threshold, fewer streams'); }
  await page.fill('.wsd .wsd-thr', '1'); await page.dispatchEvent('.wsd .wsd-thr', 'change'); await page.waitForTimeout(200);
  check((await txt('.wsd .wsd-err')).startsWith('The stream threshold must be'), 'ws: bad threshold');
  await page.fill('.wsd .wsd-thr', '192'); await page.dispatchEvent('.wsd .wsd-thr', 'change');
  await page.check('.wsd .wsd-showfill'); await page.waitForTimeout(200);
  // Downloads
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.wsd .wsd-geo')]); const f = OUT + 'ws.geojson'; await d.saveAs(f); const g = JSON.parse(readFileSync(f, 'utf8')); const ws = g.features[0]; check(d.suggestedFilename() === 'example-valley-watershed.geojson' && ws.properties.area_m2 === 4800000 && ws.geometry.type === 'Polygon' && ringArea2(ws.geometry.coordinates[0]) > 0 && Math.abs(ringArea2(ws.geometry.coordinates[0])) === 4800000 && g.features[1].properties.kind === 'outlet' && g.features.filter((x) => x.properties.kind === 'stream').length > 50, 'ws: GeoJSON (outline counter-clockwise, outlet, streams)'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.wsd .wsd-acc')]); check(d.suggestedFilename() === 'example-valley-accumulation.tif', 'ws: accumulation GeoTIFF'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.wsd .wsd-dir')]); check(d.suggestedFilename() === 'example-valley-flow-direction.tif', 'ws: flow direction GeoTIFF'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.wsd .dl [data-f=png]')]); check(d.suggestedFilename() === 'example-valley-watershed.png', 'ws: report image'); }
  // A geographic GeoTIFF: GeoJSON in longitude and latitude
  writeFileSync(OUT + 'small.tif', Buffer.from(TIF, 'base64'));
  await page.setInputFiles('.wsd .wsd-in', OUT + 'small.tif'); await page.waitForTimeout(600);
  { const f = await facts(); check(Object.keys(f).includes('Outlet (lat, lon)') && (await txt('.wsd .wsd-geohelp')).includes('WGS 84 longitude and latitude'), 'ws: degree grid'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.wsd .wsd-geo')]); const f = OUT + 'ws2.geojson'; await d.saveAs(f); const g = JSON.parse(readFileSync(f, 'utf8')); const c = g.features[1].geometry.coordinates; check(c[0] > 7 && c[0] < 7.02 && c[1] > 44.99 && c[1] < 45.01, 'ws: GeoJSON in degrees'); }
  // Too big, and not a grid
  writeFileSync(OUT + 'big.asc', 'ncols 1200\nnrows 1000\nxllcorner 0\nyllcorner 0\ncellsize 1\n' + ('1 '.repeat(1200) + '\n').repeat(1000));
  await page.setInputFiles('.wsd .wsd-in', OUT + 'big.asc'); await page.waitForTimeout(800);
  check((await txt('.wsd .wsd-err')).includes('the limit here is 1,000,000'), 'ws: too many cells');
  writeFileSync(OUT + 'bad.asc', 'not a grid');
  await page.setInputFiles('.wsd .wsd-in', OUT + 'bad.asc'); await page.waitForTimeout(300);
  check((await txt('.wsd .wsd-err')).startsWith('This is not an ESRI ASCII grid'), 'ws: not a grid');
  await page.click('.wsd .wsd-ex'); await page.waitForTimeout(500);
  check(await page.isHidden('.wsd .wsd-err') && (await txt('.wsd .wsd-big')) === '1.938 km² drain to the outlet', 'ws: example again');
};
