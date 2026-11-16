// #L349 Empirical formula
export const path = '/learn/empirical-formula/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/empirical-formula/`); await page.waitForTimeout(300);
  const o = page.locator('.ef .ef-out');
  check((await o.getAttribute('data-formula')) === 'MgO', 'empirical-formula: 0.24 g Mg + 0.16 g O gives MgO');
  await page.selectOption('.ef .ef-ex', '1');
  check((await o.getAttribute('data-formula')) === 'Fe₂O₃' && (await o.getAttribute('data-k')) === '2', 'empirical-formula: 69.9 % Fe, 30.1 % O gives Fe2O3 with the x2 rule');
  await page.selectOption('.ef .ef-ex', '5');
  check((await o.getAttribute('data-formula')) === 'CH₂O' && (await o.getAttribute('data-molecular')) === 'C₆H₁₂O₆', 'empirical-formula: glucose gives CH2O and C6H12O6 from Mr 180');
  await page.click('.ef [data-mode="mgo"]');
  await page.fill('.ef .ef-m', '0.6'); await page.dispatchEvent('.ef .ef-m', 'input');
  await page.click('.ef .ef-burn'); await page.waitForTimeout(4200);
  check(Math.abs(+(await page.getAttribute('.ef .ef-burn', 'data-o')) - 0.39) < 0.02, 'empirical-formula: 0.60 g Mg gains about 0.39 g oxygen');
  await page.click('.ef .ef-use');
  check((await o.getAttribute('data-formula')) === 'MgO', 'empirical-formula: experiment data sent to the calculator give MgO');
  { const a = await page.getAttribute('.ef .lq-item', 'data-ans'); await page.fill('.ef .lq-in', a); await page.click('.ef .lq-check');
    check((await page.locator('.ef .lq-fb').first().textContent()) === 'Right.', 'empirical-formula: quiz accepts the right answer'); }
};
