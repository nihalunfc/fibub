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
  // Extra figures on the between tab
  await page.click(R + '.dc-tabs [data-m="between"]');
  await page.fill(R + '.dc-from', '2026-01-01'); await page.fill(R + '.dc-to', '2026-12-31'); await page.uncheck(R + '.dc-incl'); await page.waitForTimeout(100);
  const more = await page.textContent(R + '.dc-btw-more');
  check(more.includes('11 months and 30 days in all') && more.includes('8,736 hours'), 'date: 364 days = 11 months 30 days, 8,736 hours');
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.selectOption(R + '.dc-region', 'us'); await page.waitForTimeout(100);
  check((await page.getAttribute(R + '.dc-btw-biz', 'data-bd')) === '249' && (await page.locator(R + '.dc-btw-hol li').count()) === 11, 'date: 2026 with US federal holidays -> 249 business days, 11 holidays listed');
  await page.selectOption(R + '.dc-region', 'none'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.dc-btw-biz')) === '', 'date: no region and Sat/Sun weekend shows no business line');
  // Business days: 23 Dec 2026 + 3
  await page.click(R + '.dc-tabs [data-m="add"]');
  await page.fill(R + '.dc-start', '2026-12-23'); await page.selectOption(R + '.dc-op', '1'); await page.fill(R + '.dc-n', '3'); await page.selectOption(R + '.dc-unit', 'b'); await page.waitForTimeout(100);
  check((await page.getAttribute(R + '.dc-add-big', 'data-iso')) === '2026-12-28', 'date: +3 business days from 2026-12-23, no holidays -> 2026-12-28');
  await page.selectOption(R + '.dc-region', 'uk'); await page.waitForTimeout(100);
  check((await page.getAttribute(R + '.dc-add-big', 'data-iso')) === '2026-12-30' && (await page.locator(R + '.dc-add-hol li').count()) === 2, 'date: UK bank holidays (25 and 28 Dec) -> 2026-12-30');
  await page.fill(R + '.dc-hol-in', '2026-12-24, nonsense'); await page.waitForTimeout(100);
  check((await page.getAttribute(R + '.dc-add-big', 'data-iso')) === '2026-12-31' && (await page.textContent(R + '.dc-hol-note')).includes('Could not read: nonsense'), 'date: own day off 24 Dec -> 2026-12-31, bad entry flagged');
  await page.fill(R + '.dc-hol-in', ''); await page.selectOption(R + '.dc-region', 'none');
  await page.fill(R + '.dc-start', '2026-12-28'); await page.selectOption(R + '.dc-op', '-1'); await page.fill(R + '.dc-n', '1'); await page.selectOption(R + '.dc-region', 'uk'); await page.waitForTimeout(100);
  check((await page.getAttribute(R + '.dc-add-big', 'data-iso')) === '2026-12-24', 'date: 1 business day before 2026-12-28 (UK) -> 2026-12-24');
  await page.fill(R + '.dc-n', '30000'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.dc-add-say')).includes('too many business days') && (await page.textContent(R + '.dc-add-big')) === '', 'date: 30000 business days gives a message');
  // Friday and Saturday weekend: Sun 15 to Sat 21 Nov 2026 has 5 working days (Sun to Thu)
  await page.selectOption(R + '.dc-region', 'none'); await page.selectOption(R + '.dc-wk', 'frisat');
  await page.click(R + '.dc-tabs [data-m="between"]');
  await page.fill(R + '.dc-from', '2026-11-15'); await page.fill(R + '.dc-to', '2026-11-22'); await page.waitForTimeout(100);
  check((await page.getAttribute(R + '.dc-btw-biz', 'data-bd')) === '5', 'date: Friday-Saturday weekend -> 5 business days Sun to Thu');
  await page.selectOption(R + '.dc-wk', 'satsun');
  // Countdown
  await page.click(R + '.dc-tabs [data-m="count"]');
  await page.fill(R + '.dc-cfrom', '2026-11-16'); await page.fill(R + '.dc-target', '2026-12-25'); await page.waitForTimeout(100);
  const cd = await page.getAttribute(R + '.dc-cd-big', 'data-days'), cs = await page.textContent(R + '.dc-cd-say');
  check(cd === '39' && (await page.textContent(R + '.dc-cd-big')) === '39 days to go' && cs.includes('5 weeks and 4 days') && cs.includes('Business days between: 29') && cs.includes('25 December 2026'), `date: 16 Nov to 25 Dec 2026 = 39 days, 29 weekdays (${cs})`);
  await page.selectOption(R + '.dc-region', 'us'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.dc-cd-say')).includes('Business days between: 28'), 'date: countdown takes US Thanksgiving off -> 28');
  await page.fill(R + '.dc-target', '2026-11-10'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.dc-cd-big')) === '6 days ago', 'date: target before the start date says days ago');
  await page.click(R + '.dc-chips [data-q="xmas"]'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.dc-target')) === '2026-12-25', 'date: Christmas chip from 16 Nov 2026 -> 2026-12-25');
  await page.click(R + '.dc-chips [data-q="ny"]'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.dc-target')) === '2027-01-01', 'date: New Year chip -> 2027-01-01');
  await page.fill(R + '.dc-target', ''); await page.waitForTimeout(100);
  check((await page.textContent(R + '.dc-cd-say')).includes('Pick the date') && !(await page.textContent(R)).includes('NaN'), 'date: empty target gives a message, no NaN');
};
