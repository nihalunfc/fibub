// #1782 Lease or buy
export const path = '/vehicles/lease-vs-buy/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/lease-vs-buy/`); await page.waitForTimeout(400);
  const R = '.lb ', big = () => page.textContent(R + '.lb-big'), rows = () => page.textContent(R + '.lb-rows');
  check(/Buying costs 1,\d\d\d less over 36 months/.test(await big()), `lease: default result (${await big()})`);
  check((await rows()).includes('22,000'), 'lease: lease total 2000 + 450 x 36 + 800 + 3000 excess = 22,000');
  check((await rows()).includes('695.9') || (await rows()).includes('696.0'), 'lease: loan payment about 695.97');
  await page.fill(R + '[data-k="kmy"]', '15000'); await page.waitForTimeout(100);
  check((await rows()).includes('19,000'), 'lease: no excess km gives 19,000');
  await page.fill(R + '[data-k="res"]', '10000'); await page.waitForTimeout(100);
  check((await big()).startsWith('Leasing costs'), `lease: low resale makes leasing cheaper (${await big()})`);
  await page.fill(R + '[data-k="rate"]', '0'); await page.waitForTimeout(100);
  check(!(await rows()).includes('NaN'), 'lease: 0% interest works');
};
