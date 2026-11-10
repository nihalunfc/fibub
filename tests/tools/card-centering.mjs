// #1606 Card centering
export const path = '/collecting/card-centering/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/collecting/card-centering/`); await page.waitForTimeout(300);
  check((await page.textContent('.cd .cd-f-lr')).includes('60/40'), `card-centering: 3 and 2 gives 60/40 (${await page.textContent('.cd .cd-f-lr')})`);
  check((await page.textContent('.cd .cd-f-tb')).includes('50/50'), 'card-centering: 2.5 and 2.5 gives 50/50');
  await page.fill('.cd .cd-fr', '1'); await page.waitForTimeout(100);
  check((await page.textContent('.cd .cd-f-lr')).includes('75/25'), 'card-centering: changing a border changes the split (3 and 1 = 75/25)');
  await page.fill('.cd .cd-ft', '0'); await page.fill('.cd .cd-fb', '4'); await page.waitForTimeout(100);
  check((await page.textContent('.cd .cd-f-tb')).includes('100/0'), 'card-centering: all border on one side is 100/0');
  check((await page.locator('.cd .cd-figs svg').count()) === 1, 'card-centering: one drawing for the front');
  await page.fill('.cd .cd-bl', '2'); await page.fill('.cd .cd-br', '3'); await page.waitForTimeout(100);
  check((await page.textContent('.cd .cd-b-lr')).includes('60/40') && (await page.locator('.cd .cd-figs svg').count()) === 2, 'card-centering: back side adds a second result and drawing');
};
