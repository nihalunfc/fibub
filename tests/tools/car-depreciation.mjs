// #T894 Car depreciation
export const path = '/money/car-depreciation/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/car-depreciation/`); await page.waitForTimeout(400);
  const big = () => page.textContent('.cd .cd-big'), rows = () => page.textContent('.cd .cd-rows');
  const set = async (k, v) => { await page.fill(`.cd [data-k="${k}"]`, v); await page.waitForTimeout(100); };
  // 20,000 x 0.85^3 = 12,282.50
  check((await big()).includes('12,282.50'), `car-depreciation: 20,000 at 15%/yr for 3 yr = 12,282.50 (${await big()})`);
  check((await rows()).includes('7,717.50'), 'car-depreciation: 7,717.50 lost');
  check((await page.locator('.cd .cd-tab tbody tr').count()) === 4, 'car-depreciation: table has years 0 to 3');
  check((await page.innerHTML('.cd .cd-chart')).includes('polyline'), 'car-depreciation: chart drawn');
  await set('km', '45000'); await set('typ', '15000');
  // +3 points a year: 18% loss a year (15 + 1*30000/10000 = 18%)
  check((await big()).includes('11,027.36'), `car-depreciation: km above typical adds loss, 20,000 x 0.82^3 = 11,027.36 (${await big()})`);
  await set('km', ''); await page.selectOption('.cd [data-k="mode"]', 'curve'); await page.waitForTimeout(150);
  // car curve 20, 14, 12: 20,000 x .8 x .86 x .88 = 12,108.80
  check((await big()).includes('12,108.80'), `car-depreciation: typical curve 20/14/12 = 12,108.80 (${await big()})`);
  await page.fill('.cd [data-y="0"]', '50'); await page.waitForTimeout(100);
  check(!(await big()).includes('12,108.80'), 'car-depreciation: editing a curve year changes the result');
  await set('years', '1'); await page.selectOption('.cd [data-k="vehicle"]', 'truck'); await page.waitForTimeout(150);
  check((await big()).includes('after 1 year'), 'car-depreciation: one year wording');
};
