// #L338 Normal lab
export const path = '/learn/normal-distribution-lab/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/normal-distribution-lab/`); await page.waitForTimeout(300);
  const t = (s) => page.textContent('.nl ' + s);
  const set = (s, v) => page.$eval('.nl ' + s, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  check((await t('.nl-out')).startsWith('P = 0.8413'), `normal: N(100,15) P(X<115) (${await t('.nl-out')})`);
  check((await t('.nl-sub')).includes('= 1'), `normal: z-score shown (${await t('.nl-sub')})`);
  check((await t('.nl-inv')).includes('x = 124.67'), `normal: inverse for 0.95 gives 124.67 (${await t('.nl-inv')})`);
  await page.selectOption('.nl .nl-mode', 'above'); await set('.nl-a', 100);
  check((await t('.nl-out')).startsWith('P = 0.5'), 'normal: above the mean is a half');
  await page.selectOption('.nl .nl-mode', 'between'); await set('.nl-a', 85); await set('.nl-b', 115);
  check((await t('.nl-out')).startsWith('P = 0.6827'), `normal: within one σ is 0.6827 (${await t('.nl-out')})`);
  { const a = await page.getAttribute('.nl .lq-item', 'data-ans'); await page.fill('.nl .lq-in', a); await page.click('.nl .lq-check');
    check((await page.textContent('.nl .lq-fb')) === 'Right.', 'normal: quiz accepts the right answer'); }
};
