// #1784 Mileage log
export const path = '/money/mileage-log/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/mileage-log/`); await page.waitForTimeout(400);
  const R = '.ml ', big = () => page.textContent(R + '.ml-big');
  const add = async (d, type) => { await page.fill(R + '[data-k="dist"]', d); await page.selectOption(R + '[data-k="type"]', type); await page.click(R + '[data-k="add"]'); await page.waitForTimeout(100); };
  check((await page.inputValue(R + '[data-k="r1"]')) === '0.73', 'mileage: Canada rate 0.73');
  await add('100', 'b');
  check((await big()) === '73.00 allowance on 100.0 business km', `mileage: 100 km business (${await big()})`);
  await add('50', 'p');
  check((await page.textContent(R + '.ml-rows')).includes('66.7%'), 'mileage: business share 66.7%');
  await page.selectOption(R + '[data-k="region"]', 'us'); await page.waitForTimeout(100);
  check((await big()) === '72.50 allowance on 100.0 business mi', `mileage: US 72.5 cents per mile (${await big()})`);
  await page.selectOption(R + '[data-k="region"]', 'uk'); await page.fill(R + '[data-k="lim"]', '60'); await page.waitForTimeout(100);
  check((await big()).startsWith('43.00 allowance'), `mileage: UK 60 x 0.55 + 40 x 0.25 = 43.00 (${await big()})`);
  await page.click(R + '[data-del="0"]'); await page.waitForTimeout(100);
  check((await page.$$(R + '.ml-body tr')).length === 1, 'mileage: delete a trip');
  await page.click(R + '[data-k="clear"]'); await page.waitForTimeout(100);
  check((await page.$$(R + '.ml-body tr')).length === 0, 'mileage: clear all');
};
