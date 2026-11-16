// #T899 EV range
export const path = '/vehicles/ev-range/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/ev-range/`); await page.waitForTimeout(300);
  const big = () => page.textContent('.ev .ev-big'), rows = () => page.textContent('.ev .ev-rows');
  const set = async (k, v) => { await page.fill(`.ev [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  check((await big()).includes('375 km'), `ev-range: 60 kWh at 16/100 km, mild, no factors = 375 km (${await big()})`);
  await set('speed', '120'); await set('temp', '-5');
  check((await page.inputValue('.ev [data-k="fs"]')) === '1.4' && (await page.inputValue('.ev [data-k="ft"]')) === '1.3', 'ev-range: speed and cold factors fill in');
  await page.check('.ev [data-k="heat"]'); await page.waitForTimeout(80);
  check((await big()).includes('187 km'), `ev-range: 120 km/h, -5 C, heater = 187 km (${await big()})`);
  await set('fs', '1');
  check(parseInt((await big()).replace(/\D/g, '')) > 187, 'ev-range: editing a factor changes the range');
  await set('fs', '1'); await set('ft', '1'); await set('fh', '1');
  // 60 kWh x 70% = 42 kWh at 11 kW = 3.8 h = 3 h 49 min
  check((await page.textContent('.ev .ev-charge')).includes('42 kWh in about 3 h 49 min'), `ev-range: charge 10 to 80% at 11 kW (${await page.textContent('.ev .ev-charge')})`);
  // New options: speed table, trip check, running cost, units
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await set('speed', '80'); await set('temp', '20'); await set('fs', '1'); await set('ft', '1'); await set('fh', '1'); await set('fl', '1');
  await page.uncheck('.ev [data-k="heat"]'); await page.waitForTimeout(80);
  const tab = await page.$$eval('.ev-tab tbody tr', (r) => r.map((x) => x.textContent));
  // 60 / (16 x 1.4) x 100 = 267.9; 60 / (16 x 0.85) x 100 = 441.2
  check(tab.length === 8 && tab.some((t) => t.startsWith('120 km/h268 km')) && tab.some((t) => t.startsWith('50 km/h441 km')), `ev-range: speed table (${JSON.stringify(tab)})`);
  await set('dist', '250');
  // 250 km x 16 / 100 = 40 kWh; (60 - 40) / 60 = 33%
  check((await page.textContent('.ev .ev-trip')).startsWith('Yes: you arrive with about 33% (40 kWh used)'), `ev-range: trip ok (${await page.textContent('.ev .ev-trip')})`);
  await set('dist', '400');
  // 64 kWh needed; 6 kWh reserve; short by 6 - (60 - 64) = 10 kWh; range kept 54 / 16 x 100 = 337.5 -> 338
  check((await page.textContent('.ev .ev-trip')).includes('10 kWh more') && (await page.textContent('.ev .ev-trip')).includes('about 338 km'), `ev-range: trip needs a stop (${await page.textContent('.ev .ev-trip')})`);
  await set('ep', '0.20'); await set('pl', '7'); await set('pp', '1.60');
  // 16 x 0.20 = 3.20 per 100 km; 7 x 1.60 = 11.20; 8.00 cheaper; 800 over 10,000 km
  check((await page.textContent('.ev .ev-cost')).includes('Electric: 3.20 per 100 km') && (await page.textContent('.ev .ev-cost')).includes('Petrol: 11.20') && (await page.textContent('.ev .ev-cost')).includes('8.00 cheaper per 100 km, 800 over'), `ev-range: running cost (${await page.textContent('.ev .ev-cost')})`);
  await page.selectOption('.ev [data-k="cu"]', 'whkm'); await set('per', '160');
  check((await big()).includes('375 km'), `ev-range: 160 Wh/km = 16 kWh/100 km (${await big()})`);
  await page.selectOption('.ev [data-k="du"]', 'mi');
  check((await big()).includes('233 miles'), `ev-range: miles output (${await big()})`);
  await set('kwh', '0');
  check((await page.textContent('.ev .ev-warn')).length > 5 && !(await page.textContent('.ev')).includes('NaN'), 'ev-range: zero battery gives a message, no NaN');
};
