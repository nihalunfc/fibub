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
  { k: 's', y: 45.4203, x: -75.6893, src: 'o', id: 'w5', n: 'Short St', a: 'c', f: 0, m: '1 hour' },
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
  check(items.length === 5 && !items.some((t) => t.includes('Far Lot')), `parking-finder: 5 places within 500 m, far one left out (${items.length})`);
  check(/Bank St.*Free at this time/.test(items.find((t) => t.includes('Bank St')) || ''), 'parking-finder: Ottawa machine free after 7 p.m.');
  check(/Test Lot A.*Closed/.test(items.find((t) => t.includes('Test Lot A')) || ''), 'parking-finder: lot closed after its hours');
  check((await page.textContent('.pf-cityh')).includes('Ottawa'), 'parking-finder: shows Ottawa street rules');
  await page.check('.pf-open'); await page.check('.pf-pub'); await page.waitForTimeout(100);
  const names = await page.$$eval('.pf-list > li .t b', (els) => els.map((e) => e.textContent));
  check(names.length === 2 && !names.some((n) => /Lot A|Shop Lot/.test(n)), `parking-finder: filters hide closed and customers-only (${names.join(', ')})`);
  await page.fill('.pf-at', '2026-11-13T18:00'); await page.dispatchEvent('.pf-at', 'change'); await page.waitForTimeout(100);
  check(/Paid now, \$3\.00/.test(await page.textContent('.pf-list')), 'parking-finder: Ottawa machine paid at 6 p.m. with its rate');
  // More options: stay length, cost estimate, sort, max-stay filter, accessible and EV
  await page.evaluate(() => document.querySelectorAll('.pf details').forEach((d) => (d.open = true)));
  await page.uncheck('.pf-pub'); await page.waitForTimeout(100);
  check((await page.textContent('.pf-list')).includes('Short St'), 'parking-finder: short-stay street shown before a stay length is set');
  await page.fill('.pf-at', '2026-11-13T10:00'); await page.dispatchEvent('.pf-at', 'change'); await page.waitForTimeout(100);
  await page.selectOption('.pf-stay', '240'); await page.waitForTimeout(150);
  const txt = await page.textContent('.pf-list');
  // Mon-Fri 7am-7pm at $3.00: 10:00 to 14:00 is 4 paid hours = $12.00
  check(/Estimated cost for 4 h: about \$12\.00/.test(txt), `parking-finder: 4 h on Bank St costs $12.00 (${txt.replace(/\s+/g, ' ').slice(0, 200)})`);
  check(!txt.includes('Short St'), 'parking-finder: 1 hour max stay is hidden for a 4 h stay');
  await page.fill('.pf-at', '2026-11-13T17:00'); await page.dispatchEvent('.pf-at', 'change'); await page.selectOption('.pf-stay', '120'); await page.waitForTimeout(150);
  // 17:00 to 19:00 = 2 paid hours = $6.00; 18:00 to 20:00 would be $3.00
  check(/about \$6\.00/.test(await page.textContent('.pf-list')), 'parking-finder: 2 h from 5 p.m. costs $6.00');
  await page.fill('.pf-at', '2026-11-13T18:00'); await page.dispatchEvent('.pf-at', 'change'); await page.waitForTimeout(150);
  check(/about \$3\.00/.test(await page.textContent('.pf-list')), 'parking-finder: 2 h from 6 p.m. costs $3.00 (free after 7)');
  await page.selectOption('.pf-sort', 'cheap'); await page.waitForTimeout(100);
  const cheap = await page.$$eval('.pf-list > li', (els) => els.map((e) => e.textContent.replace(/\s+/g, ' ').slice(0, 90)));
  // Free places come first, then the $3.00 street, then the garage with no known price.
  const at = (n) => cheap.findIndex((t) => t.includes(n));
  check(/Free/.test(cheap[0]) && at('Bank St') < at('Test Garage') && at('Bank St') > at('Test Lot A'), `parking-finder: cheapest sort puts free, then priced, then unknown (${cheap.join(' | ')})`);
  await page.check('.pf-ev'); await page.waitForTimeout(100);
  check(!(await page.textContent('.pf-sum')).includes('NaN') && await page.$$eval('.pf-list > li', (e) => e.length) === 0, 'parking-finder: EV filter with none gives an empty list, not an error');
};
