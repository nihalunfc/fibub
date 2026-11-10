// #1718 Fuel cost
export const path = '/money/fuel-cost/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/fuel-cost/`); await page.waitForTimeout(400);
  const R = '.fc ';
  const big = () => page.textContent(R + '.fc-big');
  const set = async (k, v) => { await page.fill(R + `[data-k="${k}"]`, v); await page.waitForTimeout(100); };
  check((await big()) === '12.00 fuel cost', `fuel: 100 km, 8 L/100km, 1.50 = 12.00 (${await big()})`);
  await page.check(R + '[data-k="round"]'); await set('n', '2'); await page.waitForTimeout(100);
  check((await big()) === '24.00 fuel cost' && (await page.textContent(R + '.fc-say')).includes('12.00 each'), 'fuel: round trip, split 2');
  await page.selectOption(R + '[data-k="eu"]', 'mpgus'); await set('eco', '29.4');
  check(((await big()).startsWith('24.0')), `fuel: 29.4 mpg US is about 8 L/100 km (${await big()})`);
  await page.selectOption(R + '[data-k="cu"]', 'l100'); await set('cv', '8');
  check((await page.textContent(R + '.fc-cvt')).includes('mpg (US)29.4'), 'fuel: 8 L/100 km = 29.4 mpg US');
  check((await page.textContent(R + '.fc-cvt')).includes('mpg (UK)35.3') && (await page.textContent(R + '.fc-cvt')).includes('km/L12.5'), 'fuel: UK mpg and km/L');
};
