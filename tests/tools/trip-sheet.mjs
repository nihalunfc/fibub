// #T892 Trip sheet
export const path = '/vehicles/trip-sheet/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/trip-sheet/`); await page.waitForTimeout(300);
  const big = () => page.textContent('.ts .ts-big'), rows = () => page.textContent('.ts .ts-out');
  // 40,000 freight; diesel 150 L x 95 = 14,250; tolls 2,500; bata 3 x 500 = 1,500 -> cost 18,250, profit 21,750
  check((await big()) === 'Profit 21,750', `trip-sheet: profit 21,750 (${await big()})`);
  check((await rows()).includes('18,250') && (await rows()).includes('6.00'), 'trip-sheet: cost 18,250 and 900 km / 150 L = 6.00 km/L');
  check((await rows()).includes('Driver gives back6,000'), 'trip-sheet: driver returns 10,000 - 2,500 - 1,500 = 6,000');
  await page.click('.ts [data-a="addfill"]');
  await page.fill('.ts .ts-fill:nth-child(2) .fl', '50'); await page.fill('.ts .ts-fill:nth-child(2) .fp', '95'); await page.waitForTimeout(80);
  check((await big()) === 'Profit 17,000', `trip-sheet: a second diesel fill lowers profit (${await big()})`);
  await page.fill('.ts [data-k="d2"]', '2026-11-14'); await page.dispatchEvent('.ts [data-k="d2"]', 'change'); await page.waitForTimeout(80);
  check((await page.inputValue('.ts [data-k="days"]')) === '5', 'trip-sheet: dates set the bata days');
  check(!(await page.evaluate(() => localStorage.getItem('fibub-tripsheet-v1'))), 'trip-sheet: nothing stored until the box is ticked');
  // more options: per-km figures, margin, expected mileage
  await page.goto(`${BASE}/vehicles/trip-sheet/`); await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  // cost 18,250 / 900 km = 20.28; freight 40,000 / 900 = 44.44; profit 21,750 / 900 = 24.17; margin 21,750 / 40,000 = 54.4%
  check((await rows()).includes('Cost per km20.28') && (await rows()).includes('Freight per km44.44') && (await rows()).includes('Profit per km24.17'), `trip-sheet: per-km figures (${await rows()})`);
  check((await rows()).includes('Margin on freight54.4%'), 'trip-sheet: margin 54.4%');
  check((await rows()).includes('Average diesel price per litre95.00'), 'trip-sheet: average diesel price 95.00');
  await page.fill('.ts [data-k="expkmpl"]', '5'); await page.waitForTimeout(80);
  // 900 km / 5 = 180 L expected, 150 L used: 30 L saved = 2,850
  check((await rows()).includes('Diesel saved30.0 L (2,850)'), `trip-sheet: 30 L saved against 5 km/L (${await rows()})`);
  await page.fill('.ts [data-k="expkmpl"]', '7'); await page.waitForTimeout(80);
  // 900 / 7 = 128.6 L expected: 21.4 L extra
  check((await rows()).includes('Extra diesel used21.4 L'), `trip-sheet: extra diesel against 7 km/L (${await rows()})`);
  await page.fill('.ts [data-k="odo2"]', '100000'); await page.waitForTimeout(80);
  check(!(await rows()).includes('NaN') && !(await rows()).includes('Cost per km'), 'trip-sheet: zero km leaves out the per-km lines');
};
