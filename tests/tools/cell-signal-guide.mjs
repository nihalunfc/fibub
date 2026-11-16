// #T952 Cell Signal
export const path = '/everyday/cell-signal-guide/';
// A made-up tower file around Niagara Falls (43.09, -79.08): two carriers in the tile 43_-80.
const INDEX = { v: 1, source: 'test', bin: 0.01, ops: [{ name: 'Rogers', country: 'ca' }, { name: 'Bell', country: 'ca' }], countries: { ca: { updated: '2026-11-01', cells: 5 } }, tiles: { '43_-80': { c: ['ca'], n: 3 } } };
const TILE = { v: 1, tile: '43_-80', rows: [[9, 91, 0, 1, 3, 0, 0], [9, 92, 1, 0, 0, 2, 1], [30, 50, 1, 0, 2, 0, 0]] };
export default async ({ page, check, BASE }) => {
  await page.context().route(BASE + '/cells/index.json', (r) => r.fulfill({ json: INDEX }));
  await page.context().route(BASE + '/cells/43_-80.json', (r) => r.fulfill({ json: TILE }));
  await page.goto(`${BASE}/everyday/cell-signal-guide/`); await page.waitForTimeout(400);
  check(/web pages cannot read your phone's radio/.test(await page.textContent('.csg .csg-near')), 'cell-signal-guide: says plainly what a browser cannot do');
  await page.click('.csg .csg-manual summary'); await page.fill('.csg .csg-ll', '43.0896, -79.0849'); await page.click('.csg .csg-go');
  await page.waitForSelector('.csg .csg-nout:not([hidden])');
  const rows = await page.$$eval('.csg .csg-ntab tbody tr', (r) => r.map((x) => x.textContent));
  check(rows.length === 2 && /^Rogers/.test(rows[0]) && /Likely strong/.test(rows[0]), `cell-signal-guide: lists both networks, Rogers first and likely strong (${rows.join(' | ')})`);
  check(/Only old 3G\/2G cells nearby/.test(rows[1]), 'cell-signal-guide: a 3G/2G-only network is flagged');
  await page.selectOption('.csg .csg-r', '10'); await page.waitForTimeout(200);
  check(await page.$eval('.csg .csg-map', (c) => c.width > 100), 'cell-signal-guide: the map is drawn');
  check(/OpenCelliD, CC BY-SA 4\.0/.test(await page.textContent('.csg .csg-ninfo')), 'cell-signal-guide: credits OpenCelliD');
  check(/^Fair/.test(await page.textContent('.csg .csg-rate')), 'cell-signal-guide: -95 dBm LTE is Fair');
  await page.fill('.csg .csg-dbm', '-75');
  check(/^Excellent/.test(await page.textContent('.csg .csg-rate')), 'cell-signal-guide: -75 dBm LTE is Excellent');
  await page.selectOption('.csg .csg-tech', 'umts'); await page.fill('.csg .csg-dbm', '-95');
  check(/^Fair/.test(await page.textContent('.csg .csg-rate')), 'cell-signal-guide: -95 dBm 3G is Fair');
  for (const [c, word] of [['ca', 'CRTC'], ['in', 'Tarang Sanchar'], ['uk', 'Ofcom'], ['us', 'FCC']]) {
    await page.click(`.csg [data-c="${c}"]`);
    check((await page.textContent('.csg .csg-country')).includes(word), `cell-signal-guide: ${c} lists ${word}`);
  }
  await page.click('.csg .csg-sample');
  check(await page.$$eval('.csg .csg-sum tbody tr', (r) => r.length) === 3, 'cell-signal-guide: sample compares three networks');
  check(/Strongest signal in your readings: Network B \(average -94 dBm/.test(await page.textContent('.csg .csg-best')), 'cell-signal-guide: Network B is strongest at -94 dBm');
  await page.fill('.csg .csg-place', 'Park'); await page.fill('.csg .csg-net', 'Network C'); await page.fill('.csg .csg-ldbm', '-90');
  await page.click('.csg .csg-add'); await page.waitForTimeout(200);
  check(await page.$$eval('.csg .csg-all tbody tr', (r) => r.length) === 7, 'cell-signal-guide: a reading is added');
  check(await page.evaluate(() => localStorage.getItem('fibub-cellreadings-v1') === null), 'cell-signal-guide: nothing stored unless ticked');
  // More options: ASU, uses, best per place. LTE ASU 45 = -95 dBm (Fair); GSM ASU 10 = -93 dBm.
  await page.selectOption('.csg .csg-tech', 'lte'); await page.selectOption('.csg .csg-unit', 'asu'); await page.fill('.csg .csg-dbm', '45');
  check(/^Fair 45 ASU is -95 dBm/.test(await page.textContent('.csg .csg-rate')), `cell-signal-guide: ASU converts (${await page.textContent('.csg .csg-rate')})`);
  check((await page.textContent('.csg .csg-fit')).includes('Patchy'), 'cell-signal-guide: Fair signal marks video patchy');
  await page.fill('.csg .csg-dbm', '');
  check(/Type the ASU number/.test(await page.textContent('.csg .csg-rate')) && !/NaN/.test(await page.textContent('.csg .csg-rate')), 'cell-signal-guide: blank ASU is friendly');
  await page.selectOption('.csg .csg-unit', 'dbm'); await page.fill('.csg .csg-dbm', '-108');
  check(/Wi-Fi calling/.test(await page.textContent('.csg .csg-help')), 'cell-signal-guide: poor signal suggests Wi-Fi calling');
  // Sample + Park/Network C -90: Home: A -92 (5G), B -104, C -113 -> A best by 12 over B. Work: B -84 best, 15 ahead of A (-99).
  check(/Home: Network A \(-92 dBm\), 12 dB ahead of Network B/.test(await page.textContent('.csg .csg-places')) && /Work: Network B \(-84 dBm\), 15 dB ahead of Network A/.test(await page.textContent('.csg .csg-places')), `cell-signal-guide: best per place (${await page.textContent('.csg .csg-places')})`);
};
