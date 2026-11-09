// #823 Gantt chart and critical path
export const path = '/science/gantt-chart/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/gantt-chart/`); await page.waitForTimeout(400);
  const big = () => page.textContent('.gnt .gt-big');
  const wait = () => page.waitForTimeout(500);
  check((await big()) === '28 months' && (await page.textContent('.gnt .gt-path')) === 'Critical path: B → C → D → M1 → E → F → G → H → M2', 'gantt: example length and critical path');
  { const f = await page.textContent('.gnt .gt-facts'); check(f.includes('Tasks9') && f.includes('Milestones2') && f.includes('Work packages4') && f.includes('Critical tasks9') && f.includes('Most floatI: 5 months'), 'gantt: facts'); }
  { const t = await page.textContent('.gnt .gt-tab'); check(t.includes('AEthics approvalWP1 Set-upM1M33 months4 months') && t.includes('M1Pilot completeWP2 Data collectionM9M9milestone0yes'), 'gantt: schedule table'); }
  check(await page.isVisible('.gnt .gt-fig') && (await page.$eval('.gnt .gt-fig', (c) => c.style.width)) === '968px', 'gantt: chart drawn at its own width');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.gnt .gt-svg')]); const f = OUT + 'g.svg'; await d.saveAs(f); const s = readFileSync(f, 'utf8');
    check(s.startsWith('<svg xmlns') && (s.match(/fill="#D55E00"/g) ?? []).length === 9 && (s.match(/marker-end/g) ?? []).length === 11 && s.includes('>WP4 Sharing<'), 'gantt: SVG download'); }
  await page.uncheck('.gnt .gt-deps'); await wait();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.gnt .gt-svg')]); const f = OUT + 'g2.svg'; await d.saveAs(f); check(!readFileSync(f, 'utf8').includes('marker-end'), 'gantt: arrows off'); }
  await page.check('.gnt .gt-deps'); await page.fill('.gnt .gt-date', '2027-01-01'); await page.dispatchEvent('.gnt .gt-date', 'change'); await wait();
  check((await big()) === '28 months, ending 2029-04-30' && (await page.textContent('.gnt .gt-tab')).includes('2027-01-01'), 'gantt: project start date gives dates');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.gnt .gt-csv')]); const f = OUT + 'g.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').replace(/^﻿/, '').trim().split('\r\n');
    check(rows.length === 12 && rows[0].startsWith('ID,Task,Work package,Start,Duration,Depends on,End,First period') && rows.some((r) => r.startsWith('A,Ethics approval,WP1 Set-up,1,3,,,1,3,0,3,4,7,4,4,no,2027-01-01,2027-03-31')), 'gantt: CSV download'); }
  for (const f of ['pdf', 'docx', 'png']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.gnt .dl [data-f=${f}]`)]); const p = OUT + 'g.' + f; await d.saveAs(p); check(readFileSync(p).length > 3000, `gantt: ${f} download`); }
  // Open the CSV again through "Open a file".
  await page.click('.gnt .gt-empty'); await wait();
  check((await page.textContent('.gnt .gt-err')).includes('Add at least one task'), 'gantt: start empty');
  await page.setInputFiles('.gnt .dfb-in', OUT + 'g.csv'); await wait();
  check((await big()) === '28 months, ending 2029-04-30' && (await page.textContent('.gnt .gt-path')).includes('B → C'), 'gantt: opens its own CSV');
  // Dates typed in, weeks, a fixed start.
  await page.selectOption('.gnt .gt-unit', 'week'); await page.fill('.gnt .gt-text', 'ID,Task,WP,Start,Duration,Depends on,End\nK,Kick-off,,2027-01-01,0\nL,Lit review,,2027-01-08,,K,2027-02-04\nP,Protocol,,,3,L\nS,Fieldwork,,10,4,P'); await wait();
  { const t = await page.textContent('.gnt .gt-tab'); check((await big()) === '13 weeks, ending 2027-04-01' && t.includes('LLit review2027-01-082027-02-044 weeks') && t.includes('PProtocol2027-02-052027-02-253 weeks1 week'), `gantt: weeks, dates and a fixed start (${await big()})`); }
  await page.fill('.gnt .gt-date', ''); await page.dispatchEvent('.gnt .gt-date', 'change'); await wait();
  check((await page.textContent('.gnt .gt-err')).includes('set the project start date first'), 'gantt: dates need a start date');
  await page.selectOption('.gnt .gt-unit', 'day'); await page.fill('.gnt .gt-text', 'A,One,,,2,B\nB,Two,,,2,A\nC,Three,,,1'); await wait();
  check((await page.textContent('.gnt .gt-err')).includes('in a loop') && (await page.textContent('.gnt .gt-err')).includes('A, B') && await page.isHidden('.gnt .gt-out'), 'gantt: loop message');
  await page.fill('.gnt .gt-text', 'A,One,,,2,Z'); await wait();
  check((await page.textContent('.gnt .gt-err')).includes('"Z", which is not a task ID'), 'gantt: unknown dependency');
  await page.fill('.gnt .gt-text', 'A,One,,,2\nB,Two,,,3,A+1\nC,Three,,,1,A'); await wait();
  check((await big()) === '6 days' && (await page.textContent('.gnt .gt-path')) === 'Critical path: A → B' && (await page.textContent('.gnt .gt-tab')).includes('CThreeD3D31 day3 days'), 'gantt: days with a lag');
  await page.click('.gnt .gt-ex'); await wait();
  check((await big()) === '28 months', 'gantt: example again');
};
