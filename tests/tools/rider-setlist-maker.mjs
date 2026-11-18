// #T1040 Rider maker
export const path = '/everyday/rider-setlist-maker/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/rider-setlist-maker/`); await page.waitForTimeout(300);
  const out = async () => (await page.textContent('.rm .rm-out')).trim();
  check((await out()) === 'No tracks yet.', 'rider-setlist-maker: starts empty');
  const lens = ['4:30', '5:00', '3:45'];
  for (let i = 0; i < 3; i++) {
    if (i) await page.click('.rm .rm-add');
    const r = page.locator('.rm .rm-row').nth(i);
    await r.locator('input').nth(0).fill('Track ' + (i + 1)); await r.locator('input').nth(4).fill(lens[i]);
  }
  check((await out()) === '3 tracks, running time 13:15', 'rider-setlist-maker: 4:30+5:00+3:45 = 13:15 (' + (await out()) + ')');
  await page.locator('.rm .rm-row').nth(2).locator('button', { hasText: 'Up' }).click(); await page.waitForTimeout(100);
  check((await page.locator('.rm .rm-row').nth(1).locator('input').nth(0).inputValue()) === 'Track 3', 'rider-setlist-maker: Up moves a track');
  const prev = await page.textContent('.rm .rm-prev');
  check(prev.includes('Running time 13:15') && prev.includes('8:15') && prev.includes('2 media players'), 'rider-setlist-maker: preview shows total, T2 now starts 8:15 and gear');
  await page.uncheck('.rm .rm-g input[type=checkbox] >> nth=0');
  check(!(await page.textContent('.rm .rm-prev')).includes('2 media players'), 'rider-setlist-maker: untick removes gear');
  check(!(await page.isChecked('.rm [data-k="save"]')), 'rider-setlist-maker: save box unticked');
};
