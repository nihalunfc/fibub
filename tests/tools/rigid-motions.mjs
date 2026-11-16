// #L334 Rigid motions
export const path = '/learn/rigid-motions/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/rigid-motions/`); await page.waitForTimeout(300);
  // TODO 3 to 5 checks: the worked example, an edge case, and each control changing the result.
  check((await page.textContent('.rm .rm-out')).length > 0, 'rigid-motions: shows a result');
  { const a = await page.getAttribute('.rm .lq-item', 'data-ans'); await page.fill('.rm .lq-in', a); await page.click('.rm .lq-check');
    check((await page.textContent('.rm .lq-fb')) === 'Right.', 'rigid-motions: quiz accepts the right answer'); }
};
