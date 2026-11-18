// #T1030 Crowd log
export const path = '/everyday/crowd-energy-log/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/crowd-energy-log/`); await page.waitForTimeout(300);
  const t = async (s) => (await page.textContent(`.cl .${s}`)).trim();
  check((await t('cl-sum')).startsWith('No entries yet'), 'crowd-energy-log: starts empty');
  const tap = async (e, track) => { await page.fill('.cl [data-k="track"]', track); await page.click(`.cl .cl-pad button[data-e="${e}"]`); };
  await tap(4, 'B'); await tap(6, 'A'); await tap(9, 'A'); await tap(7, 'C');
  const s = await t('cl-sum');
  check(s.startsWith('4 entries. Peak 9 at 0:00 (A)') && s.includes('Average 6.5'), 'crowd-energy-log: peak 9, average 6.5 (' + s + ')');
  check(s.includes('Best track: A (7.5)') && s.includes('Worst track: B (4.0)'), 'crowd-energy-log: best A 7.5, worst B 4.0');
  check((await page.locator('.cl .cl-list li').count()) === 4 && (await page.locator('.cl .cl-chart circle').count()) === 4, 'crowd-energy-log: 4 list rows and chart points');
  await page.click('.cl .cl-undo');
  check((await page.locator('.cl .cl-list li').count()) === 3, 'crowd-energy-log: undo last');
  check(!(await page.isChecked('.cl [data-k="save"]')), 'crowd-energy-log: save box unticked');
  await page.click('.cl .cl-clear');
  check((await t('cl-sum')).startsWith('No entries yet'), 'crowd-energy-log: clear');
};
