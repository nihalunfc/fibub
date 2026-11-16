// #T901 Sprocket ratio
export const path = '/vehicles/sprocket-ratio/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/sprocket-ratio/`); await page.waitForTimeout(300);
  const rows = () => page.$$eval('.sr table:not(.sr-near) tbody tr', (r) => r.map((x) => [...x.children].map((c) => c.textContent)));
  const set = async (k, v) => { await page.fill(`.sr [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  // 14/42 = 3.0, primary 3.0, 5th 1.0 -> 9.0 overall; 6000 / 9 = 666.7 rpm x 2.0 m = 80 km/h
  let r = await rows();
  check(r.length === 5 && r[4][2] === '80.0' && r[4][1] === '9.00', `sprocket-ratio: 5th gear 80.0 km/h at 6,000 rpm (${JSON.stringify(r[4])})`);
  check(r[0][2] === '32.0', `sprocket-ratio: 1st gear 2.5 -> 32.0 km/h (${r[0][2]})`);
  // rear 45: speed x 42/45 = -6.7%
  check(r[4][3] === '74.7' && r[4][4] === '-6.7%', `sprocket-ratio: 14/45 gives 74.7 km/h, -6.7% (${r[4][3]} ${r[4][4]})`);
  await set('rpm', '3000'); r = await rows();
  check(r[4][2] === '40.0', 'sprocket-ratio: half the rpm, half the speed');
  await page.selectOption('.sr [data-k="mode"]', 'size'); await page.waitForTimeout(100);
  check((await page.textContent('.sr .sr-big')).includes('1,884 mm'), `sprocket-ratio: 120/70-17 tyre is about 1,884 mm round (${await page.textContent('.sr .sr-big')})`);
  check((await page.textContent('.sr .sr-line')).includes('80 links'), `sprocket-ratio: chain note (${await page.textContent('.sr .sr-line')})`);
  // New options (fresh page: 14/42, primary 3, 6000 rpm, 2000 mm)
  await page.goto(`${BASE}/vehicles/sprocket-ratio/`); await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await set('cruise', '80'); r = await rows();
  // 80 km/h in 5th (overall 9.0) = 80 / 120 m per min... wheel 666.7 rpm x 9 = 6,000 rpm; 1st: x 2.5 = 15,000 rpm
  check(r[4][5] === '6,000' && r[0][5] === '15,000', `sprocket-ratio: cruising rpm per gear (${r[4][5]}, ${r[0][5]})`);
  await set('want', '120');
  check((await page.textContent('.sr [data-o="find"]')).startsWith('28 teeth gives exactly 120.0 km/h'), `sprocket-ratio: 120 km/h needs 28 teeth (${await page.textContent('.sr [data-o="find"]')})`);
  await set('want', '100');
  check((await page.textContent('.sr [data-o="find"]')).includes('About 33.6 teeth. 33 teeth gives 101.8 km/h, 34 teeth gives 98.8 km/h'), `sprocket-ratio: 100 km/h (${await page.textContent('.sr [data-o="find"]')})`);
  const near = await page.$$eval('.sr-near tbody tr', (x) => x.map((y) => [...y.children].map((c) => c.textContent).join('|')));
  check(near.length === 7 && near[0] === '39|2.79|86.2 km/h|+7.7%' && near[3] === '42|3.00|80.0 km/h|-' && near[6] === '45|3.21|74.7 km/h|-6.7%', `sprocket-ratio: rear sprockets table (${JSON.stringify(near)})`);
  await page.selectOption('.sr [data-k="su"]', 'mph'); await set('cruise', '60'); r = await rows();
  // 80 km/h = 49.7 mph; 60 mph = 96.56 km/h -> 96.56 / 80 x 6,000 = 7,242 rpm in 5th
  check(r[4][2] === '49.7' && r[4][5] === '7,242', `sprocket-ratio: mph (${r[4][2]}, ${r[4][5]})`);
  await set('front', '0');
  check(!(await page.textContent('.sr')).includes('NaN') && (await page.textContent('.sr .sr-warn')).length > 5, 'sprocket-ratio: zero teeth, friendly message');
};
