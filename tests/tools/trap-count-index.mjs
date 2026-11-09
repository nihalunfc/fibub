// #320 trap count index
export const path = '/science/trap-count-index/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.tci ';
  const big = () => page.textContent(R + '.tci-big'), sites = () => page.textContent(R + '.tci-sites');
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  check((await big()) === 'North orchard: 3.98; South orchard: 2.89 insects per trap per day over the season', `trap index: example (${await big()})`);
  { const s = await sites(); check(s.includes('9.67 (29 Jun)') && s.includes('25 May, 29 Jun') && s.includes('26 May, 14 Jul') && s.includes('25 May (4 checks)') && s.includes('1143') && s.includes('287'), `trap index: site table (${s})`); }
  { const w = await page.textContent(R + '.tci-weeks'); check(w.includes('2026-W19') && w.includes('2026-W32') && w.includes('3.67') && w.includes('3.14'), 'trap index: week table'); }
  check((await page.$$(R + '.tci-checks tbody tr')).length === 28 && (await page.$$(R + '.tci-checks .ax-pill.good')).length === 4 && (await page.$$(R + '.tci-checks .ax-pill.bad')).length === 8, 'trap index: checks with 4 peaks and 8 flags');
  check((await page.textContent(R + '.tci-checks')).includes('4.43'), 'trap index: lost trap corrected');
  check(await page.isVisible(R + '.tci-fig'), 'trap index: chart');
  await page.selectOption(R + '.tci-per', 'week'); await page.waitForTimeout(400);
  check((await big()).startsWith('North orchard: 27.9; South orchard: 20.3 insects per trap per week'), `trap index: per week (${await big()})`);
  await page.selectOption(R + '.tci-per', 'night'); await page.waitForTimeout(400);
  check((await big()).endsWith('per trap per night over the season'), 'trap index: per night');
  await page.selectOption(R + '.tci-per', 'day'); await page.selectOption(R + '.tci-win', '1'); await page.waitForTimeout(400);
  check((await page.$$(R + '.tci-checks .ax-pill.good')).length === 4 && (await sites()).includes('25 May, 29 Jun') && !(await page.textContent(R + '.tci-checks thead')).includes('Smoothed'), 'trap index: no smoothing, peaks on the raw index');
  await page.fill(R + '.tci-share', '90'); await page.waitForTimeout(400);
  check((await page.$$(R + '.tci-checks .ax-pill.good')).length === 2, 'trap index: stricter peak share');
  await page.selectOption(R + '.tci-win', '5'); await page.fill(R + '.tci-share', '20'); await page.fill(R + '.tci-thr', '8'); await page.waitForTimeout(400);
  check((await page.$$(R + '.tci-checks .ax-pill.bad')).length === 2 && (await sites()).includes('22 Jun (2 checks)') && (await sites()).includes('never'), `trap index: flag level 8 (${await sites()})`);
  await page.fill(R + '.tci-thr', ''); await page.waitForTimeout(400);
  check((await page.$$(R + '.tci-checks .ax-pill.bad')).length === 0, 'trap index: no flag level');
  await page.fill(R + '.tci-thr', '5'); await page.selectOption(R + '.tci-win', '3'); await page.waitForTimeout(400);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.tci-csv')]); const f = OUT + 'tci.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows.length === 29 && rows[0] === 'site,date,traps,days,count,trap_days,index_per_trap_per_day,smoothed,peak,flagged' && rows[4] === 'North orchard,2026-05-25,3,7,137,21,6.523810,4.714286,1,1', `trap index: checks CSV (${rows[4]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.tci-wcsv')]); const f = OUT + 'tciw.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows.length === 15 && rows[0] === 'iso_week,North orchard,South orchard' && rows[3].startsWith('2026-W21,3.666667,3.142857'), 'trap index: weeks CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=pdf]')]); check((await d.suggestedFilename()).endsWith('.pdf'), 'trap index: PDF report'); }
  // Days column by header name, in another order; three-column single site; bad input.
  await page.fill(R + '.tci-data', 'count,traps,date,days\n10,4,2026-06-01,2\n30,4,2026-06-05,3\n4,4,2026-06-09,'); await page.waitForTimeout(400);
  check((await big()).startsWith('Site: 1.22') && (await page.textContent(R + '.tci-checks')).includes('1.25'), `trap index: header order and days column (${await big()})`);
  await page.fill(R + '.tci-data', '01/06/2026\t2\t14\n08/06/2026\t2\t28'); await page.waitForTimeout(400);
  check((await big()).startsWith('Site: 1.50') && (await page.textContent(R + '.tci-checks')).includes('2026-06-08'), `trap index: three plain columns, day-first dates (${await big()})`);
  await page.fill(R + '.tci-data', 'date,site,traps,count\n2026-06-01,A,0,5'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.tci-err')).includes('traps × days is zero') && await page.isHidden(R + '.tci-out'), 'trap index: zero traps message');
  await page.fill(R + '.tci-data', 'date,site,traps,count\n2026-06-01,A,2,5\n2026-06-01,A,2,6'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.tci-err')).includes('two checks on'), 'trap index: duplicate check message');
  await page.fill(R + '.tci-data', 'nothing here'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.tci-err')).includes('No checks found'), 'trap index: unreadable data message');
};
