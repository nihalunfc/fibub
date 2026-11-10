// #T835 How much life insurance do I need?
export const path = '/money/life-cover-needed/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/life-cover-needed/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.lc [data-k="${k}"]`, v); };
  const txt = async (c) => page.textContent(`.lc ${c}`);
  const digits = (s) => s.replace(/[^\d]/g, '');
  await page.selectOption('.lc [data-k="cur"]', 'USD');
  for (const [k, v] of Object.entries({ income: '100000', own: '0', years: '5', growth: '0', disc: '0', debts: '0', goals: '0', funeral: '0', assets: '0', existing: '0' })) await set(k, v);
  await page.waitForTimeout(100);
  check(digits(await txt('.lc-s-hlv')) === '500000', 'life-cover-needed: 100,000 for 5 years = human life value 500,000 (' + (await txt('.lc-s-hlv')) + ')');
  check(digits(await txt('.lc-s-needs')) === '500000', 'life-cover-needed: needs approach 500,000 with nothing else');
  check(digits(await txt('.lc-s-mult')) === '1000000', 'life-cover-needed: 10 times income shown for comparison');
  await set('debts', '200000'); await set('existing', '100000'); await page.waitForTimeout(100);
  check(digits(await txt('.lc-s-needs')) === '600000', 'life-cover-needed: debts add and existing cover subtracts');
  await set('own', '50'); await page.waitForTimeout(100);
  check(digits(await txt('.lc-s-hlv')) === '250000', 'life-cover-needed: own share halves the family amount');
  await set('income', '0'); await page.waitForTimeout(100);
  check(await page.isVisible('.lc .lc-err'), 'life-cover-needed: no income shows a message');
};
