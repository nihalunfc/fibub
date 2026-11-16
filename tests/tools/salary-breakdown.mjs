// #T991 Salary split
export const path = '/money/salary-breakdown/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/salary-breakdown/`); await page.waitForTimeout(300);
  const txt = async (c) => (await page.textContent(`.sb ${c}`)) || '';
  const set = async (k, v) => { await page.fill(`.sb [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  await page.selectOption('.sb [data-k="cur"]', 'USD');
  check((await txt('.sb-lead')).includes('60.0%'), 'salary-breakdown: 9,000 of 15,000 is 60% (' + (await txt('.sb-lead')) + ')');
  check((await txt('.sb-d30')).includes('300.00') && (await txt('.sb-d365')).includes('295.89'), 'salary-breakdown: daily basic 300.00 and 295.89');
  check((await txt('.sb-ot')).includes('37.50'), 'salary-breakdown: overtime base 37.50');
  check((await txt('.sb-eos')).includes('6,300'), 'salary-breakdown: end-of-service 6,300 (' + (await txt('.sb-eos')) + ')');
  check((await txt('.sb-cmp')).includes('4,200') && (await txt('.sb-cmp')).includes('2,100'), 'salary-breakdown: 40% basic gives 4,200, 2,100 less (' + (await txt('.sb-cmp')) + ')');
  await page.selectOption('.sb [data-k="mode"]', 'pct'); await set('total', '20000'); await set('basic', '50'); await set('housing', '30'); await set('transport', '10');
  check((await txt('.sb-eos')).includes('7,000'), 'salary-breakdown: percent mode, 50% of 20,000 gives 7,000 end-of-service (' + (await txt('.sb-eos')) + ')');
  await set('basic', '90');
  check(await page.isVisible('.sb .sb-err'), 'salary-breakdown: parts over 100% shows a message');
};
