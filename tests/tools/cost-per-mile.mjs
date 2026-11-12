// #T905 Cost per mile
export const path = '/vehicles/cost-per-mile/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/cost-per-mile/`); await page.waitForTimeout(300);
  const big = () => page.textContent('.cp .cp-big'), rows = () => page.textContent('.cp .cp-rows');
  const set = async (k, v) => { await page.fill(`.cp [data-k="${k}"]`, v); await page.waitForTimeout(100); };
  // 4,000 / 10,000 = 0.40; fuel 4 / 6.5 = 0.6154; + 0.15 + 0.60 = 1.7654
  check((await big()).startsWith('1.77 a mile'), `cost-per-mile: 1.77 a mile (${await big()})`);
  check((await rows()).includes('0.62') && (await rows()).includes('1.96'), 'cost-per-mile: fuel 0.62 and 10% margin rate 1.96');
  await set('dist', '5000');
  check((await big()).startsWith('2.17 a mile'), `cost-per-mile: fewer miles, higher cost (${await big()})`); // 0.8 + 0.6154 + 0.15 + 0.60 = 2.1654
  await set('dist', '10000'); await page.selectOption('.cp [data-k="paid"]', 'hour'); await set('hrs', '200'); await set('dph', '30'); // 6,000 / 10,000 = 0.60
  check((await big()).startsWith('1.77 a mile'), 'cost-per-mile: driver paid by the hour, same 0.60 a mile');
  await set('tonnes', '20');
  check((await rows()).includes('Cost per tonne-mile') && (await rows()).includes('0.09'), 'cost-per-mile: per tonne figure');
  await page.selectOption('.cp [data-k="unit"]', 'km');
  check((await big()).includes('a km') && (await page.textContent('.cp .u-e')) === 'km per litre', 'cost-per-mile: kilometres switch the wording');
};
