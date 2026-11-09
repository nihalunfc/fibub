// #406 Trench and grid recording sheet
export const path = '/science/trench-recording-sheet/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/trench-recording-sheet/`); await page.waitForTimeout(600);
  check(await page.isHidden('.trs .tr-out') && (await page.textContent('.trs .tr-hi')).includes('101.420 m'), 'trench: empty sheet, height of instrument');
  await page.click('.trs .tr-ex'); await page.waitForTimeout(300);
  check((await page.textContent('.trs .tr-big')) === '6 points: 5 inside Trench 1, 1 outside' && await page.isVisible('.trs .tr-fig'), 'trench: example sheet and plan');
  { const t = await page.textContent('.trs .tr-tab'); check(t.includes('1013.2505021.80099.550E1010 N5020yes45.5001961-73.5998305'), 'trench: F1 grid, height, square, lat/long');
    check(t.includes('1014.4005022.15099.470') && t.includes('1015.1005021.60099.370') && t.includes('1008.6005017.200E1005 N5015no'), 'trench: peg offsets, baseline, outside point'); }
  check((await page.textContent('.trs .tr-title')) === 'Trench 1 recording sheet', 'trench: sheet title');
  // Typed point with a preview.
  await page.fill('.trs .tr-id', 'F9'); await page.fill('.trs .tr-ge', '1013'); await page.fill('.trs .tr-gn', '5022'); await page.fill('.trs .tr-z', '1.5'); await page.waitForTimeout(100);
  check((await page.textContent('.trs .tr-prev')).startsWith('→ E 1013.000, N 5022.000 · square E1010 N5020 · in Trench 1 · height 99.920 m'), 'trench: live preview');
  await page.click('.trs .tr-add'); await page.waitForTimeout(100);
  check((await page.textContent('.trs .tr-big')).startsWith('7 points') && (await page.inputValue('.trs .tr-id')) === 'F10', 'trench: add point, next ID');
  await page.click('.trs .tr-add'); await page.waitForTimeout(100);
  await page.fill('.trs .tr-id', 'F1'); await page.click('.trs .tr-add');
  check((await page.textContent('.trs .tr-err')) === 'There is already a point called F1.', 'trench: duplicate ID');
  await page.fill('.trs .tr-id', 'X1'); await page.fill('.trs .tr-z', ''); await page.click('.trs .tr-add');
  check((await page.textContent('.trs .tr-err')).startsWith('Type the staff reading'), 'trench: missing staff reading');
  await page.selectOption('.trs .tr-how', 'base'); await page.fill('.trs .tr-ae', ''); await page.click('.trs .tr-add');
  check((await page.textContent('.trs .tr-err')).startsWith('Type the eastings and northings of both ends'), 'trench: missing baseline');
  await page.selectOption('.trs .tr-how', 'grid'); await page.selectOption('.trs .tr-zhow', 'none');
  await page.selectOption('.trs .tr-style', 'alnum'); await page.waitForTimeout(150);
  check((await page.textContent('.trs .tr-tab')).includes('C5yes'), 'trench: letters-and-numbers squares');
  // GPS: the test browser gives a made-up position near the example origin.
  await page.context().grantPermissions(['geolocation'], { origin: BASE }); await page.context().setGeolocation({ latitude: 45.5002, longitude: -73.5998, accuracy: 4 });
  await page.click('.trs .tr-gps'); await page.waitForTimeout(500);
  check((await page.textContent('.trs .tr-gpst')).includes('45.5002000, -73.5998000 (±4 m) → grid E 1015.63, N 5022.23') && await page.isVisible('.trs .tr-usegps'), 'trench: GPS fix placed on the grid');
  await page.check('.trs .tr-usegpsc'); await page.fill('.trs .tr-id', 'G1'); await page.click('.trs .tr-add'); await page.waitForTimeout(100);
  check((await page.textContent('.trs .tr-tab')).includes('1015.6325022.228') && (await page.textContent('.trs .tr-tab')).includes('±4 m'), 'trench: point from GPS');
  { await page.locator('.trs .tr-csv').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click('.trs .tr-csv')]); const f = OUT + 'trench.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n');
    check(t.length === 10 && t[0].startsWith('id,type,description,easting,northing,height,square') && t[1].startsWith('F1,find,Flint flake (example),1013.250,5021.800,99.550,C5,yes,45.5001961,-73.5998305') && t[9].includes('45.5002000,-73.5998000,4,GPS'), 'trench: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.trs .dl [data-f=pdf]')]); const f = OUT + 'trench.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 5).toString() === '%PDF-', 'trench: PDF sheet'); }
  await page.locator('.trs .tr-tab button').first().click(); await page.waitForTimeout(100);
  check((await page.textContent('.trs .tr-big')).startsWith('8 points'), 'trench: delete a point');
  page.once('dialog', (d) => d.accept()); await page.click('.trs .tr-clear'); await page.waitForTimeout(100);
  check(await page.isHidden('.trs .tr-out'), 'trench: clear all');
};
