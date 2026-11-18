// #T1026 Set planner
export const path = '/everyday/dj-set-planner/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/dj-set-planner/`); await page.waitForTimeout(300);
  const out = async () => (await page.textContent('.dp .dp-out')).trim();
  check((await out()).startsWith('35 tracks for 2:00:00 (21:00 to 23:00)'), 'dj-set-planner: 2 h, 4:00 tracks, 30 s overlap = 35 tracks (' + (await out()) + ')');
  check((await page.locator('.dp .dp-trk tbody tr').count()) === 35 && (await page.textContent('.dp .dp-trk tbody tr:last-child')).includes('22:59'), 'dj-set-planner: last track starts 22:59');
  await page.selectOption('.dp [data-k="mode"]', 'bpm'); await page.fill('.dp [data-k="overlap"]', '0'); await page.waitForTimeout(100);
  check((await out()).startsWith('60 tracks'), 'dj-set-planner: 128 BPM x 64 bars = 120 s, 60 tracks');
  check((await page.textContent('.dp .dp-seg tbody tr:first-child')).includes('6.6'), 'dj-set-planner: peak preset, first segment energy 6.6');
  await page.click('.dp .dp-pre button[data-p="warmup"]'); await page.waitForTimeout(100);
  check((await page.textContent('.dp .dp-seg tbody tr:first-child')).includes('2.2 Easy'), 'dj-set-planner: warm-up preset starts easy');
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.fill('.dp [data-k="tracks"]', 'A - One 5:00\nB - Two 5:00\nThree');
  await page.fill('.dp [data-k="overlap"]', '0'); await page.waitForTimeout(100);
  check((await out()).startsWith('Your 3 tracks run 12:00'), 'dj-set-planner: pasted list 5:00+5:00+2:00 default (' + (await out()) + ')');
  check(!(await page.isChecked('.dp [data-k="save"]')), 'dj-set-planner: save box unticked');
};
