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
};
