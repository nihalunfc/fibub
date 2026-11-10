// #T890 On-road price
export const path = '/money/on-road-price/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/on-road-price/`); await page.waitForTimeout(400);
  const big = () => page.textContent('.or .or-big'), rows = () => page.textContent('.or .or-rows');
  const set = async (k, v) => { await page.fill(`.or [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  // India: 8,00,000 + 10% road tax 80,000 + 1,000 + 30,000 + 500 = 9,11,500
  await set('rt', '10');
  check((await big()).startsWith('9,11,500 on-road'), `on-road-price: India 8 lakh at 10% = 9,11,500 (${await big()})`);
  check(!(await rows()).includes('TCS'), 'on-road-price: no TCS at 8 lakh');
  await set('ex', '1200000');
  check((await rows()).includes('TCS') && (await rows()).includes('12,000'), 'on-road-price: 1% TCS over 10 lakh');
  await page.selectOption('.or [data-k="veh"]', 'bike'); await page.waitForTimeout(80);
  check((await page.inputValue('.or [data-k="rt"]')) === '6', 'on-road-price: two-wheeler changes the state road tax');
  // Ontario: 30,000 + 2,000 freight at 13% HST = 36,160
  await page.selectOption('.or [data-k="region"]', 'ca'); await page.selectOption('.or [data-k="prov"]', 'on'); await page.waitForTimeout(80);
  check((await big()).startsWith('36,160 out-the-door'), `on-road-price: Ontario 32,000 at 13% = 36,160 (${await big()})`);
  await set('down', '6160');
  check((await page.textContent('.or .or-loan')).includes('borrow 30,000'), 'on-road-price: down payment gives the loan amount');
  await page.selectOption('.or [data-k="region"]', 'us'); await page.waitForTimeout(80);
  check((await big()).startsWith('32,100 out-the-door'), `on-road-price: US 30,000 at 7% = 32,100 (${await big()})`);
};
