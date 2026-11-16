// #L336 Limiting reagent
export const path = '/learn/limiting-reagent/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/limiting-reagent/`); await page.waitForTimeout(300);
  await page.fill('.lr .lr-a', '4'); await page.dispatchEvent('.lr .lr-a', 'input');
  await page.fill('.lr .lr-b', '32'); await page.dispatchEvent('.lr .lr-b', 'input');
  const o = page.locator('.lr .lr-out');
  check((await o.getAttribute('data-limiter')) === 'H2' && Math.abs(+(await o.getAttribute('data-prod')) - 35.745) < 0.05, 'limiting-reagent: 4 g H2 + 32 g O2 makes 35.7 g water, H2 limits');
  await page.selectOption('.lr .lr-rx', '1');
  check((await o.getAttribute('data-limiter')) !== '', 'limiting-reagent: another reaction still gives an answer');
  { const a = await page.getAttribute('.lr .lq-item', 'data-ans'); await page.locator('.lr .lq-item').first().locator('.lq-choice').nth(+a).click();
    check((await page.locator('.lr .lq-fb').first().textContent()) === 'Right.', 'limiting-reagent: quiz accepts the right choice'); }
};
