// #T992 School fees
export const path = '/money/school-fee-planner/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/school-fee-planner/`); await page.waitForTimeout(300);
  const txt = async (c) => (await page.textContent(`.sf ${c}`)) || '';
  await page.selectOption('.sf [data-g="cur"]', 'USD'); await page.waitForTimeout(100);
  check((await txt('.sf-grand')).includes('31,525'), 'school-fee-planner: 10,000 at 5% for 3 years is 31,525 (' + (await txt('.sf-grand')) + ')');
  check((await txt('.sf-term')).includes('3,333.33'), 'school-fee-planner: 3,333.33 a term (' + (await txt('.sf-term')) + ')');
  check((await txt('.sf-save')).includes('875.00') && (await txt('.sf-save')).includes('10,500'), 'school-fee-planner: saves 875 a month (' + (await txt('.sf-save')) + ')');
  await page.click('.sf .sf-add'); await page.waitForTimeout(100);
  check((await page.$$('.sf .sf-row')).length === 2, 'school-fee-planner: add a child');
  const second = '.sf .sf-row:nth-child(2) ';
  await page.fill(second + '[data-k="grade"]', '12'); await page.fill(second + '[data-k="fee"]', '8000'); await page.waitForTimeout(100);
  check((await txt('.sf-grand')).includes('39,525'), 'school-fee-planner: second child adds 8,000 (' + (await txt('.sf-grand')) + ')');
  await page.click(second + '.sf-rm'); await page.waitForTimeout(100);
  check((await page.$$('.sf .sf-row')).length === 1 && (await txt('.sf-grand')).includes('31,525'), 'school-fee-planner: remove a child');
  await page.fill('.sf .sf-row [data-k="rise"]', '10'); await page.waitForTimeout(100);
  check((await txt('.sf-grand')).includes('33,100'), 'school-fee-planner: own rise 10% gives 33,100 (' + (await txt('.sf-grand')) + ')');
  await page.fill('.sf .sf-row [data-k="final"]', '5'); await page.waitForTimeout(100);
  check(await page.isVisible('.sf .sf-err'), 'school-fee-planner: final grade before current shows a message');
};
