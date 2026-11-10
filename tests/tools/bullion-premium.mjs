// #1609 Bullion premium
export const path = '/collecting/bullion-premium/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/collecting/bullion-premium/`); await page.waitForTimeout(400);
  await page.selectOption('.bp .cp-cur', 'usd');
  await page.selectOption('.bp .cp-unit', 'ozt');
  await page.fill('.bp tr[data-m=gold] .cp-own', '4000'); await page.waitForTimeout(100);
  const prem = async (i) => await page.textContent(`.bp .bp-res tr[data-i="${i}"] .bp-prem`);
  check((await prem(0)).trim() === '5.0%', `bullion-premium: 1 oz 999.9 gold at 4,200 vs spot 4,000 = 5.0% (${await prem(0)})`);
  check((await page.textContent('.bp .bp-out')).includes('5.0%'), 'bullion-premium: headline shows the premium');
  await page.fill('.bp tr[data-i="0"] input[data-k=price]', '4000'); await page.waitForTimeout(50);
  check((await prem(0)).trim() === '0.1%' || (await prem(0)).trim() === '0.0%', `bullion-premium: paying near metal value gives ~0% (${await prem(0)})`);
  await page.fill('.bp tr[data-i="0"] input[data-k=price]', '4200');
  await page.click('.bp .bp-add'); await page.waitForTimeout(50);
  await page.fill('.bp tr[data-i="1"] input[data-k=price]', '4100'); await page.waitForTimeout(50);
  const first = await page.textContent('.bp .bp-res tbody tr:first-child th');
  check(first.startsWith('Product 2'), `bullion-premium: cheapest premium is listed first (${first})`);
  check(await page.isVisible('.bp .bp-res .ax-pill.good'), 'bullion-premium: best one is marked');
  await page.click('.bp tr[data-i="1"] .bp-del'); await page.waitForTimeout(50);
  check((await prem(0)).trim() === '5.0%', 'bullion-premium: removing a row keeps the first result');
  await page.fill('.bp tr[data-i="0"] input[data-k=price]', ''); await page.waitForTimeout(50);
  check((await prem(0)).trim() === '–', 'bullion-premium: empty price shows a dash, not a number');
};
