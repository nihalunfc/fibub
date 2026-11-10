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
};
