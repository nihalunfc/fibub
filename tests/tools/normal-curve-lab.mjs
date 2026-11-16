// #L330 Normal curve lab
export const path = '/learn/normal-curve-lab/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/normal-curve-lab/`); await page.waitForTimeout(300);
  // TODO 3 to 5 checks: the worked example, an edge case, and each control changing the result.
  check((await page.textContent('.ncl .ncl-out')).length > 0, 'normal-curve-lab: shows a result');
  { const a = await page.getAttribute('.ncl .lq-item', 'data-ans'); await page.fill('.ncl .lq-in', a); await page.click('.ncl .lq-check');
    check((await page.textContent('.ncl .lq-fb')) === 'Right.', 'normal-curve-lab: quiz accepts the right answer'); }
};
