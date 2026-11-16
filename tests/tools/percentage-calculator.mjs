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
  // new options
  await tab('sale'); check((await big()) === '60', `percentage: 25% off 80 = 60 (${await big()})`);
  await set('tax', '10'); check((await page.textContent(R + '.pc-say')).includes('total is 66'), 'percentage: sale price with tax on top');
  await tab('whole'); check((await big()) === '80', 'percentage: 12 is 15% of 80');
  await set('p', '0'); check((await page.textContent(R + '.pc-say')).includes('zero'), 'percentage: whole with 0% says divide by zero');
  await tab('diff'); check((await big()) === '26.09%', `percentage: difference 50 vs 65 (${await big()})`);
  await tab('mm'); await set('w', '20');
  check((await page.textContent(R + '.pc-say')).includes('sell at 100'), 'percentage: price for wanted margin');
  await tab('of'); await set('y', '1,200'); await set('x', '10'); check((await big()) === '120', 'percentage: commas allowed');
  await set('x', '-10'); check((await big()) === '-120', 'percentage: negative percent works');
  await set('x', ''); check((await big()) === '', 'percentage: blank shows no answer');
};
