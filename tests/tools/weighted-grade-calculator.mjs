// #T927 Weighted grade
export const path = '/everyday/weighted-grade-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/weighted-grade-calculator/`); await page.waitForTimeout(300);
  const R = '.wg ';
  const big = () => page.textContent(R + '.wg-big');
  const cell = (i, f) => R + `.wg-row:nth-child(${i}) [data-f="${f}"]`;
  const set = async (i, f, v) => { await page.fill(cell(i, f), v); await page.waitForTimeout(80); };
  check((await big()) === '77.0% (C)', `weighted: (90,20),(80,30),(70,50) -> 77.0% C (${await big()})`);
  await set(1, 'score', '45/50'); check((await big()) === '77.0% (C)', 'weighted: 45/50 counts as 90%');
  await set(3, 'score', ''); check((await big()) === '84.0% (B)', `weighted: missing final -> 84.0% of graded part (${await big()})`);
  await page.fill(R + '[data-k="if"]', '70'); await page.waitForTimeout(80);
  check((await page.textContent(R + '.wg-ifout')).includes('77.0%'), 'weighted: what-if 70 on missing gives 77.0%');
  await page.click(R + '.wg-row:nth-child(1) .wg-del'); await page.waitForTimeout(80);
  await set(1, 'score', '90'); await set(1, 'w', '50'); await set(2, 'score', '80'); await set(2, 'w', '30');
  check((await big()) === '86.3% (B)' && (await page.textContent(R + '.wg-warn')).includes('80.0, not 100'), `weighted: 50+30 normalised -> 86.3% with a note (${await big()})`);
  await page.click(R + '.wg-reset'); await page.waitForTimeout(80); check((await big()) === '77.0% (C)', 'weighted: reset');
  // New options (state is the reset example)
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  check((await page.locator(R + '.wg-working li').count()) === 4 && (await page.textContent(R + '.wg-working li:first-child')).includes('Homework: 90.0% × weight 20.0 ÷ 100.0 = 18.00 points'), 'weighted: working lists each row and a total');
  await set(3, 'score', '');
  await page.fill(R + '[data-k="goal"]', '80'); await page.waitForTimeout(80);
  check((await page.textContent(R + '.wg-goalout')).includes('average of 76.0% on the 1 missing item'), 'weighted: 80% goal needs 76.0% on the missing final');
  await page.fill(R + '[data-k="goal"]', '95'); await page.waitForTimeout(80);
  check((await page.textContent(R + '.wg-goalout')).includes('106.0%') && (await page.textContent(R + '.wg-goalout')).includes('out of reach'), 'weighted: 95% goal needs 106.0%, out of reach');
  await page.fill(R + '[data-k="goal"]', '40'); await page.waitForTimeout(80);
  check((await page.textContent(R + '.wg-goalout')).includes('already finish on at least 40.0%'), 'weighted: 40% goal is already safe');
  await page.click(R + '.wg-reset'); await page.waitForTimeout(80);
  // Several scores in one row, drop the lowest
  await set(1, 'score', '90 80 70');
  check((await big()) === '75.0% (C)', `weighted: row 90 80 70 averages 80 -> 75.0% (${await big()})`);
  await page.selectOption(R + '[data-k="drop"]', '1'); await page.waitForTimeout(80);
  check((await big()) === '76.0% (C)' && (await page.textContent(R + '.wg-working li:first-child')).includes('lowest 70.0% dropped'), 'weighted: drop lowest 1 -> row 85 -> 76.0%');
  await page.selectOption(R + '[data-k="drop"]', '2'); await page.waitForTimeout(80);
  check((await big()) === '77.0% (C)', 'weighted: drop lowest 2 keeps 90 -> 77.0%');
  await page.selectOption(R + '[data-k="scale"]', 'plusminus');
  check((await big()) === '77.0% (C+)' && (await page.locator(R + '[data-c]').count()) === 11, 'weighted: plus-minus scale gives C+ for 77.0%');
  await page.selectOption(R + '[data-k="scale"]', 'uk');
  check((await big()) === '77.0% (First)', 'weighted: UK classes give First for 77.0%');
  await page.selectOption(R + '[data-k="scale"]', 'simple'); await page.selectOption(R + '[data-k="drop"]', '0');
  await set(1, 'score', '90 abc');
  check((await page.textContent(R + '.wg-warn')).includes('left out') && !(await page.textContent(R)).includes('NaN'), 'weighted: an unreadable score is flagged, no NaN');
  await set(1, 'score', '90'); await set(1, 'w', '20%');
  check((await big()) === '77.0% (C)', 'weighted: a weight typed as 20% is read as 20');
};
