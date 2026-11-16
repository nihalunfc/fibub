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
  // new options: kg/g merge, people scaling, already at home, tick off, bad numbers
  await page.fill(R + '[data-c="6-0"] .mp-ing', '500 g flour\n1 kg flour'); await page.waitForTimeout(100);
  check((await items()).includes('1½ kg flour'), `meal-planner: 500 g + 1 kg merge to 1½ kg (${(await items()).filter((x) => x.includes('flour'))})`);
  await page.fill(R + '[data-c="6-0"] .mp-ing', ''); await page.waitForTimeout(100);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.fill(R + '.mp-from', '2'); await page.fill(R + '.mp-to', '4'); await page.waitForTimeout(100);
  let l2 = await items();
  check(l2.includes('800 g rice') && l2.includes('8 cloves garlic') && l2.includes('1 l milk') && l2.includes('4 onions') && l2.includes('8 eggs'), `meal-planner: shopping for 4 instead of 2 doubles the list (${l2.join(' | ')})`);
  await page.fill(R + '.mp-to', '3'); await page.waitForTimeout(100);
  l2 = await items();
  check(l2.includes('600 g rice') && l2.includes('750 ml milk') && l2.includes('3 onions') && l2.includes('6 eggs'), `meal-planner: x1.5 list (${l2.join(' | ')})`);
  await page.fill(R + '.mp-have', 'rice\nmilk'); await page.waitForTimeout(100);
  l2 = await items();
  check(!l2.some((x) => /rice|milk/.test(x)) && l2.some((x) => x.includes('pasta')), `meal-planner: already at home items are left off (${l2.join(' | ')})`);
  await page.click(R + '.mp-list li input'); await page.waitForTimeout(100);
  check(/^1 of \d+ ticked off$/.test(await page.textContent(R + '.mp-left')), `meal-planner: tick off count (${await page.textContent(R + '.mp-left')})`);
  await page.fill(R + '.mp-from', '0'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.mp-left')).includes('above 0') && !(await page.textContent(R + '.mp-list')).includes('NaN'), 'meal-planner: zero people gives a message, amounts as typed');
  await page.click(R + '.mp-clear'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.mp-to')) === '' && (await page.inputValue(R + '.mp-have')) === '', 'meal-planner: Clear also empties the people and at-home boxes');
  await page.click(R + '.mp-example'); await page.waitForTimeout(100);
};
