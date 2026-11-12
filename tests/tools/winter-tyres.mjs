// #T943 Winter tyres
export const path = '/vehicles/winter-tyres/?now=2026-11-12';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/winter-tyres/?now=2026-11-12`); await page.waitForTimeout(300);
  const t = (s) => page.textContent(`.wt ${s}`);
  const set = async (k, v) => { await page.fill(`.wt [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  const sym = async (v) => { await page.check(`.wt input[name="sym"][value="${v}"]`, { force: true }); await page.waitForTimeout(80); };
  await sym('snowflake'); await set('tread', '6'); await set('dot', '4523');
  await page.check('.wt [data-k="psi"]'); await page.waitForTimeout(80);
  check((await t('.wt-pill')) === 'Ready', `winter-tyres: snowflake + 6 mm + 3 years -> Ready (${await t('.wt-pill')})`);
  await sym('ms'); await set('tread', '3');
  check((await t('.wt-pill')) === 'Not ready', 'winter-tyres: M+S only + 3 mm -> Not ready');
  await sym('snowflake'); await set('tread', '6'); await page.uncheck('.wt [data-k="psi"]'); await page.waitForTimeout(80);
  check((await t('.wt-pill')) === 'Check these', 'winter-tyres: pressure not checked -> Check these');
  check((await t('.wt-rules')).length > 20, 'winter-tyres: rules shown');
  await page.selectOption('.wt [data-k="region"]', 'uk'); await page.waitForTimeout(80);
  check((await t('.wt-rules')).includes('No winter tyre law in the UK'), 'winter-tyres: UK rule');
  await page.goto(`${BASE}/vehicles/winter-tyres/?c=usa`); await page.waitForTimeout(300);
  check((await page.inputValue('.wt [data-k="region"]')) === 'usa' && (await page.inputValue('.wt [data-k="unit"]')) === '32', 'winter-tyres: ?c=usa opens in USA mode');
};
