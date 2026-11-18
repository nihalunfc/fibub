// #T1047 Release checklist
export const path = '/everyday/release-checklist/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/release-checklist/`); await page.waitForTimeout(300);
  const out = async () => (await page.textContent('.rc .rc-out')).trim();
  check((await out()).startsWith('Pick a release date'), 'release-checklist: asks for a date');
  await page.fill('.rc [data-k="rel"]', '2026-12-01'); await page.waitForTimeout(100);
  const dates = await page.$$eval('.rc .rc-it input[type=date]', (a) => a.map((x) => x.value));
  check(dates.length === 14 && dates[0] === '2026-10-20' && dates[dates.length - 1] === '2026-12-31', 'release-checklist: 14 items from 2026-10-20 to 2026-12-31 (' + dates[0] + ' ' + dates[dates.length - 1] + ')');
  check(dates.includes('2026-11-17'), 'release-checklist: pitch 14 days before = 2026-11-17');
  check((await out()).includes('Tuesday 2026-12-01'), 'release-checklist: 2026-12-01 is a Tuesday (' + (await out()) + ')');
  for (let i = 0; i < 7; i++) await page.locator('.rc .rc-it input[type=checkbox]').nth(i).check();
  check((await out()).startsWith('7 of 14 done (50%)'), 'release-checklist: 7 of 14 = 50%');
  check(!(await page.isChecked('.rc [data-k="save"]')), 'release-checklist: save box unticked');
};
