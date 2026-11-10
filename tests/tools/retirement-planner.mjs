// #1734 Retirement planner
export const path = '/money/retirement-planner/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/retirement-planner/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.rp [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  await page.selectOption('.rp [data-k="cur"]', 'USD');
  for (const [k, v] of [['now', '60'], ['retire', '65'], ['planto', '85'], ['saved', '100000'], ['monthly', '1000'], ['before', '0'], ['after', '0'], ['infl', '0'], ['spend', '2000'], ['other', '0']]) await set(k, v);
  const t = async (c) => (await page.textContent(`.rp ${c}`));
  check((await t('.rp-pot')).includes('160,000'), 'retirement-planner: pot at 65 is 160,000');
  check((await t('.rp-until')).startsWith('71 and 8'), 'retirement-planner: lasts until 71 and 8 months');
  check((await t('.rp-gap')).includes('320,000') && (await t('.rp-gapl')).includes('Short'), 'retirement-planner: short by 320,000');
  await set('other', '2000');
  check((await t('.rp-until')).includes('85+') && (await t('.rp-gapl')).includes('Spare'), 'retirement-planner: pension covering spending means it lasts');
  await set('retire', '50');
  check(await page.isVisible('.rp .rp-err'), 'retirement-planner: retiring before today shows a message');
};
