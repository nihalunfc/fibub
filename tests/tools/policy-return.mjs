// #T859 Endowment, money-back and ULIP return (IRR)
export const path = '/money/policy-return/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/policy-return/`); await page.waitForTimeout(300);
  const set = async (c, v) => { await page.fill(`.pr ${c}`, v); };
  const txt = async (c) => page.textContent(`.pr ${c}`);
  await page.selectOption('.pr [data-k="cur"]', 'USD');
  await set('[data-k="prem"]', '100'); await set('[data-k="pay"]', '2'); await set('.pr-by', '2'); await set('.pr-ba', '231');
  await set('[data-k="term"]', '0'); await set('[data-k="rate"]', '8'); await page.waitForTimeout(100);
  check((await txt('.pr-s-irr')).includes('10.00%'), 'policy-return: pay 100 twice, get 231 in year 2 = 10.00% (' + (await txt('.pr-s-irr')) + ')');
  check((await txt('.pr-s-paid')).includes('200'), 'policy-return: total paid in is 200');
  check((await page.$$('.pr .pr-body tr')).length === 3, 'policy-return: years 0 to 2 in the table');
  await page.click('.pr .pr-add'); await page.waitForTimeout(50);
  check((await page.$$('.pr .pr-row')).length === 2, 'policy-return: Add a payout adds a row');
  await set('[data-k="term"]', '100'); await page.waitForTimeout(100);
  check((await txt('.pr-s-inv')).replace(/[^\d]/g, '') === '0', 'policy-return: term premium equal to premium leaves nothing to invest');
  await set('[data-k="prem"]', '0'); await page.waitForTimeout(100);
  check(await page.isVisible('.pr .pr-err'), 'policy-return: no premium shows a message');
};
