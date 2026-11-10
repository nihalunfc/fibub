// #1756 Capital gains
export const path = '/money/capital-gains/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/capital-gains/`); await page.waitForTimeout(300);
  await page.selectOption('.cg [data-k="cur"]', 'USD'); await page.waitForTimeout(100);
  const t = async (c) => await page.textContent(`.cg ${c}`);
  check((await t('.cg-s-g')).includes('1,000.00') && (await t('.cg-s-t')).includes('500.00'), 'capital-gains: average cost gain 1,000, taxable 500 at 50%');
  await page.selectOption('.cg [data-k="method"]', 'fifo'); await page.waitForTimeout(100);
  check((await t('.cg-s-g')).includes('1,500.00'), 'capital-gains: FIFO gain is 1,500');
  await page.fill('.cg [data-k="incl"]', '100'); await page.waitForTimeout(100);
  check((await t('.cg-s-t')).includes('1,500.00'), 'capital-gains: taxable share is editable');
  await page.fill('.cg [data-k="tx"]', '2024-01-01, ABC, buy, 10, 5\n2024-02-01, ABC, sell, 20, 6'); await page.waitForTimeout(100);
  check(await page.isVisible('.cg .cg-err'), 'capital-gains: selling more than held shows a message');
};
