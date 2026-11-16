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
  // new options
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.selectOption('.oc [data-k="how"]', 'week'); await page.selectOption('.oc [data-k="rule"]', 'on');
  await page.fill('.oc [data-k="wk"]', '48');
  await page.selectOption('.oc [data-k="ptype"]', 'year'); await page.fill('.oc [data-k="sal"]', '52000'); await page.fill('.oc [data-k="norm"]', '40'); await page.waitForTimeout(100);
  check((await txt('.oc-s-pay')).includes('1,250'), 'overtime: yearly salary 52,000 over 40 h is 25 an hour, pay 1,250 (' + (await txt('.oc-s-pay')) + ')');
  check((await txt('.oc-answer')).includes('1,250') && (await txt('.oc-answer')).includes('hourly rate'), 'overtime: plain answer line');
  check((await txt('.oc-pbody')).includes('65,') || (await txt('.oc-pbody')).includes('65000') || (await txt('.oc-pbody')).includes('65,000'), 'overtime: yearly projection 1,250 x 52 = 65,000');
  await page.selectOption('.oc [data-k="ptype"]', 'hour'); await page.fill('.oc [data-k="rate"]', '25'); await page.waitForTimeout(100);
  await page.evaluate(() => { const r = document.querySelector('.oc [data-k="wi"]'); r.value = '50'; r.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.waitForTimeout(100);
  check((await txt('.oc-wi-line')).includes('6.00 overtime hours') && (await txt('.oc-wi-line')).includes('1,325'), 'overtime: what-if 50 h in Ontario = 6 overtime hours, 1,325 (' + (await txt('.oc-wi-line')) + ')');
  check((await txt('.oc-tbody')).includes('44'), 'overtime: pay-by-hours table shows');
  await page.fill('.oc [data-k="rate"]', ''); await page.waitForTimeout(100);
  check((await txt('.oc-answer')).includes('hourly pay'), 'overtime: blank pay shows a friendly message, no NaN');
  check(!(await page.textContent('.oc')).includes('NaN'), 'overtime: no NaN on the page');
  // Gulf presets (checked 2026-11-16)
  await page.fill('.oc [data-k="rate"]', '20'); await page.selectOption('.oc [data-k="how"]', 'week');
  await page.selectOption('.oc [data-k="rule"]', 'ae'); await page.fill('.oc [data-k="wk"]', '50'); await page.waitForTimeout(100);
  check((await txt('.oc-s-ot')) === '2.00' && (await txt('.oc-s-pay')).includes('1,010'), 'overtime: UAE 50 h at 20 = 48 x 20 + 2 x 25 = 1,010 (' + (await txt('.oc-s-pay')) + ')');
  check((await txt('.oc-src')).includes('33 of 2021') && (await page.$('.oc .oc-src a[href*="u.ae"]')) !== null && (await txt('.oc-note')).includes('not legal advice'), 'overtime: UAE preset names the law, links u.ae and says not legal advice');
  await page.selectOption('.oc [data-k="rule"]', 'sa'); await page.waitForTimeout(100);
  check((await txt('.oc-s-pay')).includes('1,020'), 'overtime: Saudi Arabia 50 h at 20 = 48 x 20 + 2 x 30 = 1,020 (' + (await txt('.oc-s-pay')) + ')');
  await page.selectOption('.oc [data-k="rule"]', 'om'); await page.fill('.oc [data-k="wk"]', '45'); await page.waitForTimeout(100);
  check((await txt('.oc-s-ot')) === '5.00' && (await txt('.oc-s-pay')).includes('925'), 'overtime: Oman 45 h at 20 = 40 x 20 + 5 x 25 = 925 (' + (await txt('.oc-s-pay')) + ')');
};
