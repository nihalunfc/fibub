// #1778 Residency days
export const path = '/money/tax-residency-days/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/tax-residency-days/`); await page.waitForTimeout(300);
  const add = async (c, a, b) => { await page.fill('.rd [data-k="country"]', c); await page.fill('.rd [data-k="from"]', a); await page.fill('.rd [data-k="to"]', b); await page.click('.rd .rd-addbtn'); };
  const txt = async (c) => page.textContent(`.rd ${c}`);
  await page.fill('.rd [data-k="year"]', '2025');
  await add('Canada', '2025-01-01', '2025-03-31'); await page.waitForTimeout(100);
  check((await txt('.rd-body')).replace(/\s+/g, ' ').includes('Canada90'), 'Jan 1 to Mar 31 is 90 days both ends counted (' + (await txt('.rd-body')).slice(0, 60) + ')');
  await add('USA', '2025-04-01', '2025-07-09'); await add('United States', '2024-01-01', '2024-06-29'); await add('United States', '2023-01-01', '2023-12-31');
  await page.waitForTimeout(100);
  // 2025: Apr 1 - Jul 9 = 30+31+30+9 = 100 days; 2024: Jan 1 - Jun 29 = 31+29+31+30+31+29 = 181; 2023: 365 -> 100 + 60.33 + 60.83 = 221.17
  check((await txt('.rd-spt-out')).includes('meet the substantial presence test') && (await txt('.rd-spt-body')).includes('221.17'), 'US 100 + 181/3 + 365/6 = 221.17 meets the test (' + (await txt('.rd-spt-body')).replace(/\s+/g, ' ') + ')');
  await page.selectOption('.rd [data-k="region"]', 'uk'); await add('UK', '2025-04-06', '2025-04-10'); await page.waitForTimeout(100);
  check((await page.inputValue('.rd [data-k="counting"]')) === 'midnight', 'UK year switches to midnight counting');
  check((await txt('.rd-body')).replace(/\s+/g, ' ').includes('UK4'), 'UK 6-10 April by midnights = 4 days');
  await page.click('.rd .rd-clear'); await page.waitForTimeout(100);
  check(await page.isVisible('.rd .rd-empty'), 'clear removes all trips');
  await add('', '2025-01-01', '2025-01-02');
  check(await page.isVisible('.rd .rd-err'), 'missing country shows a message');
};
