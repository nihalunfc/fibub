// #1601 Melt value
export const path = '/collecting/melt-value/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/collecting/melt-value/`); await page.waitForTimeout(400);
  await page.selectOption('.mv .cp-cur', 'usd');
  await page.selectOption('.mv .cp-unit', 'ozt');
  check(/rough values/i.test(await page.textContent('.mv .cp-src')), 'melt-value: says when today\'s prices could not be loaded');
  await page.fill('.mv tr[data-m=silver] .cp-own', '30');
  await page.waitForTimeout(100);
  check((await page.textContent('.mv .mv-total')).includes('23.20'), `melt-value: Morgan dollar at $30/oz = $23.20 (${await page.textContent('.mv .mv-total')})`);
  await page.selectOption('.mv .mv-preset', '1'); await page.waitForTimeout(100);
  check((await page.textContent('.mv .mv-total')).includes('44.91'), `melt-value: plus ten 90% dimes = $44.91 (${await page.textContent('.mv .mv-total')})`);
  check(/pure silver/i.test(await page.textContent('.mv .mv-facts')), 'melt-value: shows pure silver total');
  await page.click('.mv tr[data-i="1"] .mv-del'); await page.waitForTimeout(100);
  check((await page.textContent('.mv .mv-total')).includes('23.20'), 'melt-value: removing a row updates the total');
  await page.click('.mv .cp-clear'); await page.waitForTimeout(100);
  check((await page.textContent('.mv .mv-total')).includes('38.67'), `melt-value: Clear my prices goes back to the built-in price ($50) = $38.67 (${await page.textContent('.mv .mv-total')})`);
  check(await page.evaluate(() => !localStorage.getItem('fibub-melt-list-v1') && !localStorage.getItem('fibub-my-prices-v1')), 'melt-value: nothing kept on the device unless ticked');
};
