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
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.selectOption('.mc [data-k="unit"]', 'hour'); await set('n', '6'); await set('amt', '50'); await set('oh', '0'); await set('min', '60');
  // roles: 2 x 100/h + 4 x 25/h = 300/h for 1 h
  await set('r1c', '2'); await set('r1p', '100'); await set('r2c', '4'); await set('r2p', '25'); await page.waitForTimeout(100);
  check((await txt('.mc-s-hr')).includes('300.00'), 'roles: 2x100 + 4x25 = 300 an hour (' + (await txt('.mc-s-hr')) + ')');
  // cut 15 of 60 min: 300/60*15 = 75.00 each time
  check((await txt('[data-k="cuttext"]')).includes('75.00'), 'cut 15 minutes saves 75 (' + (await txt('[data-k="cuttext"]')) + ')');
};
