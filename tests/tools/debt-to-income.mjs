// #1747 Debt-to-income
export const path = '/money/debt-to-income/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/debt-to-income/`); await page.waitForTimeout(400);
  const set = async (k, v) => { await page.fill(`.di [data-k="${k}"]`, v); await page.waitForTimeout(100); };
  check((await page.textContent('.di .di-big')).includes('25.0%'), 'debt-to-income: income 6,000, debts 1,500 = 25%');
  // Canada: front 39% of 6,000 = 2,340 - 400 = 1,940; back 44% = 2,640 - 1,500 - 400 = 740 -> 740 a month
  check((await page.textContent('.di .di-max')).includes('740 a month'), `debt-to-income: Canada TDS limit gives 740 a month (${await page.textContent('.di .di-max')})`);
  await page.selectOption('.di [data-k="region"]', 'us'); await page.waitForTimeout(100);
  // US: 36% of 6,000 = 2,160 - 1,500 - 400 = 260
  check((await page.textContent('.di .di-max')).includes('260 a month'), `debt-to-income: US 36% limit gives 260 a month (${await page.textContent('.di .di-max')})`);
  await set('debts', '0');
  check((await page.textContent('.di .di-max')).includes('1,280 a month'), 'debt-to-income: US with no debts, 28% less 400 = 1,280');
  await page.selectOption('.di [data-k="region"]', 'uk'); await page.waitForTimeout(100);
  check((await page.textContent('.di .di-max')).includes('324,000'), 'debt-to-income: UK 6,000 x 12 x 4.5 = 324,000');
  await set('housing', '2400');
  check((await page.textContent('.di .di-rows')).includes('40.0%'), 'debt-to-income: housing 2,400 adds to 40%');
};
