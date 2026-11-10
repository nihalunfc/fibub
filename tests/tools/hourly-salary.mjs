// #1728 Salary converter
export const path = '/money/hourly-salary/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/hourly-salary/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.hs [data-k="${k}"]`, v); };
  const txt = async (c) => page.textContent(`.hs ${c}`);
  await page.selectOption('.hs [data-k="cur"]', 'USD');
  await set('amt', '25'); await set('hours', '40'); await set('weeks', '52'); await page.waitForTimeout(100);
  check((await txt('.hs-s-year')).includes('52,000'), '25/h x 40 x 52 = 52,000 (' + (await txt('.hs-s-year')) + ')');
  check((await txt('.hs-s-month')).includes('4,333'), 'monthly is 4,333');
  await page.selectOption('.hs [data-k="unit"]', 'year'); await set('amt', '52000'); await page.waitForTimeout(100);
  check((await txt('.hs-s-hour')).includes('25.00'), 'yearly 52,000 gives 25.00 an hour');
  await page.selectOption('.hs [data-k="unit"]', 'hour'); await set('amt', '20'); await set('ot', '5'); await page.waitForTimeout(100);
  check((await txt('.hs-s-ot')).includes('49,400'), 'overtime 5 h at 1.5x adds 7,800 a year (' + (await txt('.hs-s-ot')) + ')');
  await set('weeks', '50'); await page.waitForTimeout(100);
  check((await txt('.hs-s-year')).includes('40,000'), 'fewer paid weeks lowers the year');
  await set('hours', '0'); await page.waitForTimeout(100);
  check(await page.isVisible('.hs .hs-err'), 'bad hours shows a message');
};
