// #T947 Ethanol blend
export const path = '/vehicles/ethanol-blend/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/ethanol-blend/`); await page.waitForTimeout(300);
  const t = (k) => page.textContent(`.eb [data-o="${k}"]`);
  const set = async (k, v) => { await page.fill(`.eb [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  // E0 -> E20: 0.8*32+0.2*21 = 29.8 MJ/L -> 6.9% less, 15 -> 13.97 km/L
  check((await t('mile')).includes('14.0 km/L'), `ethanol-blend: E0 15 km/L -> E20 14.0 km/L (${await t('mile')})`);
  check((await t('drop')).includes('6.9%'), `ethanol-blend: E20 energy drop 6.9% (${await t('drop')})`);
  await set('p2', '90');
  check((await t('cost')).startsWith('Cost per km: 6.44'), `ethanol-blend: 90 / 13.97 = 6.44 per km (${await t('cost')})`);
  await page.selectOption('.eb [data-k="b2"]', 'custom'); await set('c2', '0');
  check((await t('drop')).includes('0.0%'), 'ethanol-blend: custom 0% -> no drop');
  await page.goto(`${BASE}/vehicles/ethanol-blend/?c=uk`); await page.waitForTimeout(300);
  check((await page.inputValue('.eb [data-k="b2"]')) === '10', 'ethanol-blend: ?c=uk presets E10');
};
