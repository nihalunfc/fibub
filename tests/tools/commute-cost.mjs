// #1781 Commute cost
export const path = '/vehicles/commute-cost/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/commute-cost/`); await page.waitForTimeout(400);
  const R = '.cc ', out = () => page.textContent(R + '.cc-out');
  check((await out()).includes('3,873'), `commute: car 16.84 x 230 days = 3,873 (${(await out()).slice(0, 200)})`);
  check((await out()).includes('1,440') && (await out()).includes('115'), 'commute: transit 1,440 and bike 115 a year');
  check((await page.textContent(R + '.cc-big')).includes('Bike or walk (6,248 a year)'), 'commute: cheapest with time counted');
  await page.fill(R + '[data-k="hourly"]', '0'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.cc-big')).includes('Bike or walk (115 a year)'), 'commute: time value 0 leaves money only');
  await page.fill(R + '[data-k="dpw"]', '0'); await page.waitForTimeout(100);
  check(!(await out()).includes('NaN'), 'commute: zero days gives no NaN');
  // more options: pass break-even, car pool, units
  await page.goto(`${BASE}/vehicles/commute-cost/`); await page.waitForTimeout(400);
  check((await page.textContent(R + '.cc-pass')).includes('more than 7.1 days a month') && (await page.textContent(R + '.cc-pass')).includes('19.2 days'), `commute: pass break-even 120 / 16.84 = 7.1 days (${await page.textContent(R + '.cc-pass')})`);
  await page.fill(R + '[data-k="pool"]', '2'); await page.waitForTimeout(100);
  check((await out()).includes('1,937'), `commute: two people share the car, 3,873.2 / 2 = 1,937 (${(await out()).slice(0, 220)})`);
  await page.fill(R + '[data-k="pool"]', '1');
  // 8 L/100 km is 29.4 mpg US: switching the unit converts the number and keeps the answer
  await page.selectOption(R + '[data-k="eunit"]', 'mpgus'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '[data-k="l100"]')) === '29.4', `commute: 8 L/100 km shows as 29.4 mpg US (${await page.inputValue(R + '[data-k="l100"]')})`);
  check((await out()).includes('3,87'), 'commute: same car after the unit switch, about 3,87x a year');
  await page.selectOption(R + '[data-k="dunit"]', 'mi'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '[data-k="dist"]')) === '9.32', 'commute: 15 km shows as 9.32 miles');
  check(!(await out()).includes('NaN'), 'commute: no NaN after unit switches');
};
