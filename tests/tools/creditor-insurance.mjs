// #T886 Mortgage life insurance vs term life
export const path = '/money/creditor-insurance/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/creditor-insurance/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.ci [data-k="${k}"]`, v); };
  const txt = async (c) => page.textContent(`.ci ${c}`);
  await page.selectOption('.ci [data-k="cur"]', 'INR');
  await set('loan', '120000'); await set('rate', '0'); await set('years', '10'); await page.waitForTimeout(100);
  const row2 = await txt('.ci-body tr:nth-child(2)');
  check(row2.includes('1,08,000'), 'creditor-insurance: balance at start of year 2 is 1,08,000 (' + row2 + ')');
  await set('loan', '100'); await set('years', '2'); await set('cred', '0.8333333333'); await set('term', '0.6666666667'); await set('cover', '100'); await page.waitForTimeout(100);
  check((await txt('.ci-s-cp')).includes('133.33'), 'creditor-insurance: creditor 133.33 per 1,000 (' + (await txt('.ci-s-cp')) + ')');
  check((await txt('.ci-s-tp')).includes('80.00'), 'creditor-insurance: term 80.00 per 1,000 (' + (await txt('.ci-s-tp')) + ')');
  check((await page.$$('.ci .ci-body tr')).length === 2, 'creditor-insurance: two year rows');
  await page.selectOption('.ci [data-k="mode"]', 'pct'); await set('cred', '10'); await page.waitForTimeout(100);
  check((await txt('.ci-s-cc')).includes('15'), 'creditor-insurance: 10% of balances 100 and 50 costs 15 (' + (await txt('.ci-s-cc')) + ')');
  await set('loan', '0'); await page.waitForTimeout(100);
  check(await page.isVisible('.ci .ci-err'), 'creditor-insurance: no loan shows a message');
};
