// #32 sample size: find power, smallest effect, one-sided, survey margin
export const path = '/science/sample-size/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/science/sample-size/`); await page.waitForTimeout(600);
  const R = '.ss ', big = () => page.textContent(R + '.ss-big');
  const open = () => page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await open();
  check((await big()) === '64 per group', `sample size: default (${await big()})`);
  await page.selectOption(R + '.ss-sides', '1'); await page.waitForTimeout(400);
  check((await big()) === '51 per group' && (await page.textContent(R + '.ss-facts')).includes('one-sided'), `sample size: one-sided gives 51 (R: 50.15) (${await big()})`);
  await page.selectOption(R + '.ss-sides', '2');
  await page.selectOption(R + '.ss-find', 'power'); await page.fill(R + '.ss-nn', '64'); await page.waitForTimeout(400);
  check((await big()) === 'Power 80.1 %', `sample size: power with n = 64 (${await big()})`);
  await page.selectOption(R + '.ss-find', 'effect'); await page.waitForTimeout(400);
  check((await big()) === 'Difference 4.99', `sample size: smallest difference (${await big()})`);
  await page.fill(R + '.ss-nn', '1'); await page.waitForTimeout(400);
  check(!(await page.isHidden(R + '.ss-err')), 'sample size: n of 1 is refused');
  await page.fill(R + '.ss-nn', '64');
  await page.selectOption(R + '.ss-k', 'survey'); await page.selectOption(R + '.ss-find', 'power'); await page.fill(R + '.ss-nn', '385'); await page.waitForTimeout(400);
  check((await big()) === '± 4.99 %', `sample size: survey margin for 385 (${await big()})`);
  await page.selectOption(R + '.ss-k', 'prop'); await page.selectOption(R + '.ss-find', 'effect'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.ss-err')).includes('means only'), 'sample size: effect search needs means');
};
