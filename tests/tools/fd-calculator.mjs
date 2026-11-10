// #1735 FD calculator
export const path = '/money/fd-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/fd-calculator/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.fd [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  const t = async (c) => (await page.textContent(`.fd ${c}`));
  await page.selectOption('.fd [data-k="cur"]', 'INR');
  await set('amt', '100000'); await set('rate', '7'); await set('len', '12'); await page.selectOption('.fd [data-k="comp"]', 'q'); await page.waitForTimeout(100);
  check((await t('.fd-mat')).includes('1,07,186'), 'fd-calculator: 1,00,000 at 7% quarterly for 1 year = 1,07,186');
  await page.selectOption('.fd [data-k="comp"]', 's'); await page.waitForTimeout(100);
  check((await t('.fd-mat')).includes('1,07,000'), 'fd-calculator: simple interest gives 1,07,000');
  await page.selectOption('.fd [data-k="comp"]', 'q'); await page.selectOption('.fd [data-k="unit"]', 'days'); await set('len', '365'); await page.waitForTimeout(100);
  check((await t('.fd-mat')).includes('1,07,186'), 'fd-calculator: 365 days equals 1 year');
  await page.selectOption('.fd [data-k="unit"]', 'months'); await set('len', '12');
  await page.selectOption('.fd [data-k="ladder"]', '3'); await page.waitForTimeout(100);
  check((await page.$$('.fd .fd-body tr')).length === 3, 'fd-calculator: a 3-term ladder shows 3 deposits');
  await page.selectOption('.fd [data-k="ladder"]', '1');
  await page.selectOption('.fd [data-k="type"]', 'rd'); await set('amt', '1000'); await set('rate', '6.5'); await page.waitForTimeout(100);
  check((await t('.fd-mat')).includes('12,429'), 'fd-calculator: RD 1,000 a month for 12 months at 6.5% quarterly = 12,429');
  check((await t('.fd-put')).includes('12,000'), 'fd-calculator: RD puts in 12,000');
  await set('rate', '-1');
  check(await page.isVisible('.fd .fd-err'), 'fd-calculator: bad rate shows a message');
};
