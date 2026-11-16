// #L357 Surds
export const path = '/learn/surds/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/surds/`); await page.waitForTimeout(300);
  const o = page.locator('.su .su-out');
  await page.fill('.su .su-a', '72'); await page.dispatchEvent('.su .su-a', 'input');
  check((await o.getAttribute('data-result')) === '6√2' && Math.abs(+(await o.getAttribute('data-value')) - 8.485281) < 1e-5, 'surds: √72 = 6√2');
  await page.fill('.su .su-a', '50'); await page.dispatchEvent('.su .su-a', 'input');
  check((await o.getAttribute('data-result')) === '5√2', 'surds: √50 = 5√2');
  await page.fill('.su .su-a', '17'); await page.dispatchEvent('.su .su-a', 'input');
  check((await o.getAttribute('data-result')) === '√17', 'surds: √17 cannot be simplified');
  await page.selectOption('.su .su-op', 'add');
  check((await o.getAttribute('data-result')) === '8√2', 'surds: 3√8 + 2√2 = 8√2');
  await page.selectOption('.su .su-op', 'mul');
  check((await o.getAttribute('data-result')) === '24√2', 'surds: 2√3 × 4√6 = 24√2');
  await page.click('.su [data-level="11"]');
  await page.selectOption('.su .su-op', 'expand');
  check((await o.getAttribute('data-result')) === '11 + 6√3', 'surds: (2+√3)(4+√3) = 11 + 6√3');
  await page.selectOption('.su .su-op', 'rat2');
  check((await o.getAttribute('data-result')) === '(3 − √2)/7', 'surds: 1/(3+√2) = (3-√2)/7');
  await page.selectOption('.su .su-op', 'rat1');
  check((await o.getAttribute('data-result')) === '√2/2', 'surds: 1/√2 = √2/2');
  { const a = await page.getAttribute('.su .lq-item', 'data-ans'); await page.fill('.su .lq-in', a); await page.click('.su .lq-check');
    check((await page.textContent('.su .lq-fb')) === 'Right.', 'surds: quiz accepts the right answer'); }
};
