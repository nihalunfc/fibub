// #1718 Fuel cost
export const path = '/vehicles/fuel-cost/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/fuel-cost/`); await page.waitForTimeout(400);
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
  // New options: presets, extra rows, weekly cost, second vehicle, fill-up
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await set('n', '1'); await page.uncheck(R + '[data-k="round"]'); await page.selectOption(R + '[data-k="eu"]', 'l100'); await set('eco', '8');
  await page.click(R + '[data-preset="250"]'); await page.waitForTimeout(100);
  // 250 km x 8 / 100 = 20 L x 1.50 = 30.00; per km 0.120; per mile 0.193; 20 L = 5.28 US gal = 4.40 UK gal
  check((await big()) === '30.00 fuel cost', `fuel: preset 250 km = 30.00 (${await big()})`);
  const rows = await page.textContent(R + '.fc-rows');
  check(rows.includes('Cost per km0.120') && rows.includes('Cost per mile0.193') && rows.includes('Cost per 100 km12.00') && rows.includes('US gallons5.28') && rows.includes('UK gallons4.40'), `fuel: extra rows (${rows})`);
  await set('tpw', '10');
  // 30 x 10 = 300 a week, 1,300 a month, 15,600 a year
  check((await page.textContent(R + '[data-o="repeat"]')).includes('300.00 a week, 1,300.00 a month, 15,600.00 a year'), `fuel: weekly cost (${await page.textContent(R + '[data-o="repeat"]')})`);
  await set('eco2', '6');
  // 250 km x 6 / 100 = 15 L x 1.5 = 22.50, 7.50 less = 25%
  check((await page.textContent(R + '[data-o="cmp"]')).includes('22.50: 7.50 less than this one (25%)'), `fuel: second vehicle (${await page.textContent(R + '[data-o="cmp"]')})`);
  await set('fd', '500'); await set('ff', '40');
  // 40 / 500 x 100 = 8.00 L/100 km = 29.4 mpg US
  check((await page.textContent(R + '[data-o="fill"]')).includes('8.00 L/100 km') && (await page.textContent(R + '[data-o="fill"]')).includes('29.4 mpg (US)'), `fuel: fill-up economy (${await page.textContent(R + '[data-o="fill"]')})`);
  await set('dist', '0');
  check((await big()) === '' && (await page.textContent(R + '.fc-say')).includes('Type the distance') && !(await page.textContent(R)).includes('NaN'), 'fuel: zero distance gives a friendly message, no NaN');
};
