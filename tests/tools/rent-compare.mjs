// #T953 Rent compare
export const path = '/money/rent-compare/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/rent-compare/`);
  await page.waitForFunction(() => /Found: L5B/.test(document.querySelector('.rc-homes')?.textContent || ''), null, { timeout: 5000 }).catch(() => {});
  const big = () => page.textContent('.rc .rc-big'), rank = () => page.textContent('.rc .rc-rank');
  check((await big()).includes('B. Basement in Brampton costs least: $2,550') && (await big()).includes('$229 less than A'), `rent-compare: worked example ranks B first (${(await big()).slice(0, 160)})`);
  check((await big()).includes('adds 25 hours') && (await big()).includes('$9.22'), 'rent-compare: extra hours and saving per hour');
  check((await rank()).includes('$2,779') && (await page.textContent('.rc .rc-mx')).includes('40.7 km'), 'rent-compare: A total and B road km to work');
  await page.fill('.rc [data-s="timeValue"]', '15'); await page.waitForTimeout(100);
  check((await big()).startsWith('A. Apartment in Mississauga') && (await big()).includes('lowest rent but costs more'), 'rent-compare: time at $15/h makes A best');
  await page.fill('.rc [data-c="1-0"] [data-o="km"]', '30'); await page.waitForTimeout(100);
  check((await page.textContent('.rc [data-c="1-0"] .est')).startsWith('30.0 km,'), 'rent-compare: typed km replaces the estimate');
  await page.fill('.rc [data-h="0"] [data-f="loc"]', 'https://www.google.com/maps/@43.6532,-79.3832,15z'); await page.waitForTimeout(100);
  check((await page.textContent('.rc [data-h="0"] [data-w]')).includes('43.65320, -79.38320'), 'rent-compare: map link gives exact coordinates');
  await page.fill('.rc [data-h="0"] [data-f="loc"]', 'Z9Z'); await page.waitForTimeout(100);
  check((await page.textContent('.rc [data-h="0"] [data-w]')).startsWith('Not found') && (await big()).includes('no location yet'), 'rent-compare: bad location says so and leaves travel out');
  await page.click('.rc [data-add="home"]'); await page.waitForTimeout(100);
  check((await page.$$('.rc [data-h]')).length === 3 && !(await rank()).includes('NaN'), 'rent-compare: add a third home, no NaN');
  check(await page.evaluate(() => localStorage.getItem('fibub-rent-compare-v1') === null), 'rent-compare: nothing stored until the box is ticked');
};
