// #T866 Meal planner
export const path = '/everyday/meal-planner/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/meal-planner/`); await page.waitForTimeout(300);
  const R = '.mp ';
  const items = () => page.$$eval(R + '.mp-list li', (els) => els.map((e) => e.textContent));
  const stored = () => page.evaluate(() => localStorage.getItem('fibub-meal-plan-v1'));
  check((await page.inputValue(R + '[data-c="0-2"] .mp-name')) === 'Chicken fried rice' && (await items()).length > 10, 'meal-planner: example plan fills');
  const l = await items();
  check(l.includes('400 g rice') && l.includes('4 cloves garlic') && l.includes('500 ml milk') && l.includes('2 onions'), `meal-planner: same ingredients merge (${l.join(' | ')})`);
  check(!(await page.isChecked(R + '.mp-remember')) && (await stored()) === null, 'meal-planner: remember box unticked and nothing stored');
  await page.check(R + '.mp-remember'); await page.fill(R + '[data-c="6-3"] .mp-name', 'Popcorn'); await page.waitForTimeout(100);
  check(((await stored()) || '').includes('Popcorn'), 'meal-planner: ticking Remember stores the plan');
  await page.click(R + '.mp-clear'); await page.waitForTimeout(100);
  check((await stored()) === null && !(await page.isChecked(R + '.mp-remember')) && (await items()).length === 0, 'meal-planner: Clear removes the saved plan');
  await page.click(R + '.mp-example'); await page.waitForTimeout(100);
};
