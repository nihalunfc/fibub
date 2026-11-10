// #1724 SIP calculator
export const path = '/money/sip-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/sip-calculator/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.sp [data-k="${k}"]`, v); };
  const txt = async (c) => page.textContent(`.sp ${c}`);
  await page.selectOption('.sp [data-k="cur"]', 'INR');
  await set('sip', '10000'); await set('rate', '12'); await set('years', '10'); await page.waitForTimeout(100);
  check((await txt('.sp-s-fv')).includes('23,23,391'), 'sip-calculator: 10,000 a month at 12% for 10 years = 23.23 lakh (' + (await txt('.sp-s-fv')) + ')');
  check((await txt('.sp-s-put')).includes('12,00,000'), 'sip-calculator: invested 12 lakh');
  await set('step', '10'); await page.waitForTimeout(100);
  const withStep = parseInt((await txt('.sp-s-put')).replace(/[^\d]/g, ''), 10);
  check(withStep > 1800000, 'sip-calculator: a 10% yearly step-up raises the amount invested (' + withStep + ')');
  await set('step', '0'); await set('lump', '100000'); await page.waitForTimeout(100);
  check((await txt('.sp-s-put')).includes('13,00,000'), 'sip-calculator: lumpsum adds to the amount invested');
  check((await page.$$('.sp .sp-body tr')).length === 10, 'sip-calculator: ten rows in the year table');
  await set('sip', '0'); await set('lump', '0'); await page.waitForTimeout(100);
  check(await page.isVisible('.sp .sp-err'), 'sip-calculator: nothing to invest shows a message');
};
