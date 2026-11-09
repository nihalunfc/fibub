// #488 training load tracker
export const path = '/science/training-load/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/training-load/`); await page.waitForTimeout(600);
  const R = '.tl ', big = () => page.textContent(R + '.tl-big');
  check((await page.textContent(R + '.tl-med')).includes('not medical advice'), 'trainload: medical line');
  check((await page.evaluate(() => localStorage.getItem('fibub-training-load-v1'))) === null && !(await page.isChecked(R + '.tl-remember')), 'trainload: nothing stored by default');
  check((await big()) === 'ACWR 1.41 (rolling) · 1.19 (EWMA)', 'trainload: example session RPE ratios (pandas 1.4139, 1.1907)');
  { const f = await page.textContent(R + '.tl-facts'); check(f.includes('2026-10-25') && f.includes('1,878') && f.includes('1,328') && f.includes('monotony1.01') && f.includes('strain1,897') && f.includes('35 over 49 days'), 'trainload: acute, chronic, monotony, strain'); }
  { const t = await page.textContent(R + '.tl-tab'); check((await page.$$eval(R + '.tl-tab tr', (r) => r.length)) === 8 && t.includes('7 Sep') && t.includes('1,075') && t.includes('1.05'), 'trainload: weekly table'); }
  check(await page.isVisible(R + '.tl-fig1') && await page.isVisible(R + '.tl-fig2'), 'trainload: both charts');
  await page.selectOption(R + '.tl-m', 'banister'); await page.waitForTimeout(150);
  check((await big()) === 'ACWR 1.37 (rolling) · 1.18 (EWMA)', 'trainload: Banister TRIMP (pandas 1.3732, 1.1846)');
  await page.selectOption(R + '.tl-sex', 'f'); await page.waitForTimeout(150);
  check((await big()) === 'ACWR 1.37 (rolling) · 1.19 (EWMA)' && (await page.textContent(R + '.tl-facts')).includes('682'), 'trainload: Banister women (pandas 1.3704, 1.1880, acute 681.9)');
  await page.selectOption(R + '.tl-m', 'edwards'); await page.waitForTimeout(150);
  check((await big()) === 'ACWR 1.34 (rolling) · 1.17 (EWMA)' && (await page.textContent(R + '.tl-facts')).includes('828'), 'trainload: Edwards TRIMP (pandas 1.3366, 1.1702)');
  // downloads
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.tl-csv')]); const f = OUT + 'tl-daily.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 50 && rows[0].startsWith('date,load,acute_7d_sum') && rows[49].startsWith('2026-10-25,'), 'trainload: daily results CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.tl-export')]); const f = OUT + 'tl-log.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.trim().split('\n').length === 36 && t.startsWith('date,minutes,rpe,avg_hr,z1') && t.includes('"race-pace, hills"'), 'trainload: export log CSV'); }
  for (const f of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl button[data-f=${f}]`)]); check(d.suggestedFilename().endsWith('.' + f), `trainload: ${f} download`); }
  // add a session
  await page.selectOption(R + '.tl-m', 'srpe'); await page.click(R + '.tl-addw summary');
  await page.fill(R + '.tl-ad', '2026-10-26'); await page.fill(R + '.tl-amin', '60'); await page.fill(R + '.tl-arpe', '6'); await page.fill(R + '.tl-az', '10, 20, 20, 10, 0'); await page.click(R + '.tl-add'); await page.waitForTimeout(200);
  check((await page.inputValue(R + '.tl-in')).trim().endsWith('2026-10-26,60,6,,10,20,20,10,0,') && (await page.textContent(R + '.tl-facts')).includes('2026-10-26'), 'trainload: session added');
  await page.fill(R + '.tl-amin', '30'); await page.fill(R + '.tl-arpe', ''); await page.click(R + '.tl-add'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.tl-aerr')).includes('RPE'), 'trainload: add form needs a load');
  // remember on this device
  await page.check(R + '.tl-remember'); await page.waitForTimeout(100);
  check((await page.evaluate(() => JSON.parse(localStorage.getItem('fibub-training-load-v1')).text)).includes('2026-10-26'), 'trainload: remembered when ticked');
  await page.reload(); await page.waitForTimeout(600);
  check(await page.isChecked(R + '.tl-remember') && (await page.textContent(R + '.tl-facts')).includes('2026-10-26') && (await page.textContent(R + '.tl-kmsg')).includes('loaded'), 'trainload: log back after reload');
  await page.uncheck(R + '.tl-remember'); await page.waitForTimeout(100);
  check((await page.evaluate(() => localStorage.getItem('fibub-training-load-v1'))) === null, 'trainload: unticking removes the copy');
  await page.check(R + '.tl-remember'); await page.click(R + '.tl-clear'); await page.waitForTimeout(150);
  check((await page.evaluate(() => localStorage.getItem('fibub-training-load-v1'))) === null && (await page.inputValue(R + '.tl-in')) === '' && (await page.textContent(R + '.tl-err')).includes('at least one session') && !(await page.isChecked(R + '.tl-remember')), 'trainload: Clear empties the log and storage');
  // import a CSV (other column order, tab separated)
  writeFileSync(OUT + 'tl-import.csv', 'Date\tRPE\tMinutes\n2026-01-05\t5\t60\n2026-01-06\t3\t30\n2026-01-08\t7\t45\n');
  await page.setInputFiles(R + '.dfb-in', OUT + 'tl-import.csv'); await page.waitForTimeout(500);
  check((await big()) === 'EWMA ratio 0.81' && (await page.textContent(R + '.tl-facts')).includes('3 over 4 days') && (await page.textContent(R + '.tl-warn')).includes('28 days'), 'trainload: imported CSV, short log, EWMA only (pandas 0.8096)');
  // bad input
  await page.fill(R + '.tl-in', '2026-02-30,40,5'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.tl-err')).includes('not a date') && await page.isHidden(R + '.tl-out'), 'trainload: bad date message');
  await page.fill(R + '.tl-in', '2026-02-01,40,5'); await page.selectOption(R + '.tl-m', 'banister'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.tl-err')).includes('average heart rate'), 'trainload: no heart rates for Banister');
  await page.click(R + '.tl-example'); await page.waitForTimeout(200);
  check((await big()) === 'ACWR 1.37 (rolling) · 1.19 (EWMA)', 'trainload: example back (Banister, women)');
};
