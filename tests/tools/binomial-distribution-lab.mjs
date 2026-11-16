// #L344 Binomial lab
export const path = '/learn/binomial-distribution-lab/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/binomial-distribution-lab/`); await page.waitForTimeout(300);
  const t = (s) => page.textContent('.bl ' + s);
  const set = (s, v) => page.$eval('.bl ' + s, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  check((await t('.bl-out')) === 'P(X = 10) = 0.1762', `binomial: B(20,0.5) P(X=10) (${await t('.bl-out')})`);
  await set('.bl-k', 7);
  check((await t('.bl-sub')).startsWith('P(X ≤ 7) = 0.1316'), `binomial: P(X≤7) (${await t('.bl-sub')})`);
  check((await t('.bl-test')).startsWith('P(X ≥ 15) = 0.0207') && (await t('.bl-test')).includes('reject H0 at 5%') && !(await t('.bl-test')).includes('do not'), `binomial: 15 heads rejects fairness (${await t('.bl-test')})`);
  check((await t('.bl-crit')) === 'Critical region: X ≥ 15.', `binomial: critical region (${await t('.bl-crit')})`);
  await page.selectOption('.bl .bl-dir', 'down'); await set('.bl-x', 7);
  check((await t('.bl-test')).includes('do not reject') && (await t('.bl-crit')) === 'Critical region: X ≤ 5.', `binomial: lower tail (${await t('.bl-test')} / ${await t('.bl-crit')})`);
  { const a = await page.getAttribute('.bl .lq-item', 'data-ans'); await page.fill('.bl .lq-in', a); await page.click('.bl .lq-check');
    check((await page.textContent('.bl .lq-fb')) === 'Right.', 'binomial: quiz accepts the right answer'); }
};
