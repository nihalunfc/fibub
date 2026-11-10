// #T896 Road trip
export const path = '/money/road-trip/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/road-trip/`); await page.waitForTimeout(400);
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
};
