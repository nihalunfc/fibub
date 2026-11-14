// #T954 Parking Finder. The parking data is mocked here (a tiny square near downtown Ottawa) so the checks do not
// depend on the monthly data refresh.
export const path = '/vehicles/parking-finder/';
const LAT = 45.42, LON = -75.69, T = 5;
const key = `${Math.floor(LAT * T)}_${Math.floor(LON * T)}`;
const tile = [
  { k: 'l', y: 45.4205, x: -75.69, src: 'o', id: 'w1', p: 'surface', n: 'Test Lot A', f: 0, h: 'Mo-Fr 07:00-19:00' },
  { k: 'l', y: 45.4240, x: -75.69, src: 'o', id: 'w2', p: 'garage', n: 'Test Garage', f: 1, h: '24/7', cap: 300 },
  { k: 'l', y: 45.4210, x: -75.6905, src: 'o', id: 'w3', n: 'Shop Lot', a: 'c', f: 0 },
  { k: 's', y: 45.4202, x: -75.6895, src: 'ott', f: 1, n: 'Bank St', pay: { mf: ['7:00am - 7:00pm', '$3.00'], sa: ['7:00am - 7:00pm', '$3.00'], su: ['', ''] } },
  { k: 'l', y: 45.4800, x: -75.69, src: 'o', id: 'w9', n: 'Far Lot' },
];
export default async ({ page, check, BASE }) => {
  await page.context().route(BASE + '/parking/v1/**', (route) => {
    const p = new URL(route.request().url()).pathname;
    if (p.endsWith('/index.json')) return route.fulfill({ json: { date: '2026-11-14', tile: T, counts: {}, tiles: { [key]: tile.length } } });
    if (p.endsWith(`/t/${key}.json`)) return route.fulfill({ json: tile });
    if (p.endsWith('/places.json')) return route.fulfill({ json: [['Test Station', LAT, LON, 'station'], ['Toronto', 43.6532, -79.3832, 'city']] });
    return route.fulfill({ status: 404, body: '' });
  });
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  // Friday 20:00: Lot A is closed, Bank St machine is outside paid hours.
  await page.selectOption('.pf-when', 'at');
  await page.fill('.pf-at', '2026-11-13T20:00');
  await page.fill('.pf-q', 'test sta');
  await page.waitForSelector('.pf-sugg button');
  await page.click('.pf-sugg button');
  await page.waitForSelector('.pf-list li');
  const items = await page.$$eval('.pf-list > li', (els) => els.map((e) => e.textContent.replace(/\s+/g, ' ')));
  check(items.length === 4 && !items.some((t) => t.includes('Far Lot')), `parking-finder: 4 places within 500 m, far one left out (${items.length})`);
  check(/Bank St.*Free at this time/.test(items.find((t) => t.includes('Bank St')) || ''), 'parking-finder: Ottawa machine free after 7 p.m.');
  check(/Test Lot A.*Closed/.test(items.find((t) => t.includes('Test Lot A')) || ''), 'parking-finder: lot closed after its hours');
  check((await page.textContent('.pf-cityh')).includes('Ottawa'), 'parking-finder: shows Ottawa street rules');
  await page.check('.pf-open'); await page.check('.pf-pub'); await page.waitForTimeout(100);
  const names = await page.$$eval('.pf-list > li .t b', (els) => els.map((e) => e.textContent));
  check(names.length === 2 && !names.some((n) => /Lot A|Shop Lot/.test(n)), `parking-finder: filters hide closed and customers-only (${names.join(', ')})`);
  await page.fill('.pf-at', '2026-11-13T18:00'); await page.dispatchEvent('.pf-at', 'change'); await page.waitForTimeout(100);
  check(/Paid now, \$3\.00/.test(await page.textContent('.pf-list')), 'parking-finder: Ottawa machine paid at 6 p.m. with its rate');
};
