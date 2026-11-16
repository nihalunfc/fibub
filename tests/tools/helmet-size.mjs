// #T911 Helmet size
export const path = '/vehicles/helmet-size/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/helmet-size/`); await page.waitForTimeout(300);
  const big = () => page.textContent('.hs .hs-big');
  check((await big()) === 'Size M', `helmet-size: 57 cm = M (${await big()})`);
  await page.selectOption('.hs .hs-u', 'in'); await page.fill('.hs .hs-v', '22.5'); await page.waitForTimeout(100);
  check((await big()) === 'Size M', `helmet-size: 22.5 in = M (${await big()})`);
  await page.selectOption('.hs .hs-u', 'cm'); await page.fill('.hs .hs-v', '62'); await page.waitForTimeout(100);
  check((await big()) === 'Size XL', 'helmet-size: 62 cm = XL');
  await page.fill('.hs .hs-v', '50'); await page.waitForTimeout(100);
  check((await big()) === 'No size' && (await page.textContent('.hs .hs-note')).includes('youth'), 'helmet-size: 50 cm below table');
  // New options: fit checklist and helmet age
  await page.fill('.hs .hs-v', '57'); await page.waitForTimeout(80);
  check((await page.textContent('.hs .hs-chk')) === '', 'helmet-size: no ticks, no checklist message');
  await page.check('.hs [data-k="c1"]'); await page.check('.hs [data-k="c2"]'); await page.waitForTimeout(80);
  check((await page.textContent('.hs .hs-chk')).startsWith('2 of 5 checks pass'), `helmet-size: 2 of 5 (${await page.textContent('.hs .hs-chk')})`);
  for (const k of ['c3', 'c4', 'c5']) await page.check(`.hs [data-k="${k}"]`);
  await page.waitForTimeout(80);
  check((await page.textContent('.hs .hs-chk')).startsWith('All 5 checks pass'), 'helmet-size: all 5 pass');
  const yearNow = await page.evaluate(() => new Date().getFullYear());
  await page.fill('.hs [data-k="year"]', String(yearNow - 6)); await page.waitForTimeout(80);
  check((await page.textContent('.hs .hs-age')).includes('about 6 years old. Think about replacing'), `helmet-size: 6 years old (${await page.textContent('.hs .hs-age')})`);
  await page.fill('.hs [data-k="year"]', String(yearNow - 1)); await page.waitForTimeout(80);
  check((await page.textContent('.hs .hs-age')).includes('about 1 year old. Replace it after any crash'), 'helmet-size: 1 year old');
  await page.fill('.hs [data-k="year"]', '2999'); await page.waitForTimeout(80);
  check((await page.textContent('.hs .hs-age')).startsWith('Type a four-digit year') && !(await page.textContent('.hs')).includes('NaN'), 'helmet-size: future year, friendly message');
};
