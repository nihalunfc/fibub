// #T10 Budget planner: the new options (the older checks live in tests/run.mjs)
export const path = '/money/budget-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('.bg details').forEach((d) => (d.open = true)));
  // plan: one-line answer, people sharing, CSV
  check(/Type an amount/.test(await page.textContent('.p-answer')) && !/NaN/.test(await page.textContent('.p-answer')), 'budget: blank plan gets a friendly one-line answer');
  const inputs = await page.$$('.p-lines .l-amt');
  await inputs[0].fill('1000'); await page.fill('.p-buffer', '0'); await page.fill('.p-saved', '0');
  const ry = new Date(); ry.setMonth(ry.getMonth() + 10);
  await page.fill('.p-date', `${ry.getFullYear()}-${String(ry.getMonth() + 1).padStart(2, '0')}`);
  check(/costs .*1,000/.test(await page.textContent('.p-answer')) && /for 10 months/.test(await page.textContent('.p-answer')), 'budget: plan answer line ' + await page.textContent('.p-answer'));
  await page.fill('.p-people', '4');
  check(/250.* each for 4 people/.test(await page.textContent('.p-answer')), 'budget: cost per person for 4 people ' + await page.textContent('.p-answer'));
  const [d1] = await Promise.all([page.waitForEvent('download'), page.click('.p-csv')]);
  check(d1.suggestedFilename().endsWith('.csv'), 'budget: plan CSV downloads');
  // monthly: answer, guide choice, saving target (slider + typed), per period, biggest costs, CSV
  await page.click('[data-tab=month]'); await page.click('.m-example');
  check(/left each month/.test(await page.textContent('.m-answer')), 'budget: monthly one-line answer ' + await page.textContent('.m-answer'));
  await page.selectOption('.m-rule', '70-20-10');
  check(/70% needs, 20% wants and 10% savings/.test(await page.textContent('.m-guide')), 'budget: the guide follows the choice');
  await page.evaluate(() => { const s = document.querySelector('.m-tr-s'); s.value = '40'; s.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.waitForTimeout(100);
  check(await page.inputValue('.m-tr') === '40' && /Saving 40%/.test(await page.textContent('.m-trout')), 'budget: the target slider fills the typed box ' + await page.textContent('.m-trout'));
  await page.fill('.m-tr', '10'); await page.waitForTimeout(100);
  check(await page.inputValue('.m-tr-s') === '10' && /already there/.test(await page.textContent('.m-trout')), 'budget: typing the target moves the slider ' + await page.textContent('.m-trout'));
  check((await page.$$('.m-per tr')).length === 3 && (await page.$$('.m-top li')).length >= 1, 'budget: per week/month/year table and biggest costs');
  const [d2] = await Promise.all([page.waitForEvent('download'), page.click('.m-csv')]);
  check(d2.suggestedFilename().endsWith('.csv'), 'budget: monthly CSV downloads');
  // nothing stored unless the box is ticked
  check(await page.evaluate(() => localStorage.getItem('fibub-budget-v1')) === null, 'budget: still nothing stored while the box is unticked');
};
