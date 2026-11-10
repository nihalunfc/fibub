// #T881 Health insurance tax saving (India 80D, US HSA)
export const path = '/money/health-insurance-tax/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/health-insurance-tax/`); await page.waitForTimeout(300);
  const set = async (k, v) => { await page.fill(`.hit [data-k="${k}"]`, v); };
  const txt = async (c) => page.textContent(`.hit ${c}`);
  await set('p1', '30000'); await set('p2', '40000'); await set('slab', '30');
  await page.check('.hit [data-k="s2"]'); await page.waitForTimeout(100);
  check((await txt('.hit-s1')).includes('65,000'), 'health-insurance-tax: IN deduction 65,000 (' + (await txt('.hit-s1')) + ')');
  check((await txt('.hit-s3')).includes('20,280'), 'health-insurance-tax: IN tax saved 20,280 (' + (await txt('.hit-s3')) + ')');
  await set('x2', '40000'); await page.waitForTimeout(100);
  check((await txt('.hit-s1')).includes('25,000') && !(await page.isHidden('.hit .hit-warn')), 'health-insurance-tax: cash premium left out and warned');
  await page.selectOption('.hit [data-k="region"]', 'us'); await set('age', '40'); await set('mine', '4400'); await set('emp', '0'); await set('fed', '22'); await set('st', '5'); await page.waitForTimeout(100);
  check((await txt('.hit-s3')).includes('1,524.60'), 'health-insurance-tax: US tax saved 1,524.60 (' + (await txt('.hit-s3')) + ')');
  await set('emp', '1000'); await page.waitForTimeout(100);
  check((await txt('.hit-s2')).includes('3,400') && !(await page.isHidden('.hit .hit-warn')), 'health-insurance-tax: employer amount uses up the limit and warns');
};
