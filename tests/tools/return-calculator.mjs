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
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  const rt = async (c) => (await page.textContent(`.rc ${c}`)).trim();
  await page.selectOption('.rc [data-k="mode"]', 'cagr');
  await page.fill('.rc [data-k="start"]', '1000'); await page.fill('.rc [data-k="end"]', '2000'); await page.fill('.rc [data-k="years"]', '10');
  await page.fill('.rc [data-k="aim"]', '8'); await page.fill('.rc [data-k="end2"]', '3000'); await page.waitForTimeout(100);
  check((await rt('.rc-extra')).includes('2,158.92'), 'return-calculator: 8% for 10 years needs 2,158.92');
  check((await rt('.rc-extra')).includes('11.61%'), 'return-calculator: comparison shows 11.61% for 3,000');
};
