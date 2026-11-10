// #1763 Paper sizes
export const path = '/documents/paper-sizes/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/documents/paper-sizes/`); await page.waitForTimeout(300);
  const rows = await page.textContent('.ps .ps-table tbody');
  check(/A4\s*210 x 297\s*2480 x 3508/.test(rows), 'paper-sizes: A4 = 210 x 297 mm = 2480 x 3508 px at 300 dpi');
  check((await page.textContent('.ps .ps-fit')) === '94.1%', `paper-sizes: A4 on Letter fits at 94.1% (${await page.textContent('.ps .ps-fit')})`);
  await page.selectOption('.ps .ps-a', 'A5'); await page.selectOption('.ps .ps-b', 'A4'); await page.waitForTimeout(100);
  check((await page.textContent('.ps .ps-fit')).startsWith('141.'), 'paper-sizes: A5 up to A4 is about 141%');
  await page.selectOption('.ps .ps-unit', 'in'); await page.waitForTimeout(100);
  check(/Letter\s*8\.5 x 11/.test(await page.textContent('.ps .ps-table tbody')), 'paper-sizes: Letter = 8.5 x 11 in');
  await page.click('.ps .ps-tab[data-g="Photo prints"]');
  check((await page.locator('.ps .ps-table tbody tr').count()) === 11, 'paper-sizes: photo group lists 11');
  check((await page.locator('.ps .ps-vis svg rect').count()) === 2, 'paper-sizes: visual compare draws both sizes');
};
