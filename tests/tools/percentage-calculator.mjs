// #1716 Percentage calculator
export const path = '/money/percentage-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/percentage-calculator/`); await page.waitForTimeout(400);
  const R = '.pc ';
  const big = () => page.textContent(R + '.pc-big');
  const set = async (k, v) => { await page.fill(R + `[data-k="${k}"]`, v); await page.waitForTimeout(100); };
  const tab = async (m) => { await page.click(R + `.pc-tabs [data-m="${m}"]`); await page.waitForTimeout(150); };
  check((await big()) === '12', 'percentage: 15% of 80 is 12');
  await tab('what'); check((await big()) === '15%', 'percentage: 12 is 15% of 80');
  await tab('chg'); await set('a', '50'); await set('b', '40'); check((await big()) === '-20%', 'percentage: 50 to 40 is -20%');
  await tab('add'); check((await big()) === '113', 'percentage: 100 plus 13% = 113');
  await page.selectOption(R + '[data-k="how"]', 'inc'); await set('amt', '113'); check((await big()) === '100', 'percentage: 113 including 13% -> 100');
  await tab('stack'); check((await big()).startsWith('37 % off'), `percentage: 30 then 10 -> 37% (${await big()})`);
  await tab('mm'); await set('c', '80'); await set('p', '100'); check((await big()).includes('Markup 25%') && (await big()).includes('Margin 20%'), 'percentage: cost 80 price 100 -> markup 25, margin 20');
  await tab('of'); await set('y', '0'); check((await big()) === '0', 'percentage: zero amount is fine');
};
