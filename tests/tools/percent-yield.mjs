// #L348 Yield and atom economy
export const path = '/learn/percent-yield/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/percent-yield/`); await page.waitForTimeout(300);
  const o = page.locator('.py .py-out');
  await page.selectOption('.py .py-rx', '0');
  await page.fill('.py .py-m', '100'); await page.dispatchEvent('.py .py-m', 'input');
  check(Math.abs(+(await o.getAttribute('data-theo')) - 56.03) < 0.1 && Math.abs(+(await o.getAttribute('data-ae')) - 56.03) < 0.1, 'percent-yield: 100 g CaCO3 gives 56.0 g CaO, atom economy 56.0 %');
  await page.fill('.py .py-a', '42'); await page.dispatchEvent('.py .py-a', 'input');
  check(Math.abs(+(await o.getAttribute('data-pct')) - 74.96) < 0.2, 'percent-yield: 42 g collected is a 75 % yield');
  await page.selectOption('.py .py-rx', '1');
  check(Math.abs(+(await o.getAttribute('data-ae')) - 100) < 0.01, 'percent-yield: Haber process atom economy is 100 %');
  await page.selectOption('.py .py-rx', '4');
  check(Math.abs(+(await o.getAttribute('data-ae')) - 45.8) < 0.2, 'percent-yield: iron extraction atom economy is 45.8 %');
  { const a = await page.getAttribute('.py .lq-item', 'data-ans'); await page.fill('.py .lq-in', a); await page.click('.py .lq-check');
    check((await page.locator('.py .lq-fb').first().textContent()) === 'Right.', 'percent-yield: quiz accepts the right answer'); }
};
