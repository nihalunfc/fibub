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
};
