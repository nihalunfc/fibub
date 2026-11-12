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
};
