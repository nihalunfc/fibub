// #L333 Margin of error
export const path = '/learn/margin-of-error-sim/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/margin-of-error-sim/`); await page.waitForTimeout(300);
  // TODO 3 to 5 checks: the worked example, an edge case, and each control changing the result.
  check((await page.textContent('.moes .moes-out')).length > 0, 'margin-of-error-sim: shows a result');
  { const a = await page.getAttribute('.moes .lq-item', 'data-ans'); await page.fill('.moes .lq-in', a); await page.click('.moes .lq-check');
    check((await page.textContent('.moes .lq-fb')) === 'Right.', 'margin-of-error-sim: quiz accepts the right answer'); }
};
