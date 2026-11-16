// #L356 Iteration
export const path = '/learn/iteration/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/iteration/`); await page.waitForTimeout(300);
  const o = page.locator('.it .it-out');
  await page.click('.it .it-step'); await page.click('.it .it-step');
  check(Math.abs(+(await o.getAttribute('data-x')) - 0.246094) < 1e-5 && (await o.getAttribute('data-n')) === '2', 'iteration: x2 = 0.246094 for (1 - x^3)/4 from 0');
  await page.click('.it .it-run'); await page.click('.it .it-run');
  check((await o.getAttribute('data-status')) === 'converging' && Math.abs(+(await o.getAttribute('data-x')) - 0.246263) < 1e-5, 'iteration: converges to 0.246263');
  check((await page.locator('.it .it-body tr').count()) > 5, 'iteration: table has rows');
  await page.selectOption('.it .it-pre', '1'); await page.click('.it .it-run');
  check((await o.getAttribute('data-status')) !== 'converging', 'iteration: the cube-root rearrangement does not converge');
  await page.selectOption('.it .it-pre', '3');
  check(Math.abs(+(await o.getAttribute('data-root')) - 0.697224) < 1e-4 && Math.abs(+(await o.getAttribute('data-slope')) - 0.2789) < 2e-3, 'iteration: (x^2+3)/5 root 0.6972 and slope 0.279');
  await page.click('.it [data-level="11"]'); await page.click('.it .it-run'); await page.click('.it .it-run');
  check(+(await o.getAttribute('data-newton-steps')) >= 0 && +(await o.getAttribute('data-newtonSteps')) < +(await o.getAttribute('data-iter-steps')), 'iteration: Newton needs fewer steps');
  await page.selectOption('.it .it-pre', 'custom'); await page.fill('.it .it-g', 'sqrt(5*x - 3)'); await page.fill('.it .it-x0', '2');
  await page.click('.it .it-run'); await page.click('.it .it-run'); await page.click('.it .it-run');
  check(Math.abs(+(await o.getAttribute('data-x')) - 4.302776) < 1e-4, 'iteration: typed g(x) converges to 4.3028');
  { const a = await page.getAttribute('.it .lq-item', 'data-ans'); await page.fill('.it .lq-in', a); await page.click('.it .lq-check');
    check((await page.textContent('.it .lq-fb')) === 'Right.', 'iteration: quiz accepts the right answer'); }
};
