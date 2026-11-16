// #T941 Tyre age
export const path = '/vehicles/tyre-age/?now=2026-11-12';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/tyre-age/?now=2026-11-12`); await page.waitForTimeout(300);
  const t = (s) => page.textContent(`.ta ${s}`);
  const set = async (v) => { await page.fill('.ta .ta-in', v); await page.waitForTimeout(80); };
  check((await t('.ta-big')).includes('week 24 of 2023'), `tyre-age: 2423 -> week 24 of 2023 (${await t('.ta-big')})`);
  check((await t('.ta-age')).startsWith('3 years 5 months'), `tyre-age: age on 2026-11-12 (${await t('.ta-age')})`);
  check((await t('.ta-pill')) === 'Normal checks', 'tyre-age: under 5 years is normal checks');
  await set('1018'); check((await t('.ta-pill')) === 'Check every year', 'tyre-age: 2018 is 8 years -> check yearly');
  await set('1016'); check((await t('.ta-pill')) === 'Replace', 'tyre-age: 2016 is 10 years -> Replace');
  await set('5420'); check((await t('.ta-err')).includes('01 to 53'), 'tyre-age: week 54 is refused');
  await set('231'); check((await t('.ta-age')).includes('1990s'), 'tyre-age: three digits = 1990s');
  await set('12'); check((await t('.ta-err')).length > 0, 'tyre-age: two digits is refused');
  await page.goto(`${BASE}/vehicles/tyre-age/`); await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach(d => d.open = true));
  const ml = await page.textContent('.ta .ta-miles');
  check(ml.includes('5 years in Jun 2028') && ml.includes('10 years in Jun 2033'), 'tyre-age: milestones from week 24 of 2023');
  await page.fill('.ta [data-k="s1"]', '2423'); await page.fill('.ta [data-k="s2"]', '1019'); await page.waitForTimeout(100);
  check((await page.textContent('.ta .ta-setres')).includes('more than two years'), 'tyre-age: set with mixed ages warns');
};
