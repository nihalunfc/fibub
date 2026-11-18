// #T1029 Transition timer
export const path = '/everyday/transition-timer/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/transition-timer/`); await page.waitForTimeout(300);
  const t = async (s) => (await page.textContent(`.tt .${s}`)).trim();
  check((await t('tt-time')) === '1:00', 'transition-timer: 32 bars at 128 BPM = 1:00');
  await page.fill('.tt [data-k="bpm"]', '120'); await page.waitForTimeout(100);
  check((await t('tt-time')) === '1:04', 'transition-timer: 32 bars at 120 BPM = 64 s');
  await page.selectOption('.tt .tt-drill', 'cut'); await page.fill('.tt [data-k="bpm"]', '240'); await page.waitForTimeout(100);
  check((await t('tt-time')) === '0:02', 'transition-timer: quick cut 2 bars at 240 BPM = 2 s');
  await page.click('.tt .tt-go'); await page.waitForTimeout(2600);
  check((await t('tt-time')) === 'Done', 'transition-timer: countdown finishes');
  for (const r of ['clean', 'clean', 'ok']) await page.click(`.tt .tt-r[data-r="${r}"]`);
  await page.click('.tt .tt-r[data-r="trainwreck"]');
  const s = await t('tt-stats');
  check(s.includes('4 attempts: 2 clean, 1 ok, 1 trainwreck') && s.includes('Average 63%') && s.includes('streak of clean runs: 2'), 'transition-timer: stats (' + s + ')');
  await page.click('.tt .tt-clear');
  check((await t('tt-stats')) === 'No attempts yet.' && !(await page.isChecked('.tt [data-k="save"]')), 'transition-timer: clear, save box unticked');
};
