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
};
