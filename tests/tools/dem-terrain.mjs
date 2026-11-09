// #888 DEM slope, aspect and hillshade
import { TIF } from '../sci-tools/dem-terrain.mjs';
export const path = '/science/dem-terrain/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/dem-terrain/`);
  await page.waitForFunction(() => document.querySelector('.dmt .dmt-img')?.dataset.drawn, null, { timeout: 5000 });
  const txt = async (c) => (await page.textContent(c)).replace(/\s+/g, ' ').trim();
  const drawn = () => page.getAttribute('.dmt .dmt-img', 'data-drawn');
  check((await txt('.dmt .dmt-big')) === 'Mean slope 12.8°, relief 510.4 m' && (await txt('.dmt .dmt-info')).includes('240 × 200 cells') && (await txt('.dmt .dmt-info')).includes('4.8 km²'), 'dem: example loaded');
  const row = (c, n) => page.evaluate(([c, n]) => [...document.querySelectorAll(`${c} tbody tr:nth-child(${n}) td`)].map((td) => td.textContent).join(' | '), [c, n]);
  check((await row('.dmt .dmt-slopes', 5)) === '15° to 30° | 172.52 ha | 35.9 %' && (await row('.dmt .dmt-slopes', 7)).startsWith('45° and steeper'), 'dem: slope classes');
  check((await row('.dmt .dmt-aspects', 7)) === 'W (270°) | 33.9 %' && (await row('.dmt .dmt-aspects', 6)) === 'SW (225°) | 28.7 %', 'dem: aspect shares');
  check(await page.evaluate(() => { const c = document.querySelector('.dmt .dmt-img'); return c.width === 240 && c.height === 200; }), 'dem: one pixel per cell');
  // Tap a cell: row 61, column 186
  await page.locator('.dmt .dmt-img').scrollIntoViewIfNeeded();
  { const b = await page.locator('.dmt .dmt-img').boundingBox(); await page.mouse.click(b.x + (185.5 / 240) * b.width, b.y + (60.5 / 200) * b.height); }
  { const t = await txt('.dmt .dmt-read'); check(t.startsWith('Row 61, column 186') && t.includes('height 516.6 m') && t.includes('slope 17.8°') && t.includes('facing 294° (NW)'), 'dem: cell readout'); }
  // Layers
  for (const k of ['hillshade', 'slope', 'aspect', 'curv']) {
    const d0 = await drawn(); await page.click(`.dmt .dmt-kind [data-k=${k}]`);
    await page.waitForFunction((d) => document.querySelector('.dmt .dmt-img').dataset.drawn !== d, d0);
  }
  check((await txt('.dmt .dmt-khelp')).startsWith('Curvature as in ArcGIS') && await page.isVisible('.dmt .dmt-ct') && await page.isHidden('.dmt .dmt-su'), 'dem: curvature layer and its options');
  await page.selectOption('.dmt .dmt-ct', 'profile'); await page.waitForTimeout(200);
  check((await txt('.dmt .dmt-facts')).includes('This layer: mean (1/100 m)'), 'dem: profile curvature numbers');
  await page.click('.dmt .dmt-kind [data-k=slope]'); await page.selectOption('.dmt .dmt-su', 'slopepct'); await page.waitForTimeout(200);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.dmt .dmt-asc')]); const f = OUT + 'slope.asc'; await d.saveAs(f); const s = readFileSync(f, 'utf8').split('\n'); check(d.suggestedFilename() === 'example-valley-slope-percent.asc' && s[0] === 'ncols 240' && s[4] === 'cellsize 10' && s.length === 207, 'dem: ASCII grid download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.dmt .dmt-tif')]); check(d.suggestedFilename() === 'example-valley-slope-percent.tif', 'dem: GeoTIFF download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.dmt .dmt-png')]); const f = OUT + 'slope.png'; await d.saveAs(f); const b = readFileSync(f); check(b.readUInt32BE(16) === 240 && b.readUInt32BE(20) === 200, 'dem: PNG one pixel per cell'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.dmt .dl [data-f=pdf]')]); check(d.suggestedFilename() === 'example-valley-terrain.pdf', 'dem: report PDF'); }
  // Units: heights in feet make slopes gentler
  await page.click('.dmt .dmt-kind [data-k=elev]');
  await page.selectOption('.dmt .dmt-vu', 'ft'); await page.waitForTimeout(200);
  check((await txt('.dmt .dmt-big')) === 'Mean slope 4°, relief 510.4 ft', 'dem: elevation in feet');
  await page.selectOption('.dmt .dmt-vu', 'm');
  // Sun settings and bad values
  await page.fill('.dmt .dmt-alt', '0'); await page.dispatchEvent('.dmt .dmt-alt', 'change');
  check((await txt('.dmt .dmt-oerr')).startsWith('Sun direction must be'), 'dem: bad sun height');
  await page.fill('.dmt .dmt-alt', '30'); await page.fill('.dmt .dmt-az', '135'); await page.dispatchEvent('.dmt .dmt-az', 'change'); await page.waitForTimeout(200);
  check(await page.isHidden('.dmt .dmt-oerr'), 'dem: sun moved');
  // A geographic GeoTIFF (rasterio)
  writeFileSync(OUT + 'small.tif', Buffer.from(TIF, 'base64'));
  await page.setInputFiles('.dmt .dmt-in', OUT + 'small.tif'); await page.waitForTimeout(600);
  { const t = await txt('.dmt .dmt-info'); check(t.includes('20 × 16 cells') && t.includes('about 65.7 × 92.6 m') && t.includes('EPSG:4326') && (await txt('.dmt .dmt-facts')).includes('Cells without data1'), 'dem: geographic GeoTIFF'); }
  // An ASCII grid
  writeFileSync(OUT + 'g.asc', 'ncols 4\nnrows 3\nxllcorner 1000\nyllcorner 2000\ncellsize 5\nNODATA_value -9999\n10 11 12 13\n10 11 12 13\n10 11 12 -9999\n');
  await page.setInputFiles('.dmt .dmt-in', OUT + 'g.asc'); await page.waitForTimeout(500);
  check((await txt('.dmt .dmt-info')).includes('4 × 3 cells') && (await txt('.dmt .dmt-info')).includes('275 m²') && (await txt('.dmt .dmt-big')) === 'Mean slope 7.1°, relief 3 m', 'dem: ASCII grid opened');
  // Bad files
  writeFileSync(OUT + 'bad.asc', 'hello world');
  await page.setInputFiles('.dmt .dmt-in', OUT + 'bad.asc'); await page.waitForTimeout(400);
  check((await txt('.dmt .dmt-err')).startsWith('This is not an ESRI ASCII grid'), 'dem: not a grid');
  await page.click('.dmt .dmt-ex'); await page.waitForTimeout(400);
  check(await page.isHidden('.dmt .dmt-err') && (await txt('.dmt .dmt-big')) === 'Mean slope 12.8°, relief 510.4 m', 'dem: example again');
};
