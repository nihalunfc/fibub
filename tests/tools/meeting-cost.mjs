// #1777 Meeting cost
export const path = '/money/meeting-cost/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/meeting-cost/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.mc [data-k="${k}"]`, v); };
  const txt = async (c) => page.textContent(`.mc ${c}`);
  await page.selectOption('.mc [data-k="cur"]', 'USD');
  await set('n', '6'); await set('amt', '50'); await set('min', '60'); await page.waitForTimeout(100);
  check((await txt('.mc-s-one')).includes('300'), '6 people x 50/h x 1 h = 300 (' + (await txt('.mc-s-one')) + ')');
  check((await txt('.mc-s-year')).includes('14,400'), 'weekly for 48 weeks = 14,400 (' + (await txt('.mc-s-year')) + ')');
  await page.selectOption('.mc [data-k="unit"]', 'year'); await set('amt', '104000'); await page.waitForTimeout(100);
  check((await txt('.mc-s-hr')).includes('300.00'), 'yearly 104,000 over 2,080 h = 50/h, 300 an hour for 6');
  await set('oh', '20'); await page.waitForTimeout(100);
  check((await txt('.mc-s-one')).includes('360'), '20 percent extra gives 360');
  await page.click('.mc .mc-go'); await page.waitForTimeout(1400);
  check((await txt('.mc-t')) !== '0:00', 'the meter runs (' + (await txt('.mc-t')) + ')');
  await page.click('.mc .mc-reset');
  check((await txt('.mc-t')) === '0:00', 'reset sets the meter to 0:00');
  await set('n', '0'); await page.waitForTimeout(100);
  check(await page.isVisible('.mc .mc-err'), 'zero people shows a message');
};
