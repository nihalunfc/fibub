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
  // new options
  await page.evaluate(() => document.querySelectorAll('.lr details').forEach((d) => (d.open = true)));
  await page.selectOption('.lr .lr-rx', '0');
  await page.selectOption('.lr [data-k="a-unit"]', 'mol'); await page.fill('.lr [data-k="a-amount"]', '2');
  await page.selectOption('.lr [data-k="b-unit"]', 'mol'); await page.fill('.lr [data-k="b-amount"]', '0.5');
  check((await o.getAttribute('data-limiter')) === 'O2' && Math.abs(+(await o.getAttribute('data-prod')) - 18.015) < 0.01 && Math.abs(+(await o.getAttribute('data-left')) - 2.016) < 0.01, 'limiting-reagent: amounts in mol, O2 limits, 18.015 g water');
  await page.selectOption('.lr [data-k="a-unit"]', 'g'); await page.selectOption('.lr [data-k="b-unit"]', 'g');
  await page.fill('.lr [data-k="a-amount"]', '4'); await page.fill('.lr [data-k="b-amount"]', '16'); await page.check('.lr [data-k="school"]'); await page.fill('.lr [data-k="actual"]', '9');
  check(Math.abs(+(await o.getAttribute('data-prod')) - 18) < 0.001 && Math.abs(+(await o.getAttribute('data-left')) - 2) < 0.001 && (await page.textContent('.lr .lr-pyl')) === 'Percent yield: 50 %.', 'limiting-reagent: school masses 18 g, 50 % yield');
  check((await page.textContent('.lr .lr-steps')).includes('Divide by the coefficients'), 'limiting-reagent: working shown');
  await page.uncheck('.lr [data-k="school"]'); await page.fill('.lr [data-k="actual"]', '');
  await page.selectOption('.lr .lr-rx', '2'); await page.selectOption('.lr [data-k="product"]', '1');
  await page.fill('.lr [data-k="a-amount"]', '16'); await page.fill('.lr [data-k="b-amount"]', '64');
  check((await o.getAttribute('data-limiter')) === 'CH4' && Math.abs(+(await o.getAttribute('data-prod')) - 35.935) < 0.05, 'limiting-reagent: methane, water as the product');
  await page.selectOption('.lr .lr-rx', 'custom');
  await page.fill('.lr [data-k="a-formula"]', 'Fe'); await page.fill('.lr [data-k="b-formula"]', 'S'); await page.fill('.lr [data-k="p-formula"]', 'FeS');
  await page.fill('.lr [data-k="a-amount"]', '55.845'); await page.fill('.lr [data-k="b-amount"]', '64.12');
  check((await o.getAttribute('data-limiter')) === 'Fe' && Math.abs(+(await o.getAttribute('data-prod')) - 87.905) < 0.01 && Math.abs(+(await o.getAttribute('data-left')) - 32.06) < 0.01, 'limiting-reagent: own reaction Fe + S');
  await page.fill('.lr [data-k="a-formula"]', 'Qq'); check(await page.isVisible('.lr .lr-err'), 'limiting-reagent: bad formula message');
  await page.fill('.lr [data-k="a-formula"]', 'Fe'); await page.fill('.lr [data-k="a-amount"]', '0');
  check((await page.textContent('.lr .lr-err')).includes('above zero') && !(await page.textContent('.lr .lr-out')).includes('NaN'), 'limiting-reagent: zero amount refused');
  await page.fill('.lr [data-k="a-amount"]', ''); check((await page.textContent('.lr .lr-err')).includes('Type an amount'), 'limiting-reagent: blank amount');
  { const a = await page.getAttribute('.lr .lq-item', 'data-ans', { timeout: 4000 }).catch(() => null); if (a === null) { check(false, 'limiting-reagent: quiz did not mount'); return; } await page.locator('.lr .lq-item').first().locator('.lq-choice').nth(+a).click();
    check((await page.locator('.lr .lq-fb').first().textContent()) === 'Right.', 'limiting-reagent: quiz accepts the right choice'); }
};
