// #T990 Offer compare
export const path = '/money/job-offer-compare/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/job-offer-compare/`); await page.waitForTimeout(300);
  const txt = async (c) => (await page.textContent(`.jo ${c}`)) || '';
  await page.selectOption('.jo [data-d="disp"]', 'AED'); await page.waitForTimeout(100);
  check((await txt('.jo-pkg')).includes('231,000'), 'job-offer-compare: offer A package is 231,000 (' + (await txt('.jo-pkg')) + ')');
  const cells = async (c) => page.$$eval(`.jo td.${c}`, (e) => e.map((x) => x.textContent));
  check((await cells('jo-save'))[0].includes('116,000'), 'job-offer-compare: savings 116,000');
  check((await cells('jo-total'))[0].includes('123,000'), 'job-offer-compare: savings plus end-of-service 123,000');
  check((await cells('jo-save'))[1].includes('66,105'), 'job-offer-compare: offer B converted at 3.6725 saves 66,105 (' + (await cells('jo-save'))[1] + ')');
  check((await txt('.jo-lead')).includes('Offer A'), 'job-offer-compare: names Offer A as best');
  await page.fill('.jo [data-o="1"] [data-k="live"]', '500'); await page.waitForTimeout(100);
  check((await txt('.jo-lead')).includes('Offer B'), 'job-offer-compare: cheap living flips the winner to Offer B');
  check(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), 'job-offer-compare: no sideways scroll');
};
