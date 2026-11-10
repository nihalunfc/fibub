// #T833 IDV and NCB calculator (India)
export const path = '/money/idv-ncb/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/idv-ncb/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.idn [data-k="${k}"]`, v); };
  const txt = async (c) => page.textContent(`.idn ${c}`);
  await set('price', '800000'); await set('acc', '0'); await set('months', '30'); await set('cc', '1200'); await set('free', '3'); await page.waitForTimeout(100);
  check((await txt('.idn-s-dep')).includes('30%'), 'idv-ncb: 30 months = 30% depreciation (' + (await txt('.idn-s-dep')) + ')');
  check((await txt('.idn-s-idv')).includes('5,60,000'), 'idv-ncb: IDV 5,60,000 (' + (await txt('.idn-s-idv')) + ')');
  check((await txt('.idn-s-ncb')).includes('35%'), 'idv-ncb: 3 claim-free years = 35% NCB');
  check((await txt('.idn-s-ded')).includes('1,000'), 'idv-ncb: 1,200 cc compulsory deductible 1,000');
  check((await txt('.idn-dep0')).includes('15%'), 'idv-ncb: metal part at 30 months 15%');
  await set('cc', '1800'); await page.waitForTimeout(100);
  check((await txt('.idn-s-ded')).includes('2,000'), 'idv-ncb: over 1,500 cc deductible 2,000');
  await set('quoted', '500000'); await page.waitForTimeout(100);
  check((await txt('.idn-quote')).includes('60,000'), 'idv-ncb: quote 60,000 below the IDV');
  await page.fill('.idn [data-r="cost"]', '20000'); await set('labour', '5000'); await page.waitForTimeout(100);
  check((await txt('.idn-pay-no')).includes('20,000'), 'idv-ncb: payout without add-on 20,000 (' + (await txt('.idn-pay-no')) + ')');
  check((await txt('.idn-pay-zd')).includes('23,000'), 'idv-ncb: payout with add-on 23,000 (' + (await txt('.idn-pay-zd')) + ')');
  await set('months', '70'); await page.waitForTimeout(100);
  check((await txt('.idn-s-idv')).includes('agreed with the insurer'), 'idv-ncb: over 5 years the IDV is agreed');
};
