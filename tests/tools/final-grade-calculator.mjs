// #T926 Final grade
export const path = '/everyday/final-grade-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/final-grade-calculator/`); await page.waitForTimeout(300);
  const R = '.fg ';
  const big = () => page.textContent(R + '.fg-big');
  const say = () => page.textContent(R + '.fg-say');
  const set = async (k, v) => { await page.fill(R + `[data-k="${k}"]`, v); await page.waitForTimeout(80); };
  check((await big()) === '92.0% needed', `final-grade: 82% now, final 30%, target 85% -> 92.0% (${await big()})`);
  check((await page.locator(R + '.fg-table tbody tr').count()) === 4, 'final-grade: table has A-D rows');
  check((await page.textContent(R + '.fg-table tbody tr:first-child')).includes('108.7%'), 'final-grade: A (90%) needs 108.7%');
  await set('t', '95'); check((await say()).includes('over 100%'), 'final-grade: impossible target says over 100%');
  await page.fill(R + '[data-c="A"]', '93'); await page.waitForTimeout(80);
  check((await page.textContent(R + '.fg-table tbody tr:first-child')).includes('93.0%'), 'final-grade: cut-off edit changes table');
  await set('w', '0'); check((await big()) === '' && (await say()).includes('weight of 0'), 'final-grade: weight 0 gives a message');
  await page.click(R + '.fg-reset'); await page.waitForTimeout(80); check((await big()) === '92.0% needed', 'final-grade: reset');
};
