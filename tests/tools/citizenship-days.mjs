// #T932 Citizenship days
export const path = '/everyday/citizenship-days/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/citizenship-days/`); await page.waitForTimeout(400);
  const R = '.cd ';
  const date = () => page.getAttribute(R + '.cd-big', 'data-date');
  const set = async (k, v) => { await page.fill(R + `[data-k="${k}"]`, v); await page.waitForTimeout(100); };
  await set('on', '');
  check((await date()) === '2025-12-31', `citizenship: PR 2023-01-01, no trips -> 2025-12-31 (${await date()})`);
  check((await page.getAttribute(R + '.cd-tab', 'data-total')) === '1095', 'citizenship: 1,095 days on that date');
  await set('tr', '2021-11-27');
  check((await page.getAttribute(R + '.cd-tab', 'data-credit')) === '200' && (await date()) === '2025-06-14', `citizenship: 400 days before PR -> 200 credit, 2025-06-14 (${await date()})`);
  await set('tr', '');
  await page.click(R + '.cd-add'); await page.waitForTimeout(80);
  await page.fill(R + '.cd-trip [data-t="l"]', '2024-07-01'); await page.fill(R + '.cd-trip [data-t="b"]', '2024-07-06'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.cd-trip span')).includes('4 days away') && (await date()) === '2026-01-04', `citizenship: trip 1-6 July is 4 days away -> 2026-01-04 (${await date()})`);
  await set('on', '2025-01-01');
  check((await page.textContent(R + '.cd-say')).includes('short of 1,095'), 'citizenship: an early date is short');
};
