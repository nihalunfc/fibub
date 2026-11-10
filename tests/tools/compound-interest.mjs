// #1723 Compound interest
export const path = '/money/compound-interest/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/compound-interest/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.ci [data-k="${k}"]`, v); };
  const val = async (c) => (await page.textContent(`.ci ${c}`)).replace(/[^\d.]/g, '');
  await page.selectOption('.ci [data-k="cur"]', 'USD');
  await set('start', '1000'); await set('dep', '0'); await set('rate', '5'); await set('years', '10');
  await page.selectOption('.ci [data-k="comp"]', '1'); await page.waitForTimeout(100);
  check((await page.textContent('.ci .ci-s-bal')).includes('1,628.89'), 'compound-interest: 1000 at 5% yearly for 10 years = 1,628.89');
  await page.selectOption('.ci [data-k="comp"]', '12'); await page.waitForTimeout(100);
  check((await page.textContent('.ci .ci-s-bal')).includes('1,647.01'), 'compound-interest: monthly compounding gives 1,647');
  await set('dep', '100'); await page.waitForTimeout(100);
  check((await page.textContent('.ci .ci-s-put')).includes('13,000'), 'compound-interest: 100 a month for 10 years puts in 13,000');
  await set('infl', '3'); await page.waitForTimeout(100);
  check(/\d/.test(await page.textContent('.ci .ci-s-real')), 'compound-interest: shows today\'s money with inflation');
  check((await page.textContent('.ci .ci-72')).includes('14.4'), 'compound-interest: rule of 72 says 14.4 years');
  check((await page.$$('.ci .ci-body tr')).length === 10, 'compound-interest: ten rows in the year table');
  await set('years', '0'); await page.waitForTimeout(100);
  check(await page.isVisible('.ci .ci-err'), 'compound-interest: bad years shows a message');
};
