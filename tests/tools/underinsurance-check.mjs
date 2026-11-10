// #T829 Home insurance underinsurance check
export const path = '/money/underinsurance-check/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/underinsurance-check/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.ui [data-k="${k}"]`, v); };
  const txt = async (c) => page.textContent(`.ui ${c}`);
  await page.selectOption('.ui [data-k="cur"]', 'USD');
  await set('rebuild', '800000'); await set('contents', '200000'); await set('si', '600000'); await set('loss', '200000'); await set('ded', '1000'); await page.waitForTimeout(100);
  check((await txt('.ui-s-pay')).includes('149,000'), 'underinsurance-check: payout 149,000 (' + (await txt('.ui-s-pay')) + ')');
  check((await txt('.ui-s-need')).includes('800,000'), 'underinsurance-check: sum insured needed 800,000 (' + (await txt('.ui-s-need')) + ')');
  check((await txt('.ui-s-share')).includes('75%'), 'underinsurance-check: 75% of the loss is paid');
  await page.selectOption('.ui [data-k="clause"]', '0'); await page.waitForTimeout(100);
  check((await txt('.ui-s-pay')).includes('199,000'), 'underinsurance-check: no clause pays the loss less the deductible');
  await page.selectOption('.ui [data-k="clause"]', '0.8'); await page.selectOption('.ui [data-k="how"]', 'area');
  await set('area', '100'); await set('rate', '8000'); await page.waitForTimeout(100);
  check((await txt('.ui-s-pay')).includes('149,000'), 'underinsurance-check: area x cost per area gives the same value');
  await set('si', '0'); await page.waitForTimeout(100);
  check(await page.isVisible('.ui .ui-err'), 'underinsurance-check: no sum insured shows a message');
};
