// #L336 Limiting reagent
export const path = '/learn/limiting-reagent/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/limiting-reagent/`); await page.waitForTimeout(300);
  // TODO 3 to 5 checks: the worked example, an edge case, and each control changing the result.
  check((await page.textContent('.lr .lr-out')).length > 0, 'limiting-reagent: shows a result');
  { const a = await page.getAttribute('.lr .lq-item', 'data-ans'); await page.fill('.lr .lq-in', a); await page.click('.lr .lq-check');
    check((await page.textContent('.lr .lq-fb')) === 'Right.', 'limiting-reagent: quiz accepts the right answer'); }
};
