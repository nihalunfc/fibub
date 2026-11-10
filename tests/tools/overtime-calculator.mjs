// #1776 Overtime
export const path = '/money/overtime-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/overtime-calculator/`); await page.waitForTimeout(300);
  const txt = async (c) => page.textContent(`.oc ${c}`);
  await page.selectOption('.oc [data-k="cur"]', 'USD');
  await page.selectOption('.oc [data-k="rule"]', 'on');
  await page.fill('.oc [data-k="rate"]', '25'); await page.fill('.oc [data-k="wk"]', '48'); await page.waitForTimeout(100);
  check((await txt('.oc-s-ot')) === '4.00', 'Ontario 48 h: 4 overtime hours (' + (await txt('.oc-s-ot')) + ')');
  check((await txt('.oc-s-pay')).includes('1,250'), 'Ontario: 44x25 + 4x37.50 = 1,250, pay (' + (await txt('.oc-s-pay')) + ')');
  await page.selectOption('.oc [data-k="rule"]', 'us'); await page.waitForTimeout(100);
  check((await txt('.oc-s-ot')) === '8.00' && (await txt('.oc-s-pay')).includes('1,300'), 'US 40 h: 8 overtime hours, pay 1,300 (' + (await txt('.oc-s-pay')) + ')');
  await page.selectOption('.oc [data-k="rule"]', 'bc'); await page.selectOption('.oc [data-k="how"]', 'days'); await page.waitForTimeout(100);
  const ds = '.oc [data-day]';
  const vals = [13, 8, 8, 8, 8, 0, 0];
  for (let i = 0; i < 7; i++) await page.fill(`${ds}[data-day="${i}"]`, String(vals[i]));
  await page.waitForTimeout(100);
  check((await txt('.oc-s-ot')) === '5.00' && (await txt('.oc-s-pay')).includes('1,200'), 'BC 13 h day: 4 h at 1.5 and 1 h at 2 = 1,200 (' + (await txt('.oc-s-pay')) + ')');
  await page.selectOption('.oc [data-k="rule"]', 'uk'); await page.waitForTimeout(100);
  check((await txt('.oc-s-pay')).includes('1,125'), 'UK: no premium, 45 h x 25 = 1,125 (' + (await txt('.oc-s-pay')) + ')');
};
