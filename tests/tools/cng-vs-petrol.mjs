// #T948 CNG vs petrol
export const path = '/vehicles/cng-vs-petrol/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/cng-vs-petrol/`); await page.waitForTimeout(300);
  const t = (k) => page.textContent(`.cv [data-o="${k}"]`);
  // petrol 105/15 = 7.00, CNG 90/22 = 4.09; saving 2.909 * 1500 = 4363.6/month; 95000 / 4363.6 = 21.8 months
  check((await t('km')).includes('₹7.00') && (await t('km')).includes('₹4.09'), `cng-vs-petrol: per km 7.00 and 4.09 (${await t('km')})`);
  check((await t('pay')).includes('21.8 months'), `cng-vs-petrol: payback 21.8 months (${await t('pay')})`);
  await page.fill('.cv [data-k="gp"]', '200'); await page.waitForTimeout(80);
  check((await t('pay')).includes('does not save'), 'cng-vs-petrol: dearer gas -> no saving');
};
