// #T949 2-stroke mix
export const path = '/vehicles/two-stroke-mix/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/two-stroke-mix/`); await page.waitForTimeout(300);
  const t = (k) => page.textContent(`.ts [data-o="${k}"]`);
  const set = async (k, v) => { await page.fill(`.ts [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  check((await t('oil')).startsWith('100.0 ml'), `two-stroke-mix: 5 L at 50:1 -> 100 ml (${await t('oil')})`);
  await page.selectOption('.ts [data-k="u"]', 'usgal'); await set('v', '1'); await page.waitForTimeout(80);
  check((await t('oil')).startsWith('75.7 ml') && (await t('oz')).startsWith('2.6 US fl oz'), `two-stroke-mix: 1 US gal at 50:1 -> 75.7 ml, 2.6 oz (${await t('oil')}, ${await t('oz')})`);
  await page.selectOption('.ts [data-k="u"]', 'l'); await page.selectOption('.ts [data-k="mode"]', 'oil'); await set('v', '100');
  check((await t('pet')).includes('5 litres'), `two-stroke-mix: 100 ml oil -> 5 L petrol (${await t('pet')})`);
  await set('cap', '20');
  check((await t('caps')).includes('5.0 capfuls'), 'two-stroke-mix: 100 ml / 20 ml cap = 5 capfuls');
  await page.goto(`${BASE}/vehicles/two-stroke-mix/?c=usa`); await page.waitForTimeout(300);
  check((await page.inputValue('.ts [data-k="u"]')) === 'usgal', 'two-stroke-mix: ?c=usa presets US gallons');
  // New options (fresh page: litres, 50:1)
  await page.goto(`${BASE}/vehicles/two-stroke-mix/`); await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  const tab = await page.$$eval('.ts-tab tbody tr', (r) => r.map((x) => [...x.children].map((c) => c.textContent).join('|')));
  // 5 L at 50:1 = 100 ml = 3.4 US fl oz; 20 L = 400 ml = 13.5 oz
  check(tab.length === 7 && tab[4] === '5|100.0|3.4' && tab[6] === '20|400.0|13.5', `two-stroke-mix: mixing table (${JSON.stringify(tab)})`);
  check((await t('pc')).includes('about 1.96% oil in the finished mix (1 part oil in 51 parts), or 2% of'), `two-stroke-mix: oil percent (${await t('pc')})`);
  await page.selectOption('.ts [data-k="r"]', '20');
  check((await t('pc')).startsWith('20:1 is about 4.76%'), `two-stroke-mix: 20:1 preset (${await t('pc')})`);
  await page.selectOption('.ts [data-k="r"]', '50');
  await set('fv', '5'); await set('fr', '25');
  // 5 L at 25:1 holds 200 ml of oil; at 50:1 that oil needs 10 L of petrol: add 5 L
  check((await t('fix')).startsWith('Too much oil: add 5 litres of plain petrol (5 L) to get to 50:1'), `two-stroke-mix: dilute (${await t('fix')})`);
  await set('fr', '100');
  // 5 L at 100:1 holds 50 ml; 50:1 needs 100 ml: add 50 ml = 1.7 oz
  check((await t('fix')).startsWith('Too lean: add 50.0 ml (1.7 US fl oz)'), `two-stroke-mix: add oil (${await t('fix')})`);
  await set('v', '-3');
  check((await t('warn')).length > 5 && !(await page.textContent('.ts')).includes('NaN'), 'two-stroke-mix: negative amount, friendly message');
};
