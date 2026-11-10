// #T900 EV range
export const path = '/money/ev-range/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/ev-range/`); await page.waitForTimeout(300);
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
};
