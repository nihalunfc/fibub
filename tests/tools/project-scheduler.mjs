// #585 project scheduling: CPM, PERT and Gantt
export const path = '/science/project-scheduler/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/project-scheduler/`); await page.waitForTimeout(800);
  const big = () => page.textContent('.pjs .pj-big');
  check((await big()) === 'The project takes 30.5 days' && (await page.textContent('.pjs .pj-facts')).includes('A → C → E → G → H → I'), 'cpm: PERT example 30.5 days and critical path');
  { const t = await page.textContent('.pjs .pj-tab'); check(t.includes('Draw the plans6.3331') && t.includes('4.833') && await page.locator('.pjs .pj-tab tr.crit').count() === 6, 'cpm: task table with SD, float and critical rows'); }
  check(await page.isVisible('.pjs .pj-fig'), 'cpm: Gantt chart');
  { const p = await page.textContent('.pjs .pj-pbig'), t = await page.textContent('.pjs .pj-ptab'); check(p.startsWith('73.4 % chance by 32 days (PERT); 73.5 % in the simulation') && t.includes('33.57') && t.includes('2.398') && await page.isVisible('.pjs .pj-hist'), `cpm: PERT chance and simulation (${p})`); }
  await page.fill('.pjs .pj-D', '35'); await page.waitForTimeout(600);
  check((await page.textContent('.pjs .pj-pbig')).startsWith('97 % chance by 35 days'), 'cpm: another target');
  { const before = await page.textContent('.pjs .pj-ptab'); await page.fill('.pjs .pj-seed', '2'); await page.waitForTimeout(600);
    const after = await page.textContent('.pjs .pj-ptab'); check(after !== before && after.includes('Simulation (5,000 runs)'), 'cpm: new seed changes the simulation'); }
  await page.selectOption('.pjs .pj-runs', '1000'); await page.waitForTimeout(500);
  check((await page.textContent('.pjs .pj-ptab')).includes('Simulation (1,000 runs)'), 'cpm: number of runs');
  await page.fill('.pjs .pj-start', '2026-11-06'); await page.waitForTimeout(400);
  check((await big()) === 'The project takes 30.5 days, finishing 2026-12-18' && (await page.textContent('.pjs .pj-tab')).includes('Start date'), 'cpm: dates on working days');
  await page.uncheck('.pjs .pj-wd'); await page.waitForTimeout(300);
  check((await big()).endsWith('finishing 2026-12-06'), 'cpm: calendar days');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pjs .pj-csv')]); const f = OUT + 'cpm.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 10 && rows[0].startsWith('id,task,duration,optimistic') && rows[0].endsWith('start date,finish date') && rows[3].startsWith('C,Draw the plans,6.333') && rows[3].includes(',yes,'), 'cpm: schedule CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pjs .pj-png')]); const f = OUT + 'gantt.png'; await d.saveAs(f); const b = readFileSync(f); check(b.slice(1, 4).toString() === 'PNG' && b.length > 5000, 'cpm: Gantt PNG'); }
  await page.fill('.pjs .pj-start', '');
  await page.selectOption('.pjs .pj-ex', 'plain'); await page.waitForTimeout(400);
  check((await big()) === 'The project takes 22 days' && await page.isHidden('.pjs .pj-pert') && (await page.textContent('.pjs .pj-tab')).includes('C SS+2'), 'cpm: plain example with lags, no PERT card');
  await page.selectOption('.pjs .pj-u', 'weeks'); await page.waitForTimeout(300);
  check((await big()) === 'The project takes 22 weeks', 'cpm: time unit');
  writeFileSync(OUT + 'tasks.csv', 'Code,Task,Days,Depends on\nX,First,2,\nY,Second,3,X\nZ,Third,1,X\n');
  await page.setInputFiles('.pjs .dfb-in', OUT + 'tasks.csv'); await page.waitForTimeout(700);
  check((await big()) === 'The project takes 5 weeks' && (await page.inputValue('.pjs .pj-ex')) === 'own', 'cpm: open a CSV file');
  await page.fill('.pjs .pj-in', 'A,,1,C\nB,,1,A\nC,,1,B'); await page.waitForTimeout(600);
  check((await page.textContent('.pjs .pj-err')).includes('loop') && await page.isHidden('.pjs .pj-out'), 'cpm: loop message');
  await page.fill('.pjs .pj-in', 'A,,1,Q'); await page.waitForTimeout(600);
  check((await page.textContent('.pjs .pj-err')).includes('"Q" is not a task ID'), 'cpm: unknown predecessor message');
  await page.selectOption('.pjs .pj-ex', 'pert'); await page.waitForTimeout(500);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pjs .dl [data-f=pdf]')]); check((await d.suggestedFilename()).endsWith('.pdf'), 'cpm: PDF report'); }
};
