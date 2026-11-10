// #T894 Real mileage
export const path = '/money/real-mileage/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/real-mileage/`); await page.waitForTimeout(400);
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
};
