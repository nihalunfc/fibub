// #1753 Return calculator
export const path = '/money/return-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/return-calculator/`); await page.waitForTimeout(300);
  const t = async (c) => await page.textContent(`.rc ${c}`);
  check((await t('.rc-s-a')).includes('7.18%'), 'return-calculator: 1000 to 2000 in 10 years is 7.18%');
  check((await t('.rc-s-s')).includes('10.00%'), 'return-calculator: simple average is 10%');
  await page.selectOption('.rc [data-k="mode"]', 'xirr');
  await page.fill('.rc [data-k="flows"]', '2021-01-01, -1000\n2023-01-01, 1210'); await page.waitForTimeout(100);
  check((await t('.rc-s-a')).includes('10.00%'), 'return-calculator: XIRR known case is 10.00%');
  await page.fill('.rc [data-k="flows"]', '2021-01-01, -1000'); await page.waitForTimeout(100);
  check(await page.isVisible('.rc .rc-err'), 'return-calculator: one cash flow shows a message');
};
