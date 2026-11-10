// #1607 Gold purity
export const path = '/collecting/gold-purity/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/collecting/gold-purity/`); await page.waitForTimeout(400);
  const out = async () => await page.textContent('.gp .gp-out');
  check(/22 karat = 916\.7 fineness = 91\.67%/.test(await out()), `gold-purity: 22 karat = 916.7 = 91.67% (${await out()})`);
  await page.fill('.gp .gp-f', '750'); await page.waitForTimeout(50);
  check(/18 karat/.test(await out()) && (await page.inputValue('.gp .gp-p')) === '75', 'gold-purity: fineness 750 gives 18 karat and 75%');
  await page.fill('.gp .gp-p', '58.5'); await page.waitForTimeout(50);
  check((await page.inputValue('.gp .gp-k')) === '14.04', 'gold-purity: 58.5% is about 14 karat');
  await page.fill('.gp .gp-k', '30'); await page.waitForTimeout(50);
  check(await page.isVisible('.gp .gp-warn'), 'gold-purity: karat above 24 shows a warning');
  await page.fill('.gp .gp-k', '22');
  await page.selectOption('.gp .cp-cur', 'usd');
  await page.selectOption('.gp .cp-unit', 'g');
  await page.fill('.gp tr[data-m=gold] .cp-own', '100'); await page.waitForTimeout(100);
  check((await page.textContent('.gp tr[data-k="22"] .gp-g')).includes('91.67'), `gold-purity: 22k at 100 per gram = 91.67 (${await page.textContent('.gp tr[data-k="22"] .gp-g')})`);
  check((await page.textContent('.gp tr[data-k="24"] .gp-g')).includes('100'), 'gold-purity: 24k at 100 per gram = 100');
};
