// #893 vector map viewer
import { unzipSync, zipSync } from 'fflate';
import { UTM33, LINEZ } from '../sci-tools/vector-map-viewer.mjs';
export const path = '/science/vector-map-viewer/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/vector-map-viewer/`);
  await page.waitForFunction(() => document.querySelector('.vmv .vmv-map')?.dataset.drawn, null, { timeout: 5000 });
  const txt = async (c) => (await page.textContent(c)).replace(/\s+/g, ' ');
  check((await txt('.vmv .vmv-big')) === '6 features' && await page.locator('.vmv .vmv-table tbody tr').count() === 6, 'vmv: example loaded');
  { const r = await txt('.vmv .vmv-table tbody tr:nth-child(1)'); check(r.includes('North meadow') && r.includes('37.8586 ha') && r.includes('2,473.65 m'), 'vmv: area and perimeter in the table'); }
  { const f = await txt('.vmv .vmv-facts'); check(f.includes('Total area113.961 ha') && f.includes('Total line length1,900.41 m') && f.includes('Vertices33'), 'vmv: summary'); }
  await page.selectOption('.vmv .vmv-au', 'km2'); await page.selectOption('.vmv .vmv-lu', 'km');
  { const r = await txt('.vmv .vmv-table tbody tr:nth-child(1)'); check(r.includes('0.378586 km²') && r.includes('2.47365 km'), 'vmv: units'); }
  await page.selectOption('.vmv .vmv-au', 'ha'); await page.selectOption('.vmv .vmv-lu', 'm');
  // Row click selects; tap on the map selects
  await page.locator('.vmv .vmv-table tbody tr:nth-child(2)').scrollIntoViewIfNeeded();
  await page.click('.vmv .vmv-table tbody tr:nth-child(2)'); await page.waitForTimeout(300);
  { const s = await txt('.vmv .vmv-sel'); check(s.includes('Feature 2: Polygon') && s.includes('Outer perimeter2,585.1 m') && s.includes('Pond field'), 'vmv: row selects a feature'); }
  await page.click('.vmv .vmv-fit'); await page.waitForTimeout(300);
  const box = await page.locator('.vmv .vmv-map').boundingBox();
  await page.locator('.vmv .vmv-map').scrollIntoViewIfNeeded();
  { const b = await page.locator('.vmv .vmv-map').boundingBox(); await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2); }
  await page.waitForTimeout(300);
  check((await txt('.vmv .vmv-selh')) === 'Feature 1: Polygon' && await page.locator('.vmv .vmv-table tr.on').count() === 1, 'vmv: tap on the map selects');
  { const d0 = await page.getAttribute('.vmv .vmv-map', 'data-drawn'); await page.click('.vmv .vmv-zin'); await page.waitForTimeout(200); await page.click('.vmv .vmv-zout'); await page.waitForTimeout(200); check((await page.getAttribute('.vmv .vmv-map', 'data-drawn')) !== d0 && box.width > 300, 'vmv: zoom buttons redraw'); }
  await page.check('.vmv .vmv-labels'); await page.uncheck('.vmv .vmv-land'); await page.waitForTimeout(200);
  // Downloads
  await page.check('.vmv .vmv-addm');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.vmv .vmv-dl')]); const f = OUT + 'vmv.geojson'; await d.saveAs(f); const g = JSON.parse(readFileSync(f, 'utf8')); check(d.suggestedFilename() === 'Example-farm-made-up.geojson' && g.features.length === 6 && Math.abs(g.features[0].properties.area_ha - 37.8585826) < 1e-6 && g.features[3].properties.length_m > 1900, 'vmv: GeoJSON download with measures'); }
  await page.click('.vmv .vmv-fmt [data-fmt=kml]');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.vmv .vmv-dl')]); const f = OUT + 'vmv.kml'; await d.saveAs(f); const s = readFileSync(f, 'utf8'); check(s.includes('<name>Pond field</name>') && s.includes('<innerBoundaryIs>') && (s.match(/<Placemark>/g) || []).length === 6, 'vmv: KML download'); }
  await page.click('.vmv .vmv-fmt [data-fmt=csv]');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.vmv .vmv-dl')]); const f = OUT + 'vmv.csv'; await d.saveAs(f); const s = readFileSync(f, 'utf8').replace(/^﻿/, '').split(/\r?\n/); check(s[0] === 'WKT,name,use,owner,area_ha,perimeter_m,length_m' && s[1].startsWith('"POLYGON ((-1.205 52.41'), 'vmv: CSV (WKT) download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.vmv .dl [data-f=png]')]); check(d.suggestedFilename() === 'Example-farm-made-up-map.png', 'vmv: report image'); }
  // A zipped shapefile in UTM 33N
  writeFileSync(OUT + 'utm33_poly.zip', Buffer.from(UTM33, 'base64'));
  await page.setInputFiles('.vmv .vmv-in', OUT + 'utm33_poly.zip'); await page.waitForTimeout(800);
  check((await txt('.vmv .vmv-big')) === '6 features' && (await txt('.vmv .vmv-facts')).includes('UTM_Zone_33N') && (await txt('.vmv .vmv-facts')).includes('Map-plane area') && (await txt('.vmv .vmv-table')).includes('東京'), 'vmv: zipped shapefile in UTM');
  // The same shapefile as separate files
  const parts = unzipSync(new Uint8Array(Buffer.from(UTM33, 'base64')));
  const names = Object.keys(parts).filter((n) => /\.(shp|dbf|prj|cpg)$/.test(n)).map((n) => { writeFileSync(OUT + n, parts[n]); return OUT + n; });
  await page.setInputFiles('.vmv .vmv-in', names); await page.waitForTimeout(800);
  check((await txt('.vmv .vmv-title')) === 'utm33_poly' && await page.locator('.vmv .vmv-table tbody tr').count() === 6, 'vmv: shapefile as separate files');
  // Two shapefiles in one zip: a layer list
  const both = { ...parts, ...unzipSync(new Uint8Array(Buffer.from(LINEZ, 'base64'))) };
  writeFileSync(OUT + 'two.zip', zipSync(both));
  await page.setInputFiles('.vmv .vmv-in', OUT + 'two.zip'); await page.waitForTimeout(800);
  check(await page.isVisible('.vmv .vmv-layer') && await page.locator('.vmv .vmv-layer option').count() === 2, 'vmv: two layers in a zip');
  await page.selectOption('.vmv .vmv-layer', '1'); await page.waitForTimeout(400);
  check((await txt('.vmv .vmv-title')) === 'geo_lineZ' && (await txt('.vmv .vmv-table')).includes('Crème brûlée') && (await txt('.vmv .vmv-notes')).includes('windows-1252'), 'vmv: switch layer, cp1252 text');
  // Paste KML
  await page.click('.vmv .vmv-pastebox summary');
  await page.fill('.vmv .vmv-paste', '<kml><Placemark><name>Line A</name><LineString><coordinates>0,0 0.01,0</coordinates></LineString></Placemark></kml>');
  await page.click('.vmv .vmv-read'); await page.waitForTimeout(400);
  check((await txt('.vmv .vmv-table')).includes('1,113.19 m'), 'vmv: pasted KML, line length');
  // Bad input
  writeFileSync(OUT + 'bad.json', '{"hello": 1}');
  await page.setInputFiles('.vmv .vmv-in', OUT + 'bad.json'); await page.waitForTimeout(400);
  check((await txt('.vmv .vmv-err')).startsWith('This JSON is not GeoJSON'), 'vmv: not GeoJSON');
  await page.setInputFiles('.vmv .vmv-in', OUT + 'utm33_poly.dbf'); await page.waitForTimeout(400);
  check((await txt('.vmv .vmv-err')).includes('has no matching'), 'vmv: .dbf alone');
  await page.click('.vmv .vmv-ex'); await page.waitForTimeout(400);
  check(await page.isHidden('.vmv .vmv-err') && (await txt('.vmv .vmv-big')) === '6 features', 'vmv: example again');
};
