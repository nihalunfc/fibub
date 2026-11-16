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
  // New options (fresh page)
  await page.goto(`${BASE}/vehicles/cng-vs-petrol/`); await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  const yr = await page.$$eval('.cv-tab:not(.cv-sens) tbody tr', (r) => r.map((x) => [...x.children].map((c) => c.textContent).join('|')));
  // year 1: petrol 126,000, gas 95,000 + 73,636 = 168,636 (42,636 behind); year 5: 630,000 vs 463,182 (166,818 ahead)
  check(yr.length === 5 && yr[0] === '1|₹1,26,000|₹1,68,636|₹42,636 behind' && yr[4] === '5|₹6,30,000|₹4,63,182|₹1,66,818 ahead', `cng-vs-petrol: year by year (${JSON.stringify(yr)})`);
  const sens = await page.$$eval('.cv-sens tbody tr', (r) => r.map((x) => [...x.children].map((c) => c.textContent).join('|')));
  // gas -20%: 72 / 22 = 3.27 per km, saves 5,591 a month, pays back in 95,000 / 5,590.9 = 17.0 months
  check(sens.length === 4 && sens[0].endsWith('|₹3.27|₹5,591|17.0 months') && sens[3].endsWith('73.3 months'), `cng-vs-petrol: price sensitivity (${JSON.stringify(sens)})`);
  check((await page.$$('.cv [data-o="chart"] path')).length === 2, 'cng-vs-petrol: chart drawn');
  await page.fill('.cv [data-k="share"]', '50'); await page.waitForTimeout(80);
  // half the km on gas: gas side 5.545 per km; saving 1.4545 x 1500 = 2181.8 a month; 95000 / 2181.8 = 43.5 months
  check((await t('pay')).includes('43.5 months'), `cng-vs-petrol: 50% on gas (${await t('pay')})`);
  await page.fill('.cv [data-k="share"]', '100');
  await page.selectOption('.cv [data-k="cur"]', { label: '$ dollar' }); await page.waitForTimeout(80);
  check((await t('km')).includes('$7.00') && (await t('km')).includes('$4.09'), `cng-vs-petrol: dollar symbol (${await t('km')})`);
  await page.fill('.cv [data-k="pm"]', '0'); await page.waitForTimeout(80);
  check((await t('warn')).length > 5 && !(await page.textContent('.cv')).includes('NaN'), 'cng-vs-petrol: zero mileage, friendly message');
};
