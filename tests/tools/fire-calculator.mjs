// #1733 FIRE calculator
export const path = '/money/fire-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/fire-calculator/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.fi [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  await page.selectOption('.fi [data-k="cur"]', 'USD');
  await set('spend', '40000'); await set('wr', '4'); await set('income', '60000'); await set('saved', '0'); await set('ret', '0');
  check((await page.textContent('.fi .fi-num')).includes('1,000,000'), 'fire-calculator: spend 40,000 at 4% gives 1,000,000');
  check((await page.textContent('.fi .fi-years')).includes('50'), 'fire-calculator: 20,000 a year at 0% return takes 50 years');
  await set('wr', '3');
  check((await page.textContent('.fi .fi-num')).includes('1,333,333'), 'fire-calculator: a 3% rate raises the number');
  await set('saved', '2000000');
  check((await page.textContent('.fi .fi-years')).includes('Already'), 'fire-calculator: enough saved says already there');
  check((await page.$$('.fi .fi-body tr')).length === 7, 'fire-calculator: seven rows in the saving-rate table');
  await set('wr', '0');
  check(await page.isVisible('.fi .fi-err'), 'fire-calculator: bad rate shows a message');
};
