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
  // new options
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.fill('.cg [data-k="tx"]', '2022-01-10, ABC, buy, 100, 10, 0\n2023-03-05, ABC, buy, 100, 20, 0\n2024-06-20, ABC, sell, 100, 25, 0');
  await page.fill('.cg [data-k="incl"]', '50');
  await page.selectOption('.cg [data-k="method"]', 'lifo'); await page.waitForTimeout(100);
  check((await t('.cg-s-g')).includes('500.00'), 'capital-gains: LIFO gain is 500');
  await page.selectOption('.cg [data-k="method"]', 'hifo'); await page.waitForTimeout(100);
  check((await t('.cg-s-g')).includes('500.00'), 'capital-gains: HIFO uses the highest cost first');
  await page.selectOption('.cg [data-k="method"]', 'fifo');
  await page.fill('.cg [data-k="free"]', '500'); await page.fill('.cg [data-k="rate"]', '20'); await page.waitForTimeout(100);
  check((await t('.cg-s-t')).includes('500.00') && (await t('.cg-years')).includes('100.00'), 'capital-gains: tax-free 500 and rate 20% give taxable 500, tax 100');
  check((await t('.cg-answer')).includes('Net gain of') && (await t('.cg-answer')).includes('estimated tax'), 'capital-gains: plain answer line with estimated tax');
  await page.fill('.cg [data-k="rate"]', '150'); await page.waitForTimeout(100);
  check(await page.isVisible('.cg .cg-err'), 'capital-gains: bad tax rate shows a message');
  await page.fill('.cg [data-k="rate"]', '');
  await page.fill('.cg [data-k="tx"]', '2024-01-01, ABC, buy, 10, 5\n2024-02-01, ABC, sell, 10, 3'); await page.waitForTimeout(100);
  check((await t('.cg-answer')).includes('Net loss') && (await t('.cg-s-t')).includes('0.00'), 'capital-gains: a loss has a taxable part of 0');
};
