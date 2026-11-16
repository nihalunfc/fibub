// #T896 Road trip
export const path = '/vehicles/road-trip/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/road-trip/`); await page.waitForTimeout(400);
  const big = () => page.textContent('.rt .rt-big'), rows = () => page.textContent('.rt .rt-rows');
  const set = async (k, v) => { await page.fill(`.rt [data-k="${k}"]`, v); await page.waitForTimeout(100); };
  // 600 km at 80 km/h = 7 h 30 m, breaks at 2, 4 and 6 h = 3 x 15 = 45 min -> 8 h 15 m
  check((await big()).includes('8 h 15 m'), `road-trip: 600 km at 80 km/h with 15 min every 2 h = 8 h 15 m (${await big()})`);
  check((await rows()).includes('7 h 30 m') && (await rows()).includes('3 x 15 min = 0 h 45 m'), 'road-trip: 7 h 30 m driving and 3 breaks');
  check((await rows()).includes('16:15'), 'road-trip: leaving 08:00 arrives 16:15');
  check((await rows()).includes('63.00'), 'road-trip: 600 km at 7 L/100 km = 42 L x 1.50 = 63.00');
  await set('tolls', '12.5');
  check((await rows()).includes('75.50'), 'road-trip: tolls added to the total cost');
  await set('tank', '20'); // usable 18 L, need 42 L -> 2 fuel stops of 10 min
  check((await rows()).includes('Fuel stops') && (await big()).includes('8 h 35 m'), `road-trip: a small tank adds 2 fuel stops (${await big()})`);
  await set('tank', '50'); await set('every', '3');
  check((await big()).includes('8 h 00 m'), `road-trip: a break every 3 h gives 2 breaks, 8 h 00 m (${await big()})`);
  await page.click('.rt .rt-add'); await page.waitForTimeout(100);
  const leg = page.locator('.rt .rt-leg').nth(1);
  await leg.locator('[data-l="d"]').fill('40'); await leg.locator('[data-l="s"]').fill('40'); await page.waitForTimeout(100);
  check((await rows()).includes('640.00'), 'road-trip: a second leg adds distance');
  // more options: round trip, share, arrive by, other units
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.goto(`${BASE}/vehicles/road-trip/`); await page.waitForTimeout(400);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  check((await rows()).includes('14.29 km/L') && (await rows()).includes('33.60 mpg US') && (await rows()).includes('40.35 mpg UK'), `road-trip: 7 L/100 km = 14.29 km/L, 33.60 mpg US, 40.35 mpg UK (${await rows()})`);
  await set('people', '3');
  check((await rows()).includes('Each of 3 people pays21.00'), 'road-trip: 63.00 shared by 3 = 21.00');
  await set('people', '1');
  await set('by', '2026-11-14T20:00');
  check((await rows()).includes('Sat 14 Nov, 11:45'), `road-trip: arrive by 20:00 after 8 h 15 m means leave 11:45 (${await rows()})`);
  await page.check('.rt [data-k="round"]'); await page.waitForTimeout(100);
  check((await big()).includes('16 h 30 m') && (await big()).includes('there and back'), `road-trip: round trip doubles the time (${await big()})`);
  check((await rows()).includes('1,200.00') && (await rows()).includes('126.00'), 'road-trip: round trip 1,200 km and 126.00 fuel');
  await page.uncheck('.rt [data-k="round"]'); await set('by', ''); await page.waitForTimeout(100);
  check(!(await rows()).includes('Leave by'), 'road-trip: no arrive-by, no leave-by line');
};
