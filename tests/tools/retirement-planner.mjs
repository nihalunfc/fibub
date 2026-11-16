// #1734 Retirement planner
export const path = '/money/retirement-planner/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/retirement-planner/`); await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true))); /* OPEN-DETAILS */ const __op = () => page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true))); for (const m of ['fill', 'selectOption', 'check', 'uncheck', 'click']) { const o = page[m].bind(page); page[m] = async (...a) => { await __op(); return o(...a); }; } /* WRAP-OPEN */  await page.waitForTimeout(300);
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
  // new options
  await set('retire', '65'); await set('other', '0');
  const fix = await t('.rp-fix');
  check(fix.includes('5,333') && fix.includes('74'), 'retirement-planner: shows the extra monthly saving (5,333) and the earliest retirement age (74)');
  check(fix.includes('667'), 'retirement-planner: shows affordable spending 667 a month');
  check((await t('.rp-body')).includes('<td>65</td>') || (await page.locator('.rp .rp-body tr').count()) >= 20, 'retirement-planner: year-by-year table has rows');
  await page.click('.rp .rp-more summary');
  await page.fill('.rp [data-k="otherfrom"]', '75'); await set('other', '1000');
  check((await t('.rp-gap')).includes('200,000'), 'retirement-planner: pension starting at 75 leaves a 200,000 shortfall');
  await page.fill('.rp [data-k="otherfrom"]', '60'); await page.waitForTimeout(80);
  check(await page.isVisible('.rp .rp-err'), 'retirement-planner: pension start before retiring shows a message');
  await page.fill('.rp [data-k="otherfrom"]', '');
  await page.click('.rp [data-k="preset-cautious"]'); await page.waitForTimeout(80);
  check((await page.inputValue('.rp [data-k="before"]')) === '4', 'retirement-planner: preset fills returns');
  await set('infl', '3'); await page.selectOption('.rp [data-k="basis"]', 'future'); await page.waitForTimeout(80);
  check((await t('.rp-msg')).includes('future money') && !(await t('.rp-msg')).includes('NaN'), 'retirement-planner: future-money view');
  await set('now', '');
  check(await page.isVisible('.rp .rp-err'), 'retirement-planner: blank age shows a message');
};
