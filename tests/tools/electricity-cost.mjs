// #1779 Electricity cost
export const path = '/money/electricity-cost/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/electricity-cost/`); await page.waitForTimeout(400);
  const R = '.ec ', big = () => page.textContent(R + '.ec-big');
  check((await big()) === '7.29 a month', `electricity: fridge + TV at 0.15 = 7.29 (${await big()})`);
  check((await page.inputValue(R + '.ec-body .k-dummy').catch(() => '')) === '' && (await page.textContent(R + '.ec-body')).includes('36.0'), 'electricity: fridge 150 W x 8 h x 30 d = 36 kWh');
  await page.fill(R + '[data-k="flat"]', '0.20'); await page.waitForTimeout(100);
  check((await big()) === '9.72 a month', `electricity: price 0.20 (${await big()})`);
  await page.selectOption(R + '[data-k="mode"]', 'tou'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ec-rows')).includes('0.1240'), 'electricity: time-of-use blended 0.124 per kWh');
  await page.selectOption(R + '[data-k="preset"]', '8'); await page.click(R + '[data-k="add"]'); await page.waitForTimeout(100);
  check((await page.$$(R + '.ec-body tr')).length === 3, 'electricity: adding an appliance');
  await page.click(R + '.ec-body .x'); await page.waitForTimeout(100);
  check((await page.$$(R + '.ec-body tr')).length === 2, 'electricity: removing an appliance');
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  check((await page.textContent(R + '.ec-top')).includes('Fridge') || (await page.textContent(R + '.ec-top')).includes('Television'), 'electricity: biggest spenders listed');
  await page.selectOption(R + '[data-k="mode"]', 'flat'); await page.fill(R + '[data-k="cut"]', '50'); await page.waitForTimeout(100);
  check((await page.textContent(R + '[data-k="save"]')).includes('fewer hours saves'), `electricity: what-if text (${await page.textContent(R + '[data-k="save"]')})`);
  await page.selectOption(R + '[data-k="mode"]', 'slab'); await page.waitForTimeout(100);
  const sv = (i, c, v) => page.fill(R + `.ec-sb tr:nth-child(${i}) .${c}`, v);
  await sv(1, 'sf', '0'); await sv(1, 'st', '30'); await sv(1, 'sr', '0.10'); await sv(2, 'sf', '30'); await sv(2, 'st', '200'); await sv(2, 'sr', '0.20'); await sv(3, 'sf', '');
  await page.waitForTimeout(100);
  check((await big()) === '17.66 a month', `electricity: slab 30 kWh at 0.10 + 73.3 kWh at 0.20 = 17.66 (${await big()})`);
  check((await page.textContent(R + '.ec-slabout')).includes('0.2000'), 'electricity: slab marginal price is 0.2000');
  await page.fill(R + '[data-k="vat"]', '10'); await page.fill(R + '[data-k="fixed"]', '1'); await page.waitForTimeout(100);
  check((await big()) === '20.53 a month', `electricity: slab + 1 fixed + 10% VAT = 20.53 (${await big()})`);
};
