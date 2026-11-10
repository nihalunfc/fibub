// #1614 Auction fees
export const path = '/collecting/auction-costs/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/collecting/auction-costs/`); await page.waitForTimeout(300);
  const t = async (s) => (await page.textContent(s)).replace(/,/g, '');
  check((await t('.ac .ac-total')).includes('1241.00'), `auction-costs: 1,000 + 20% + 13% tax on premium + 15 = 1,241 (${await t('.ac .ac-total')})`);
  check((await t('.ac .ac-max')).includes('1000.00'), `auction-costs: budget 1,241 allows a 1,000 bid (${await t('.ac .ac-max')})`);
  await page.selectOption('.ac .ac-on', 'all'); await page.waitForTimeout(100);
  check((await t('.ac .ac-total')).includes('1371.00'), `auction-costs: tax on hammer plus premium = 1,371 (${await t('.ac .ac-total')})`);
  await page.fill('.ac .ac-bp', '0'); await page.waitForTimeout(100);
  check((await t('.ac .ac-total')).includes('1145.00'), 'auction-costs: premium 0 and tax on all = 1,000 + 130 + 15');
  await page.click('.ac .ac-m[data-m=sell]'); await page.waitForTimeout(100);
  check((await t('.ac .ac-net')).includes('840.00'), `auction-costs: seller 1,000 - 15% - 10 = 840 (${await t('.ac .ac-net')})`);
  await page.fill('.ac .ac-sf', '0'); await page.waitForTimeout(100);
  check((await t('.ac .ac-net')).includes('850.00'), 'auction-costs: removing fixed fees raises the net');
};
