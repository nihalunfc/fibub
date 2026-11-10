// #1732 Savings goal
export const path = '/money/savings-goal/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/savings-goal/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.sg [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  await page.selectOption('.sg [data-k="cur"]', 'USD');
  await set('target', '12000'); await set('start', '0'); await set('rate', '0'); await set('months', '24');
  check((await page.textContent('.sg .sg-r1')).includes('500.00'), 'savings-goal: 12,000 in 24 months at 0% = 500 a month');
  await set('rate', '4');
  const withInt = parseFloat((await page.textContent('.sg .sg-r1')).replace(/[^\d.]/g, ''));
  check(withInt < 500 && withInt > 470, 'savings-goal: interest lowers the monthly amount');
  await page.selectOption('.sg [data-k="mode"]', 'time'); await set('rate', '0'); await set('monthly', '1000');
  check((await page.textContent('.sg .sg-r1')).trim() === '1 year', 'savings-goal: 1,000 a month takes 1 year');
  await page.selectOption('.sg [data-k="kind"]', 'emergency'); await set('ess', '2000'); await set('mcover', '6');
  check((await page.textContent('.sg .sg-note')).includes('12,000'), 'savings-goal: emergency fund target = 6 x 2,000');
  await set('monthly', '0');
  check(await page.isVisible('.sg .sg-err'), 'savings-goal: no saving and no interest shows a message');
};
