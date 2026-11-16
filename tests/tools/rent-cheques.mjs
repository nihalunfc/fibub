// #T993 Rent cheques
export const path = '/money/rent-cheques/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/rent-cheques/`); await page.waitForTimeout(300);
  const txt = async (c) => (await page.textContent(`.rc ${c}`)) || '';
  const set = async (k, v) => { await page.evaluate(() => document.querySelectorAll('.rc details').forEach((d) => (d.open = true))); await page.fill(`.rc [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  await page.selectOption('.rc [data-k="cur"]', 'USD'); await page.waitForTimeout(100);
  check((await txt('.rc-pay')).includes('15,000'), 'rent-cheques: 60,000 in 4 is 15,000 (' + (await txt('.rc-pay')) + ')');
  check((await txt('.rc-day')).includes('21,500'), 'rent-cheques: day one 21,500 (' + (await txt('.rc-day')) + ')');
  check((await txt('.rc-true')).includes('5,291.67'), 'rent-cheques: true monthly 5,291.67 (' + (await txt('.rc-true')) + ')');
  check((await page.$$('.rc .rc-sched tr')).length === 4 && (await txt('.rc-sched')).includes('Start of month 10'), 'rent-cheques: schedule has 4 rows ending in month 10');
  await set('stay', '6'); await set('pen', '2');
  check((await txt('.rc-exit')).includes('43,500'), 'rent-cheques: leaving early costs 43,500 (' + (await txt('.rc-exit')) + ')');
  await set('disc', '5');
  check((await txt('.rc-pay')).includes('14,250'), 'rent-cheques: 5% discount makes each payment 14,250 (' + (await txt('.rc-pay')) + ')');
  const rows = await page.$$eval('.rc .rc-cmp tr', (r) => r.map((x) => x.textContent));
  check(rows[0].includes('57,000') && rows[3].includes('60,000'), 'rent-cheques: discount applies to 1 payment but not 12 (' + rows.join(' | ') + ')');
};
