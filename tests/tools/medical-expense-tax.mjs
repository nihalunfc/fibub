// #T909 Medical expense tax helper
export const path = '/money/medical-expense-tax/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/medical-expense-tax/`); await page.waitForTimeout(400);
  await page.click('.mt .mt-ex'); await page.waitForTimeout(200);
  const t = await page.textContent('.mt .mt-result');
  check(t.includes('ending in 2025') && t.includes('12 items'), `tax: 2025 window (${t.slice(0, 120)})`);
  await page.selectOption('.mt .mt-yr', '2026'); await page.waitForTimeout(150);
  check((await page.textContent('.mt .mt-result')).includes('2025-01-15 to 2026-01-14') && (await page.textContent('.mt .mt-result')).includes('12 items'), `tax: 14 months -> best 12 ending 2026 (${(await page.textContent('.mt .mt-result')).slice(0,80)})`);
  await page.click('.mt .mt-clear');
  await page.selectOption('.mt .mt-cty', 'US'); await page.fill('.mt .mt-d', '2026-01-05'); await page.fill('.mt .mt-a', '10000'); await page.click('.mt .mt-add'); await page.waitForTimeout(100);
  check((await page.textContent('.mt .mt-result')).includes('5,500.00'), 'tax: US 10,000 at AGI 60,000 -> 5,500');
  await page.click('.mt .mt-clear'); await page.selectOption('.mt .mt-cty', 'IN');
  await page.fill('.mt .mt-d', '2026-01-05'); await page.fill('.mt .mt-a', '120000'); await page.fill('.mt .mt-r', '20000'); await page.click('.mt .mt-add'); await page.check('.mt .mt-sen'); await page.waitForTimeout(100);
  check((await page.textContent('.mt .mt-result')).includes('Section 80DDB deduction: ₹1,00,000.00'), 'tax: India senior limit');
  await page.selectOption('.mt .mt-cty', 'UK'); await page.waitForTimeout(100);
  check((await page.textContent('.mt .mt-result')).includes('no general tax relief'), 'tax: UK says no relief');
};
