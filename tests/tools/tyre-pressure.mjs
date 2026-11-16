// #T898 Tyre pressure
export const path = '/vehicles/tyre-pressure/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/tyre-pressure/`); await page.waitForTimeout(300);
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
  // New options: temperature table, degrees F, sidewall maximum, placard note
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await set('t2', '-10');
  const tab = await page.$$eval('.tp-tab tbody tr', (r) => r.map((x) => [...x.children].map((c) => c.textContent)));
  // 35 psi at 20 C: at -20 C = 28.2 psi (-6.8); at 40 C = 38.4 psi (+3.4); at 20 C itself 35.0 (+0.0)
  check(tab.length === 7 && tab[0].join('|') === '-20|28.2|-6.8' && tab[6].join('|') === '40|38.4|+3.4' && tab[4].join('|') === '20|35.0|+0.0', `tyre-pressure: temperature table (${JSON.stringify(tab)})`);
  await page.selectOption('.tp [data-k="tu"]', 'f'); await page.waitForTimeout(100);
  check((await page.inputValue('.tp [data-k="t1"]')) === '68' && (await page.inputValue('.tp [data-k="t2"]')) === '14', 'tyre-pressure: switching to F converts the boxes');
  check((await t('change')).startsWith('29.9 psi') && (await t('change')).includes('14 °F'), `tyre-pressure: same answer in F (${await t('change')})`);
  check((await page.$$eval('.tp-tab tbody tr', (r) => r.map((x) => x.children[0].textContent))).join() === '-4,14,32,50,68,86,104', 'tyre-pressure: table in F');
  check((await t('fill')).includes('32.5 psi'), `tyre-pressure: fill answer unchanged in F (${await t('fill')})`);
  await set('mx', '30');
  check((await page.textContent('.tp .tp-warn')).startsWith('Stop:'), 'tyre-pressure: fill above the sidewall maximum warns');
  await set('mx', '51');
  check((await page.textContent('.tp .tp-warn')) === '', 'tyre-pressure: under the maximum, no warning');
  check((await page.textContent('.tp')).includes('placard'), 'tyre-pressure: placard note shown');
  await set('p1', ''); 
  check(!(await page.textContent('.tp')).includes('NaN'), 'tyre-pressure: blank pressure, no NaN');
};
