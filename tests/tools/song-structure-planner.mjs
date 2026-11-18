// #T1042 Song planner
export const path = '/everyday/song-structure-planner/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/song-structure-planner/`); await page.waitForTimeout(300);
  const R = '.ssp ';
  check((await page.textContent(R + '.ssp-total')).startsWith('Total 4 bars, 0:08.0'), 'song planner: 4 bars at 120 BPM 4/4 = 8 s');
  await page.fill(R + '.ssp-nbars', '16'); await page.selectOption(R + '.ssp-kind', 'Chorus'); await page.click(R + '.ssp-addbtn');
  const rows = await page.$$eval(R + '.ssp-row .t', (e) => e.map((x) => x.textContent));
  check(rows.join() === '0:00.0,0:08.0', `song planner: second section starts at 8 s (${rows})`);
  check((await page.textContent(R + '.ssp-total')).startsWith('Total 20 bars, 0:40.0'), 'song planner: total 20 bars = 40 s');
  await page.selectOption(R + '.ssp-ts', '3/4');
  check((await page.textContent(R + '.ssp-total')).startsWith('Total 20 bars, 0:30.0'), 'song planner: 3/4 bars are 1.5 s');
  await page.click(R + '.ssp-row:nth-child(1) .dup');
  check((await page.$$(R + '.ssp-row')).length === 3, 'song planner: copy adds a row');
  await page.selectOption(R + '.ssp-tpl', 'house');
  check((await page.textContent(R + '.ssp-total')).startsWith('Total 128 bars, 4:07.7'), `song planner: house template 128 bars at 124 BPM (${await page.textContent(R + '.ssp-total')})`);
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ssp-mk')]); const f = OUT + 'mk.csv'; await d.saveAs(f);
  const l = readFileSync(f, 'utf8').trim().split('\n');
  check(l[1] === '1 Intro,0.000,0:00:00.000' && l[2].startsWith('2 Build,30.968'), `song planner: markers (${l[2]})`);
};
