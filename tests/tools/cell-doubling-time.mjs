// #189 cell doubling time and passage planner
export const path = '/science/cell-doubling-time/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.cdt ';
  const txt = async (s) => (await page.textContent(R + s)).replace(/\s+/g, ' ');
  const row = (i, c) => `${R}.cd-row:nth-child(${i}) ${c}`;
  const tap = async (s) => { await page.locator(s).scrollIntoViewIfNeeded(); await page.click(s); await page.waitForTimeout(100); };
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(400);
  // The example: five ticked counts, the plateau count left out.
  check((await txt('.cd-big')) === 'Doubling time 23.56 h (0.9816 days)', 'doubling: example doubling time');
  { const f = await txt('.cd-facts'); check(f.includes('0.02942 per hour') && f.includes('0.7062 per day') && f.includes('21.77 to 25.67 h') && f.includes('4.075') && f.includes('16.85-fold') && f.includes('×2.026') && f.includes('R² = 0.9980') && f.includes('5 of 6 counts used'), 'doubling: example facts'); }
  { const t = await txt('.cd-steps'); check(t.includes('0 → 24') && t.includes('28.30 h') && t.includes('1,600,000 → 1,900,000') && t.includes('96.80 h'), 'doubling: steps table'); }
  check((await page.$$(R + '.cd-row')).length === 6 && !(await page.isChecked(row(6, '.cd-use'))) && (await txt('.cd-warn')) === '', 'doubling: six rows, last unticked, no warnings');
  check(await page.evaluate(() => { const c = document.querySelector('.cdt .cd-fig'); return c.width > 0 && c.getAttribute('aria-label').includes('23.56 h'); }), 'doubling: growth plot drawn');
  // Tick the plateau count: slower, with a warning.
  await tap(row(6, '.cd-use'));
  check((await txt('.cd-big')).startsWith('Doubling time 26.50 h') && (await txt('.cd-warn')).includes('slows down') && (await page.inputValue(R + '.cd-td')) === '26.5', 'doubling: plateau ticked, warning, planner follows the fit');
  await tap(row(6, '.cd-use'));
  // Two counts only.
  for (const i of [2, 3, 4]) await page.uncheck(row(i, '.cd-use'));
  await page.waitForTimeout(100);
  check((await txt('.cd-big')).startsWith('Doubling time 24 h') && (await txt('.cd-sub')).includes('From two counts') && (await txt('.cd-facts')).includes('needs 3+ counts'), 'doubling: two counts (1e5 to 1.6e6 in 96 h = 24 h)');
  for (const i of [2, 3, 4]) await page.check(row(i, '.cd-use'));
  // Days instead of hours.
  await page.selectOption(R + '.cd-tu', 'd'); await page.waitForTimeout(100);
  check((await txt('.cd-big')).startsWith('Doubling time 565.4 h') && (await txt('.cd-steps')).includes('Time (days)'), 'doubling: times read as days');
  await page.selectOption(R + '.cd-tu', 'h'); await page.waitForTimeout(100);
  // Bad input messages.
  await page.fill(row(2, '.cd-n'), 'abc'); await page.waitForTimeout(100);
  check((await txt('.cd-err')).includes('Count 2: type a number') && await page.isHidden(R + '.cd-out') && (await page.$$(R + '.cd-badrow')).length === 1, 'doubling: bad count message');
  await page.fill(row(2, '.cd-n'), '180000');
  await page.fill(row(5, '.cd-n'), '50000'); await page.fill(row(4, '.cd-n'), '60000'); await page.fill(row(3, '.cd-n'), '90000'); await page.waitForTimeout(100);
  check((await txt('.cd-err')).includes('do not go up'), 'doubling: falling counts message');
  // Remove and add rows.
  await tap(R + '.cd-clear');
  check((await page.$$(R + '.cd-row')).length === 2 && (await txt('.cd-err')).includes('Type at least two counts') && await page.isHidden(R + '.cd-out'), 'doubling: start empty and its message');
  await page.fill(row(1, '.cd-t'), '0'); await page.fill(row(1, '.cd-n'), '2e5'); await page.fill(row(2, '.cd-t'), '72'); await page.fill(row(2, '.cd-n'), '1.2e6'); await page.waitForTimeout(100);
  check((await txt('.cd-big')).startsWith('Doubling time 27.85 h'), 'doubling: typed two counts (27.85 h)');
  await tap(R + '.cd-add'); await page.fill(row(3, '.cd-t'), '24'); await page.fill(row(3, '.cd-n'), '4e5'); await page.waitForTimeout(100);
  check((await txt('.cd-facts')).includes('3 of 3 counts used'), 'doubling: add a count');
  await tap(row(3, '.cd-del'));
  check((await page.$$(R + '.cd-row')).length === 2 && (await txt('.cd-big')).startsWith('Doubling time 27.85 h'), 'doubling: remove a count');
  // Paste a table with a "no" column.
  await page.click(R + '.cd-pastebox summary');
  await page.fill(R + '.cd-paste', 'time\tcells\n0\t1e5\n24\t2e5\n48\t4e5\n72\t5e5\tno\nbad line\t5');
  await tap(R + '.cd-usepaste');
  check((await page.$$(R + '.cd-row')).length === 4 && (await txt('.cd-big')).startsWith('Doubling time 24 h') && (await txt('.cd-perr')).includes('Line 6'), 'doubling: pasted table');
  await page.fill(R + '.cd-paste', ''); await tap(R + '.cd-usepaste');
  check((await txt('.cd-perr')).includes('Paste a table first'), 'doubling: empty paste message');
  // Counts CSV.
  { const [d] = await Promise.all([page.waitForEvent('download'), tap(R + '.cd-csv')]); const f = OUT + 'cdt.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.startsWith('time_hours,count_cells/mL,used,fitted_count\n0,100000,yes,') && t.includes('72,500000,no,') && t.includes('doubling_time_h,24') && d.suggestedFilename() === 'doubling-time-counts.csv', 'doubling: counts CSV'); }
  // Back to the example; the planner.
  await tap(R + '.cd-ex');
  check((await txt('.cd-pbig')) === 'Seed 721,400 cells per T75 flask' && (await txt('.cd-psub')).includes('9,619 cells/cm², about 9.619 % confluent') && (await txt('.cd-psub')).includes('3.056 doublings'), 'passage: example seeding');
  { const f = await txt('.cd-pfacts'); check(f.includes('1 : 8.317') && f.includes('601 µL') && f.includes('14.4 mL') && f.includes('1,443,000 cells') && f.includes('8 T75 flasks'), 'passage: example facts'); }
  check((await txt('.cd-nowhelp')).includes('about 6,000,000 cells') && (await txt('.cd-psteps')).includes('Add 601 µL of cell suspension to each T75 flask'), 'passage: cells now and steps');
  // Fixed split date for the schedule.
  await page.fill(R + '.cd-date', '2026-11-09'); await page.waitForTimeout(100);
  { const t = await txt('.cd-sched'); check(t.includes('P12 → P13') && t.includes('Mon 9 Nov 2026') && t.includes('Thu 12 Nov 2026') && t.includes('P17 → P18') && t.includes('Tue 24 Nov 2026') && t.includes('15.28') && t.includes('2.39 × 10¹¹'), 'passage: schedule table'); }
  check((await txt('.cd-psteps')).includes('Thu 12 Nov 2026'), 'passage: ready date');
  // Own doubling time, then back to the fit.
  await page.fill(R + '.cd-td', '24'); await page.waitForTimeout(100);
  check((await txt('.cd-psub')).includes('3 doublings') && (await txt('.cd-pfacts')).includes('1 : 8') && await page.isVisible(R + '.cd-usefit') && (await txt('.cd-tdnote')).includes('The fit says 23.56 h'), 'passage: typed doubling time');
  await tap(R + '.cd-usefit');
  check((await page.inputValue(R + '.cd-td')) === '23.56' && await page.isHidden(R + '.cd-usefit'), 'passage: use the fitted value again');
  // Lag.
  await page.fill(R + '.cd-lag', '12'); await page.waitForTimeout(100);
  check((await txt('.cd-psub')).includes('2.547 doublings'), 'passage: 12 h lag');
  await page.fill(R + '.cd-lag', '0');
  // New vessel: 6-well plate, 6 wells, 70 % in 2 days.
  await page.selectOption(R + '.cd-v1', 'w6'); await page.fill(R + '.cd-n1', '6'); await page.fill(R + '.cd-tp', '70'); await page.fill(R + '.cd-days', '2'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.cd-a1')) === '10' && (await page.inputValue(R + '.cd-m1')) === '2' && (await txt('.cd-pbig')).endsWith('per well') && (await txt('.cd-pfacts')).includes('For 6 wells'), 'passage: 6-well plate fills area and medium');
  // Typing an area switches the vessel to Other.
  await page.fill(R + '.cd-a1', '9.6'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.cd-v1')) === 'other' && (await txt('.cd-pbig')).endsWith('per vessel'), 'passage: own area');
  // Cell count instead of confluence.
  await tap(R + '.cd-mode button[data-m=count]');
  await page.fill(R + '.cd-cpm', '5e5'); await page.fill(R + '.cd-rv', '4'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.cd-confl') && (await txt('.cd-nowhelp')).includes('That is 2,000,000 cells in all') && (await txt('.cd-pfacts')).includes('at 500,000 cells/mL'), 'passage: from a cell count');
  // Warnings: not enough cells, over 90 %, too sparse.
  await page.fill(R + '.cd-n1', '40'); await page.waitForTimeout(100);
  check((await txt('.cd-pwarn')).includes('40 vessels need more cells than you have'), 'passage: not enough cells');
  await page.fill(R + '.cd-n1', '2'); await page.fill(R + '.cd-tp', '95'); await page.waitForTimeout(100);
  check((await txt('.cd-pwarn')).includes('above 90 %'), 'passage: over 90 % warning');
  await page.fill(R + '.cd-tp', '70'); await page.fill(R + '.cd-days', '10'); await page.waitForTimeout(100);
  check((await txt('.cd-pwarn')).includes('very sparse'), 'passage: sparse warning');
  // Bad input.
  await page.fill(R + '.cd-tp', '120'); await page.waitForTimeout(100);
  check((await txt('.cd-perr2')).includes('between 1 and 100') && await page.isHidden(R + '.cd-pout'), 'passage: bad target message');
  await page.fill(R + '.cd-tp', '70'); await page.fill(R + '.cd-n1', '1.5'); await page.waitForTimeout(100);
  check((await txt('.cd-perr2')).includes('whole number'), 'passage: bad vessel count message');
  await page.fill(R + '.cd-n1', '2'); await page.fill(R + '.cd-td', ''); await page.waitForTimeout(100);
  check((await txt('.cd-perr2')).includes('doubling time'), 'passage: empty doubling time message');
  await tap(R + '.cd-usefit');
  check(await page.isVisible(R + '.cd-pout'), 'passage: back to a plan');
  // Schedule CSV and the report.
  { const [d] = await Promise.all([page.waitForEvent('download'), tap(R + '.cd-scsv')]); const f = OUT + 'cdt-sched.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n'); check(t.length === 7 && t[0].startsWith('passage_from,passage_to,date,day') && t[1].startsWith('12,13,2026-11-09,0,') && t[2].startsWith('13,14,2026-11-19,10,70,'), 'passage: schedule CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), tap(R + '.dl button[data-f=pdf]')]); check(d.suggestedFilename() === 'cell-doubling-time.pdf', 'report: PDF'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), tap(R + '.dl button[data-f=png]')]); check(d.suggestedFilename() === 'cell-doubling-time.png', 'report: image'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), tap(R + '.dl button[data-f=docx]')]); check(d.suggestedFilename() === 'cell-doubling-time.docx', 'report: Word'); }
  check(await page.evaluate(() => document.querySelector('.cdt .cd-fig2').width > 0), 'passage: confluence plot drawn');
};
