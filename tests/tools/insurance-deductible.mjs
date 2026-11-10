// #T831 Car insurance deductible chooser
export const path = '/money/insurance-deductible/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/insurance-deductible/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.ded [data-k="${k}"]`, v); };
  const txt = async (c) => page.textContent(`.ded ${c}`);
  await page.waitForTimeout(900);
  check((await txt('.ded-s-rec')).includes('10 years'), 'insurance-deductible: 10 years to recover (' + (await txt('.ded-s-rec')) + ')');
  check((await txt('.ded-s-be')).trim() === '0.1', 'insurance-deductible: break-even 0.1 claims a year (' + (await txt('.ded-s-be')) + ')');
  const exp = parseInt((await txt('.ded-s-exp')).replace(/[^\d-]/g, '') || '999', 10);
  check(Math.abs(exp) < 300, 'insurance-deductible: expected saving near 0 (' + exp + ')');
  const win = parseInt(await txt('.ded-s-win'), 10);
  check(win > 0 && win < 100, 'insurance-deductible: chance shown after the runs (' + win + '%)');
  check((await page.$$('.ded .ded-sim tr')).length === 3, 'insurance-deductible: three percentile rows');
  await set('every', '20'); await page.waitForTimeout(900);
  check((await page.inputValue('.ded [data-k="lam"]')) === '0.05', 'insurance-deductible: 1 claim every 20 years sets 0.05');
  check(parseInt((await txt('.ded-s-win')), 10) > 50, 'insurance-deductible: rarer claims favour the high deductible');
  await set('db', '500'); await page.waitForTimeout(100);
  check(await page.isVisible('.ded .ded-err'), 'insurance-deductible: equal deductibles show a message');
};
