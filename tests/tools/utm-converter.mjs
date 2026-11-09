// #892 UTM and MGRS converter
export const path = '/science/utm-converter/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/utm-converter/`); await page.waitForTimeout(400);
  const facts = async (c = '.utmc .utm-facts') => (await page.textContent(c)).replace(/\s+/g, ' ');
  { const t = await facts(); check(t.includes('51.4778056, -0.0014722') && t.includes('Easting708215.85 m') && t.includes('Northing5707225.24 m') && t.includes('30U YC 08215 07225') && t.includes('+2.34679°') && t.includes('1.0001323'), 'utm: example point converted'); }
  // UTM in, MGRS in
  await page.fill('.utmc .utm-in', '56H 334368.63 6250948.35'); await page.waitForTimeout(100);
  check((await facts()).includes('-33.8688000, 151.2093000') && (await facts()).includes('33°52′07.68″ S'), 'utm: UTM text read');
  await page.fill('.utmc .utm-in', '30UXC9937510164'); await page.waitForTimeout(100);
  check((await facts()).includes('51.5073858') && (await page.textContent('.utmc .utm-note')).includes('centre of that square'), 'utm: MGRS read, centre noted');
  await page.fill('.utmc .utm-in', '33S 334786 6252080'); await page.waitForTimeout(100);
  check((await page.textContent('.utmc .utm-note')).includes('southern hemisphere'), 'utm: S ambiguity explained');
  // Settings: rounding, MGRS precision, forced zone
  await page.fill('.utmc .utm-in', '51°28′40.1″ N, 0°00′05.3″ W');
  await page.selectOption('.utmc .utm-dec', '0'); await page.selectOption('.utmc .utm-mg', '3'); await page.waitForTimeout(100);
  check((await facts()).includes('Easting708216 m') && (await facts()).includes('30U YC 082 072'), 'utm: rounding and MGRS precision');
  await page.selectOption('.utmc .utm-zone', '31'); await page.waitForTimeout(100);
  check((await facts()).includes('31U') && (await facts()).includes('Easting291580 m') && (await page.textContent('.utmc .utm-note')).includes('outside the zone'), 'utm: forced zone 31 with warning');
  await page.selectOption('.utmc .utm-zone', '0');
  await page.selectOption('.utmc .utm-ell', 'intl'); await page.waitForTimeout(100);
  check(!(await facts()).includes('MGRS') && (await facts()).includes('30U'), 'utm: other ellipsoid hides MGRS');
  await page.selectOption('.utmc .utm-ell', 'wgs84'); await page.selectOption('.utmc .utm-dec', '2'); await page.selectOption('.utmc .utm-mg', '5');
  // Bad input
  await page.fill('.utmc .utm-in', '95, 10'); await page.waitForTimeout(100);
  check((await page.textContent('.utmc .utm-err')).includes('beyond ±90°'), 'utm: bad latitude message');
  await page.fill('.utmc .utm-in', '86, 10'); await page.waitForTimeout(100);
  check((await page.textContent('.utmc .utm-err')).startsWith('UTM covers 80° S to 84° N'), 'utm: polar message');
  // Distance
  { const t = (await page.textContent('.utmc .utm-dfacts')).replace(/\s+/g, ' '); check(t.includes('334.325 km') && t.includes('149.7330°') && t.includes('151.4967°') && t.includes('331.4967°'), 'utm: distance and bearings'); }
  await page.fill('.utmc .utm-b', 'nowhere'); await page.waitForTimeout(100);
  check(await page.isVisible('.utmc .utm-derr'), 'utm: distance bad input');
  await page.fill('.utmc .utm-b', '31U 303931 5788288'); await page.waitForTimeout(100);
  check((await page.textContent('.utmc .utm-dfacts')).includes('km'), 'utm: distance to a UTM point');
  // Batch
  check((await page.textContent('.utmc .utm-lbig')) === '7 points converted' && await page.locator('.utmc .utm-table tbody tr').count() === 7, 'utm: example list');
  { const t = await page.textContent('.utmc .utm-lnote'); check(t.includes('4 UTM zones (31, 32, 33, 56)'), 'utm: list zones note'); }
  { const r = (await page.textContent('.utmc .utm-table tbody tr:nth-child(5)')).replace(/\s+/g, ' '); check(r.includes('Bergen') && r.includes('32V'), 'utm: Norway zone 32V in list'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.utmc .utm-csv')]); const f = OUT + 'utm.csv'; await d.saveAs(f); const s = readFileSync(f, 'utf8').replace(/^﻿/, '').trim().split(/\r?\n/); check(s.length === 8 && s[0].startsWith('name,input,latitude') && s[3].includes('Peg 3 (UTM)') && s[3].includes(',31,N,U,303931.00,5788288.00,'), 'utm: CSV download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.utmc .utm-geo')]); const f = OUT + 'utm.geojson'; await d.saveAs(f); const g = JSON.parse(readFileSync(f, 'utf8')); check(g.features.length === 7 && g.features[6].geometry.coordinates[1] < 0, 'utm: GeoJSON download'); }
  await page.selectOption('.utmc .utm-zone', '31'); await page.waitForTimeout(200);
  check((await page.textContent('.utmc .utm-table tbody tr:nth-child(7)')).includes('Line') || (await page.textContent('.utmc .utm-table tbody tr:nth-child(7)')).includes('choose a nearer zone'), 'utm: forced zone refuses far points in list');
  await page.selectOption('.utmc .utm-zone', '0');
  // A file with lat/lon columns, and a bad row
  writeFileSync(OUT + 'pts.csv', 'site,latitude,longitude\nA,52.1,0.2\nB,abc,0.3\nC,-12.5,130.8\n');
  await page.setInputFiles('.utmc .dfb-in', OUT + 'pts.csv'); await page.waitForTimeout(600);
  check((await page.textContent('.utmc .utm-lbig')) === '2 points converted, 1 not read' && (await page.textContent('.utmc .utm-table')).includes('Line 3'), 'utm: CSV file with a bad row');
  await page.click('.utmc .utm-clear'); await page.waitForTimeout(100);
  check(await page.isHidden('.utmc .utm-lres'), 'utm: clear');
};
