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
  // New options (fresh page: E0 to E20, 15 km/L, 100 each)
  await page.goto(`${BASE}/vehicles/ethanol-blend/`); await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  // 100 x 29.8 / 32 = 93.125
  check((await t('be')).includes('less than 93.1'), `ethanol-blend: break-even price (${await t('be')})`);
  await page.selectOption('.eb [data-k="mu"]', 'l100'); await set('m', '5');
  // 5 L/100 km = 20 km/L; x 0.93125 = 18.625 km/L = 5.37 L/100 km
  check((await t('mile')).includes('5.4 L/100 km (was 5.0)'), `ethanol-blend: L/100 km mileage (${await t('mile')})`);
  await page.selectOption('.eb [data-k="mu"]', 'kml'); await set('m', '15');
  await set('tl', '40'); await set('tp', '30');
  // E10 and E85 for E30: B = 40 x 20 / 75 = 10.7 L, A = 29.3 L
  check((await t('mix')).startsWith('10.7 L of fuel B (85%) and 29.3 L of fuel A (10%)'), `ethanol-blend: mix for a target (${await t('mix')})`);
  await set('tp', '90');
  check((await t('mix')).includes('must be between'), 'ethanol-blend: target outside A..B explained');
  await set('ha', '10'); await set('hp', '0'); await set('aa', '30'); await set('ap', '40');
  // (10 x 0 + 30 x 40) / 40 = 30%
  check((await t('after')).startsWith('About E30 (30.0% ethanol) in 40.0 L'), `ethanol-blend: top-up blend (${await t('after')})`);
  await set('m', '0');
  check((await t('warn')).length > 5 && !(await page.textContent('.eb')).includes('NaN'), 'ethanol-blend: zero mileage, friendly message');
};
