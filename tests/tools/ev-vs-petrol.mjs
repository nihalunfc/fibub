// #1780 EV vs petrol
export const path = '/vehicles/ev-vs-petrol/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/ev-vs-petrol/`); await page.waitForTimeout(400);
  const R = '.ev ', big = () => page.textContent(R + '.ev-big');
  check((await big()) === 'Electric costs least: 46,778 over 8 years', `ev: default totals (${await big()})`);
  check((await page.textContent(R + '.ev-say')).includes('about 4.9 years'), 'ev: break-even about 4.9 years');
  check((await page.textContent(R + '.ev-out')).includes('51,000'), 'ev: hybrid total 51,000');
  await page.uncheck(R + '[data-k="hyOn"]'); await page.waitForTimeout(100);
  check(!(await page.textContent(R + '.ev-out')).includes('Hybrid'), 'ev: hybrid column can be switched off');
  await page.fill(R + '[data-k="fuel"]', '0.10'); await page.waitForTimeout(100);
  check((await big()).startsWith('Petrol costs least'), `ev: cheap petrol flips the winner (${await big()})`);
  check((await page.textContent(R + '.ev-say')).includes('never earns back'), 'ev: never breaks even when petrol is cheaper to run');
  // more options: break-even distance, cost per 100 km, units
  await page.goto(`${BASE}/vehicles/ev-vs-petrol/`); await page.waitForTimeout(400);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  check((await page.textContent(R + '.ev-km')).includes('more than about 3,690 km a year'), `ev: break-even distance about 3,690 km (${await page.textContent(R + '.ev-km')})`);
  // petrol 8 L/100 km x 1.60 = 12.80 per 100 km; electric 17 x (0.85 x 0.15 + 0.15 x 0.45) = 3.31 per 100 km
  check((await page.textContent(R + '.ev-out')).includes('12.80') && /3\.3[12]/.test(await page.textContent(R + '.ev-out')), 'ev: cost per 100 km 12.80 petrol, about 3.31 electric');
  await page.selectOption(R + '[data-k="punit"]', 'mpgus'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '[data-k="pL"]')) === '29.4', `ev: 8 L/100 km shows as 29.4 mpg US (${await page.inputValue(R + '[data-k="pL"]')})`);
  check((await page.textContent(R + '.ev-out')).includes('12.80'), 'ev: same car after the unit switch');
  await page.selectOption(R + '[data-k="kunit"]', 'kmkwh'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '[data-k="eK"]')) === '5.88', `ev: 17 kWh/100 km shows as 5.88 km/kWh (${await page.inputValue(R + '[data-k="eK"]')})`);
  check((await big()) === 'Electric costs least: 46,778 over 8 years' || (await big()).startsWith('Electric costs least: 46,7'), `ev: winner unchanged after unit switches (${await big()})`);
  await page.fill(R + '[data-k="km"]', '0'); await page.waitForTimeout(100);
  check(!(await page.textContent(R + '.ev-out')).includes('NaN'), 'ev: zero km gives no NaN');
};
