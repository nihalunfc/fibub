// #T898 Tyre pressure
export const path = '/money/tyre-pressure/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/tyre-pressure/`); await page.waitForTimeout(300);
  const t = (k) => page.textContent(`.tp [data-o="${k}"]`);
  const set = async (k, v) => { await page.fill(`.tp [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  // (35 + 14.696) psi * 263.15 / 293.15 - 14.696 = 29.9 psi
  check((await t('change')).startsWith('29.9 psi'), `tyre-pressure: 35 psi at 20 C -> 29.9 psi at -10 C (${await t('change')})`);
  check((await t('conv')).includes('2.41 bar') && (await t('conv')).includes('241.3 kPa'), `tyre-pressure: 35 psi = 2.41 bar = 241.3 kPa (${await t('conv')})`);
  await set('cv', '2.5'); await page.selectOption('.tp [data-k="cu"]', 'bar');
  check((await t('conv')).includes('36.3 psi'), 'tyre-pressure: 2.5 bar = 36.3 psi');
  await set('t2', '40');
  check(parseFloat(await t('change')) > 35, 'tyre-pressure: warmer air raises pressure');
  // fill now at 5 C so it reads 35 psi at 20 C: (49.696 * 278.15 / 293.15) - 14.696 = 32.5
  check((await t('fill')).includes('32.5 psi'), `tyre-pressure: fill to 32.5 psi at 5 C (${await t('fill')})`);
};
