// #1775 Timesheet
export const path = '/money/timesheet/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/timesheet/`); await page.waitForTimeout(300);
  const txt = async (c) => page.textContent(`.ts ${c}`);
  await page.selectOption('.ts [data-k="cur"]', 'USD');
  await page.selectOption('.ts [data-k="rule"]', 'us');
  await page.fill('.ts [data-k="rate"]', '20');
  for (let i = 0; i < 5; i++) {
    const tr = `.ts-body tr[data-i="${i}"]`;
    await page.fill(`${tr} [data-d="s"]`, '09:00'); await page.fill(`${tr} [data-d="e"]`, '18:00'); await page.fill(`${tr} [data-d="b"]`, '30');
  }
  await page.waitForTimeout(100);
  check((await txt('.ts-s-total')) === '42:30', 'five 8.5 h days = 42:30 (' + (await txt('.ts-s-total')) + ')');
  check((await txt('.ts-s-dec')) === '42.50', 'decimal hours 42.50');
  check((await txt('.ts-s-ot')) === '2.50', 'US: 2.5 overtime hours over 40');
  check((await txt('.ts-s-pay')).includes('875'), 'pay 40x20 + 2.5x30 = 875 (' + (await txt('.ts-s-pay')) + ')');
  await page.fill('.ts-body tr[data-i="5"] [data-d="s"]', '22:00'); await page.fill('.ts-body tr[data-i="5"] [data-d="e"]', '06:00'); await page.fill('.ts-body tr[data-i="5"] [data-d="b"]', '0'); await page.waitForTimeout(100);
  check((await txt('.ts-s-total')) === '50:30', 'overnight shift 22:00-06:00 adds 8 h (' + (await txt('.ts-s-total')) + ')');
  await page.selectOption('.ts [data-k="rule"]', 'fed'); await page.waitForTimeout(100);
  check((await txt('.ts-s-ot')) === '10.50', 'federal: weekly overtime 10.5 is higher than daily 2.5 (' + (await txt('.ts-s-ot')) + ')');
  // quick fill and projection (reload: only Monday filled)
  await page.goto(`${BASE}/money/timesheet/`); await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.selectOption('.ts [data-k="rule"]', 'us'); await page.selectOption('.ts [data-k="cur"]', 'USD'); await page.fill('.ts [data-k="rate"]', '20');
  await page.fill('.ts-body tr[data-i="0"] [data-d="s"]', '09:00'); await page.fill('.ts-body tr[data-i="0"] [data-d="e"]', '17:00'); await page.fill('.ts-body tr[data-i="0"] [data-d="b"]', '0');
  await page.click('.ts .ts-fill'); await page.waitForTimeout(100);
  check((await txt('.ts-s-total')) === '40:00', 'quick fill: five 8 h days = 40:00 (' + (await txt('.ts-s-total')) + ')');
  check((await txt('[data-k="left"]')).includes('0.00 more') || (await txt('[data-k="left"]')).includes('already'), 'no hours left before overtime at 40 (' + (await txt('[data-k="left"]')) + ')');
  // 800 a week -> 1,600 every two weeks, 41,600 a year
  check((await txt('[data-k="proj"]')).includes('1,600') && (await txt('[data-k="proj"]')).includes('41,600'), 'projection (' + (await txt('[data-k="proj"]')) + ')');
};
