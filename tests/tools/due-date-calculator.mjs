// #T919 Due date
export const path = '/everyday/due-date-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/due-date-calculator/`); await page.waitForTimeout(300);
  const R = '.ddc ';
  const due = () => page.getAttribute(R + '.ddc-big', 'data-iso');
  check((await due()) === '2026-10-08', `due: LMP 2026-01-01, 28 days -> 2026-10-08 (${await due()})`);
  await page.fill(R + '.ddc-today', '2026-03-01'); await page.waitForTimeout(100);
  check((await page.getAttribute(R + '.ddc-now', 'data-ga')) === '8+3' && (await page.textContent(R + '.ddc-now')).includes('first trimester'), 'due: 1 March 2026 is 8+3, first trimester');
  check((await page.textContent(R + 'tr[data-w="20"]')).includes('21 May 2026'), 'due: week 20 starts 21 May 2026');
  await page.fill(R + '.ddc-cyc', '35'); await page.waitForTimeout(100);
  check((await due()) === '2026-10-15', `due: 35-day cycle -> 2026-10-15 (${await due()})`);
  await page.selectOption(R + '.ddc-how', 'd5'); await page.fill(R + '.ddc-date', '2026-01-15'); await page.waitForTimeout(100);
  check((await due()) === '2026-10-03' && await page.isHidden(R + '.ddc-cyc'), `due: IVF day-5 2026-01-15 -> 2026-10-03 (${await due()})`);
  // more options: scan dating, progress, all weeks
  await page.goto(`${BASE}/everyday/due-date-calculator/`); await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.fill(R + '.ddc-today', '2026-03-01'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ddc-now')).includes('21% of the way'), `due: 59 of 280 days is 21% (${await page.textContent(R + '.ddc-now')})`);
  { const o = await page.textContent(R + '.ddc-other'); check(o.includes('15 Jan 2026') && o.includes('1 Oct 2026') && o.includes('14 Oct 2026'), 'due: conception 15 Jan, full term 1 to 14 Oct 2026'); }
  check((await page.textContent(R + 'tr[data-aw="12"]')).includes('26 Mar 2026') && (await page.locator(R + '.ddc-all tr').count()) === 39, 'due: all-weeks table, week 12 starts 26 March');
  await page.selectOption(R + '.ddc-how', 'scan'); await page.fill(R + '.ddc-date', '2026-03-01'); await page.fill(R + '.ddc-sw', '8'); await page.fill(R + '.ddc-sd', '0'); await page.waitForTimeout(100);
  check((await due()) === '2026-10-11', `due: scan on 1 March at 8w0d -> 2026-10-11 (${await due()})`);
  await page.fill(R + '.ddc-sw', '99'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ddc-big')).includes('weeks (5 to 42)'), 'due: silly scan weeks give a hint');
};
