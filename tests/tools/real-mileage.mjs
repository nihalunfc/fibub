// #T893 Real mileage
export const path = '/vehicles/real-mileage/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/real-mileage/`); await page.waitForTimeout(400);
  const big = () => page.textContent('.rm .rm-big'), rows = () => page.textContent('.rm .rm-rows');
  const wait = () => page.waitForTimeout(120);
  // fills at 10,000 (full) and 10,450 with 30 L (full) -> 15.0 km/L = 6.67 L/100 km
  check((await big()).startsWith('15.00 km/L'), `real-mileage: 450 km on 30 L = 15.00 km/L (${await big()})`);
  check((await rows()).includes('6.67'), 'real-mileage: 6.67 L per 100 km');
  check((await rows()).includes('35.28'), 'real-mileage: 35.28 mpg (US)');
  const price = page.locator('.rm .rm-body tr').nth(1).locator('[data-c="price"]');
  await price.fill('1.5'); await wait();
  check((await rows()).includes('0.100'), 'real-mileage: cost per km = 45 / 450 = 0.100');
  // a part fill adds to the next full one: 10 L part + 20 L full still 30 L
  await page.click('.rm .rm-add'); await wait();
  const last = page.locator('.rm .rm-body tr').nth(2);
  await last.locator('[data-c="odo"]').fill('10900'); await last.locator('[data-c="amt"]').fill('45'); await wait();
  check((await page.innerHTML('.rm .rm-chart')).includes('polyline'), 'real-mileage: trend chart appears with 2 tanks');
  await page.selectOption('.rm [data-k="vol"]', '3.785411784'); await wait();
  check(!(await big()).startsWith('15.00 km/L'), 'real-mileage: changing the fuel unit changes the result');
  await page.selectOption('.rm [data-k="dist"]', '1.609344'); await wait();
  check((await big()).includes('mpg (US)'), 'real-mileage: miles show mpg');
  await page.selectOption('.rm [data-k="vol"]', 'kwh'); await wait();
  check((await rows()).includes('kWh per 100 km'), 'real-mileage: kWh mode');
  await page.selectOption('.rm [data-k="vehicle"]', 'truck'); await wait();
  check((await page.inputValue('.rm [data-k="tank"]')) === '200', 'real-mileage: vehicle sets the battery size');
  // more options: claimed figure, trip estimate, best and worst tank (fresh page, simple data)
  await page.goto(`${BASE}/vehicles/real-mileage/`); await page.waitForTimeout(400);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.fill('.rm [data-k="claim"]', '6'); await wait();
  // 6.667 L/100 km against a claimed 6: 11.1% more
  check((await rows()).includes('11.1% more fuel than claimed'), `real-mileage: 11.1% above the claim (${await rows()})`);
  await page.fill('.rm [data-k="plan"]', '300'); await wait();
  check((await rows()).includes('300 km trip needs20.00 L'), `real-mileage: 300 km at 15 km/L needs 20.00 L (${await rows()})`);
  await page.locator('.rm .rm-body tr').nth(1).locator('[data-c="price"]').fill('1.5'); await wait();
  check((await rows()).includes('Trip fuel cost30.00'), 'real-mileage: trip cost 20 L x 1.50 = 30.00');
  await page.click('.rm .rm-add'); await wait();
  const l3 = page.locator('.rm .rm-body tr').nth(2);
  await l3.locator('[data-c="odo"]').fill('10900'); await l3.locator('[data-c="amt"]').fill('45'); await wait();
  check((await rows()).includes('Best tank15.00 km/L (fill-up 1)') && (await rows()).includes('Worst tank10.00 km/L (fill-up 2)'), `real-mileage: best and worst tank (${await rows()})`);
  await page.fill('.rm [data-k="claim"]', ''); await page.fill('.rm [data-k="plan"]', ''); await wait();
  check(!(await rows()).includes('claimed') && !(await rows()).includes('NaN'), 'real-mileage: blank extras add nothing');
};
