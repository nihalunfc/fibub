// #503 Westgard rules QC checker
export const path = '/science/westgard-qc/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/westgard-qc/`); await page.waitForTimeout(900);
  const big = () => page.textContent('.wq .wq-big'), flags = () => page.textContent('.wq .wq-flags'), stats = () => page.textContent('.wq .wq-stats');
  const rule = async (id, on) => { const el = page.locator(`.wq .wq-rules input[value="${id}"]`); await el.scrollIntoViewIfNeeded(); if ((await el.isChecked()) !== on) await el.click(); await page.waitForTimeout(150); };
  check((await page.textContent('.wq .wq-med')).includes('not medical advice'), 'westgard: medical notice near the top');
  check((await big()) === '5 runs rejected, 1 warning, 24 in control (of 30)', `westgard: example summary (${await big()})`);
  { const f = await flags(); check(f.includes('6Warning1-2s (Level 1)+2.30 / +0.40') && f.includes('9Reject1-2s (Level 1); 1-3s (Level 1)') && f.includes('12Reject1-2s (Level 1, Level 2); 2-2s (Level 1 + Level 2)+2.20 / +2.40') && f.includes('R-4s (Level 1 + Level 2)+2.30 / −2.20') && f.includes('18Reject4-1s (across levels, Level 1 + Level 2)') && f.includes('30Reject10x (within the level, Level 2)'), 'westgard: each planted error found by its rule'); }
  check((await stats()).includes('Level 13050.2005.0850.2124.161.692') && (await stats()).includes('2.940.9223.08'), 'westgard: CV, bias and sigma = numpy');
  check(await page.$$eval('.wq .wq-lj', (c) => c.length) === 2, 'westgard: one Levey-Jennings chart per level');
  await rule('10x', false); check((await big()).startsWith('4 runs rejected'), 'westgard: turning off 10x');
  await rule('10x', true); await rule('6x', true); await page.waitForTimeout(150);
  check((await flags()).includes('6x (within the level, Level 2)') && (await big()).startsWith('9 runs rejected'), `westgard: 6x catches the shift earlier (${await big()})`);
  await rule('6x', false);
  await page.click('.wq .wq-all'); await page.waitForTimeout(200);
  check((await page.$$eval('.wq .wq-rules input:checked', (e) => e.length)) === 13, 'westgard: all rules button');
  await page.click('.wq .wq-classic'); await page.waitForTimeout(200);
  check((await page.$$eval('.wq .wq-rules input:checked', (e) => e.length)) === 6 && (await big()).startsWith('5 runs rejected'), 'westgard: classic set button');
  await page.locator('.wq .wq-gate').scrollIntoViewIfNeeded(); await page.click('.wq .wq-gate'); await page.waitForTimeout(200);
  check((await big()).startsWith('3 runs rejected') && !(await flags()).includes('4-1s'), `westgard: 1-2s gate skips runs 18 and 30 (${await big()})`);
  await page.click('.wq .wq-gate'); await page.click('.wq .wq-12rej'); await page.waitForTimeout(200);
  check((await big()).startsWith('6 runs rejected, 0 warnings'), 'westgard: 1-2s as a rejection rule');
  await page.click('.wq .wq-12rej'); await page.waitForTimeout(150);
  await page.fill('.wq .wq-bias', '0'); await page.waitForTimeout(400);
  check((await stats()).includes('4.1602.4') && (await page.textContent('.wq .wq-note')).includes('typed bias of 0 %'), 'westgard: typed bias');
  await page.fill('.wq .wq-bias', '');
  await page.selectOption('.wq .wq-src', 'all'); await page.waitForTimeout(300);
  check((await page.textContent('.wq .wq-note')).includes('from all these results') && (await stats()).includes('5.0850.2125.0850.212'), 'westgard: targets from the results');
  await page.selectOption('.wq .wq-src', 'first'); await page.fill('.wq .wq-first', '5'); await page.waitForTimeout(400);
  check((await page.textContent('.wq .wq-note')).includes('first 5 runs'), 'westgard: targets from the first runs');
  await page.fill('.wq .wq-first', '99'); await page.waitForTimeout(400);
  check((await page.textContent('.wq .wq-err')).includes('from 2 to 30'), 'westgard: too many first runs message');
  await page.selectOption('.wq .wq-src', 'typed'); await page.waitForTimeout(200);
  await page.locator('.wq .wq-csv').scrollIntoViewIfNeeded();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.wq .wq-csv')]); const f = OUT + 'wq.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n'); check(t.length === 31 && t[0] === 'run,Level 1,z Level 1,Level 2,z Level 2,status,rules' && t[9].startsWith('9,5.68,3.4,15.3,0.6,reject'), 'westgard: CSV of runs'); }
  await page.locator('.wq .dl button[data-f=pdf]').scrollIntoViewIfNeeded();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.wq .dl button[data-f=pdf]')]); const f = OUT + 'wq.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'westgard: PDF report'); }
  await page.fill('.wq .wq-data', 'Date\tLow\n2026-01-01\t5.1\n2026-01-02\t\n2026-01-03\t5.9\n2026-01-04\t5.5'); await page.fill('.wq .wq-mean', '5'); await page.fill('.wq .wq-sd', '0.2'); await page.waitForTimeout(500);
  { const f = await flags(); check(f.includes('2026-01-03Reject1-2s; 1-3s') && f.includes('2026-01-04Reject1-2s; 2-2s') && f.includes('–') === false, `westgard: one level, dates as labels, a missing result (${f})`); }
  await page.fill('.wq .wq-mean', '5, 6'); await page.waitForTimeout(400);
  check((await page.textContent('.wq .wq-err')).includes('Type 1 target mean'), 'westgard: wrong number of targets message');
  await page.fill('.wq .wq-mean', '5'); await page.fill('.wq .wq-sd', '0'); await page.waitForTimeout(400);
  check((await page.textContent('.wq .wq-err')).includes('SDs above zero'), 'westgard: zero SD message');
  await page.fill('.wq .wq-data', 'Run\nA\nB'); await page.waitForTimeout(400);
  check((await page.textContent('.wq .wq-err')).includes('No columns of numbers') && await page.isHidden('.wq .wq-out'), 'westgard: no numbers message');
};
