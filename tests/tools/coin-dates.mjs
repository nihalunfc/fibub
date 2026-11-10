// #1611 Coin dates
export const path = '/collecting/coin-dates/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/collecting/coin-dates/`); await page.waitForTimeout(300);
  let t = await page.textContent('.cd .cd-out');
  check(/AH 1300 = 1882\/83 CE/.test(t), `coin-dates: AH 1300 = 1882/83 (${t})`);
  check(/12 Nov 1882/.test(await page.textContent('.cd .cd-more')), 'coin-dates: AH year start date shown');
  await page.selectOption('.cd .cd-era', 'vs'); await page.fill('.cd .cd-year', '1976'); await page.waitForTimeout(100);
  check(/1919\/20/.test(await page.textContent('.cd .cd-out')), 'coin-dates: VS 1976 = 1919/20');
  await page.selectOption('.cd .cd-era', 'kollam'); await page.fill('.cd .cd-year', '1100'); await page.waitForTimeout(100);
  check(/1924\/25/.test(await page.textContent('.cd .cd-out')), 'coin-dates: Kollam 1100 = 1924/25');
  await page.selectOption('.cd .cd-era', 'thai'); await page.fill('.cd .cd-year', '2500'); await page.waitForTimeout(100);
  check(/= 1957 CE/.test(await page.textContent('.cd .cd-out')), 'coin-dates: Thai BE 2500 = 1957 (single year)');
  await page.click('.cd .cd-m[data-m=ce]'); await page.fill('.cd .cd-year', '1882'); await page.waitForTimeout(100);
  check(/1299 and 1300/.test(await page.textContent('.cd .cd-more')), 'coin-dates: 1882 CE falls in AH 1299 and 1300');
};
