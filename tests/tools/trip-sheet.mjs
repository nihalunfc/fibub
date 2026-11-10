// #T892 Trip sheet
export const path = '/money/trip-sheet/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/trip-sheet/`); await page.waitForTimeout(300);
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
};
