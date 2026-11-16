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
  // more options: break-even car value, what-if table, miles
  await page.goto(`${BASE}/vehicles/lease-vs-buy/`); await page.waitForTimeout(400);
  const tie = () => page.textContent(R + '.lb-tie');
  check((await tie()).includes('cost the same if the car is worth 20,759 after 36 months') && (await tie()).includes('buying wins'), `lease: tie value 20,759 (${await tie()})`);
  check((await page.locator(R + '.lb-sens tbody tr').count()) === 5, 'lease: five what-if rows');
  const sens = await page.textContent(R + '.lb-sens tbody');
  // car worth 22,000 x 0.8 = 17,600: buying costs 20,758.63 + 4,400 = 25,159 against 22,000 leased
  check(sens.includes('17,600 (-20%)') && sens.includes('25,159') && sens.includes('Lease') && sens.includes('Buy'), `lease: what-if table (${sens})`);
  await page.selectOption(R + '[data-k="du"]', 'mi'); await page.waitForTimeout(100);
  check((await rows()).includes('15,000 mi') && (await page.textContent(R)).includes('Miles you will drive'), 'lease: miles relabel the limits');
  await page.fill(R + '[data-k="res"]', '0'); await page.waitForTimeout(100);
  check(!(await page.textContent(R + '.lb-sens')).includes('NaN') && !(await tie()).includes('NaN'), 'lease: zero car value gives no NaN');
};
