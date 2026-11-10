// #T832 Claim or pay for the repair yourself?
export const path = '/money/claim-or-pay/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/claim-or-pay/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.clm [data-k="${k}"]`, v); };
  const txt = async (c) => page.textContent(`.clm ${c}`);
  await page.selectOption('.clm [data-k="cur"]', 'INR');
  await set('base', '10000'); await set('chance', '0'); await set('years', '3'); await set('rate', '0');
  await page.selectOption('.clm [data-k="level"]', '5'); await page.waitForTimeout(100);
  check((await txt('.clm-s-tot')).includes('10,500'), 'claim-or-pay: extra premiums 10,500 (' + (await txt('.clm-s-tot')) + ')');
  check((await page.$$('.clm .clm-body tr')).length === 3, 'claim-or-pay: three year rows');
  await set('repair', '8000'); await set('ded', '1000'); await page.waitForTimeout(100);
  check((await txt('.clm-words')).includes('paying the repair yourself costs less'), 'claim-or-pay: paying yourself costs less for an 8,000 repair');
  await set('repair', '50000'); await page.waitForTimeout(100);
  check((await txt('.clm-words')).includes('claiming costs less'), 'claim-or-pay: a big repair makes claiming cheaper');
  await set('repair', '500'); await page.waitForTimeout(100);
  check((await txt('.clm-words')).includes('pay nothing'), 'claim-or-pay: a repair under the deductible pays nothing');
  await page.selectOption('.clm [data-k="mode"]', 'own'); await set('ladder', '0, 10, 20'); await page.waitForTimeout(100);
  check((await page.$$('.clm .clm-level option')).length === 3, 'claim-or-pay: own table has three levels');
  await set('base', '0'); await page.waitForTimeout(100);
  check(await page.isVisible('.clm .clm-err'), 'claim-or-pay: no premium shows a message');
};
