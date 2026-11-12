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
};
