// #T995 Board marks
export const path = '/everyday/board-percentage/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/board-percentage/`); await page.waitForTimeout(300);
  const marks = [92, 88, 95, 79, 85, 70];
  for (let i = 0; i < marks.length; i++) await page.fill(`.bp .bp-got[data-n="${i + 1}"]`, String(marks[i]));
  await page.waitForTimeout(100);
  const t = await page.textContent('.bp .bp-lead');
  check(t.includes('Best five: 87.8%') && t.includes('84.83%'), 'board-percentage: CBSE best five and all (' + t + ')');
  await page.fill('.bp .bp-got[data-n="1"]', '120'); await page.waitForTimeout(100);
  check(await page.isVisible('.bp .bp-err'), 'board-percentage: marks above the maximum show a message');
  await page.fill('.bp .bp-got[data-n="1"]', '92');
  await page.fill('.bp .bp-max[data-n="6"]', '80'); await page.waitForTimeout(100);
  check((await page.textContent('.bp .bp-work')).includes('509 / 580'), 'board-percentage: another maximum is used');
  await page.selectOption('.bp [data-k="mode"]', 'kerala');
  const g = await page.$$('.bp .bp-g');
  await g[0].selectOption('A+'); await g[1].selectOption('A'); await g[2].selectOption('B+'); await page.waitForTimeout(100);
  const k = await page.textContent('.bp .bp-lead');
  check(k.includes('80%') && k.includes('89.33%'), 'board-percentage: Kerala range (' + k + ')');
  check((await page.textContent('.bp .bp-stats')).includes('84.67%'), 'board-percentage: Kerala midpoint');
};
