// #T902 Sprocket ratio
export const path = '/money/sprocket-ratio/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/sprocket-ratio/`); await page.waitForTimeout(300);
  const rows = () => page.$$eval('.sr tbody tr', (r) => r.map((x) => [...x.children].map((c) => c.textContent)));
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
};
