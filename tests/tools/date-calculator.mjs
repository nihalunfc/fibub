// #T933 Date calculator
export const path = '/everyday/date-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/date-calculator/`); await page.waitForTimeout(300);
  const R = '.dc ';
  await page.fill(R + '.dc-born', '1990-05-15'); await page.fill(R + '.dc-on', '2026-11-10'); await page.waitForTimeout(100);
  const a = await page.$eval(R + '.dc-age-big', (e) => [e.dataset.y, e.dataset.m, e.dataset.d].join(' '));
  const next = await page.getAttribute(R + '.dc-age-say', 'data-next');
  check(a === '36 5 26' && next === '2027-05-15', `date: born 1990-05-15 on 2026-11-10 -> 36 y 5 m 26 d, next 2027-05-15 (${a}, ${next})`);
  await page.click(R + '.dc-tabs [data-m="between"]');
  const d1 = await page.getAttribute(R + '.dc-btw-big', 'data-days'), w1 = await page.getAttribute(R + '.dc-btw-say', 'data-wd');
  await page.check(R + '.dc-incl'); await page.waitForTimeout(100);
  const d2 = await page.getAttribute(R + '.dc-btw-big', 'data-days'), w2 = await page.getAttribute(R + '.dc-btw-say', 'data-wd');
  check(d1 === '364' && d2 === '365' && w1 === '260' && w2 === '261', `date: 2026 is 364 days (365 with end), weekdays 260/261 (${d1}, ${d2}, ${w1}, ${w2})`);
  await page.click(R + '.dc-tabs [data-m="add"]');
  check((await page.getAttribute(R + '.dc-add-big', 'data-iso')) === '2026-02-28', 'date: 2026-01-31 + 1 month -> 2026-02-28');
  await page.selectOption(R + '.dc-unit', 'd'); await page.fill(R + '.dc-n', '30'); await page.waitForTimeout(100);
  check((await page.getAttribute(R + '.dc-add-big', 'data-iso')) === '2026-03-02', 'date: 2026-01-31 + 30 days -> 2026-03-02');
};
