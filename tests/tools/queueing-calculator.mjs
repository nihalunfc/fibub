// #584 queueing calculator
export const path = '/science/queueing-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/queueing-calculator/`); await page.waitForTimeout(700);
  const big = () => page.textContent('.qcs .qc-big'), facts = () => page.textContent('.qcs .qc-facts');
  check((await big()) === 'Average wait in the queue Wq = 1.763 minutes' && (await facts()).includes('58.75 %') && (await facts()).includes('83.33 %') && (await facts()).includes('7.938'), 'queue: help desk example (M/M/c)');
  check((await page.textContent('.qcs .qc-sbig')) === '8 servers answer 80 % within 20 s' && (await page.textContent('.qcs .qc-stab .qc-hi')).includes('88.01'), 'queue: staffing for 80 % in 20 s');
  { const t = await page.textContent('.qcs .qc-simtab'); check((await page.textContent('.qcs .qc-simn')).startsWith('100,000 customers') && t.includes('±') && await page.isVisible('.qcs .qc-fig') && await page.isVisible('.qcs .qc-fig2'), 'queue: simulation table and charts'); }
  const before = await page.textContent('.qcs .qc-simtab');
  await page.click('.qcs .qc-new'); await page.waitForTimeout(300);
  check((await page.inputValue('.qcs .qc-seed')) === '2' && (await page.textContent('.qcs .qc-simtab')) !== before, 'queue: new seed runs again');
  await page.selectOption('.qcs .qc-tk', 'asa'); await page.fill('.qcs .qc-t', '12'); await page.waitForTimeout(400);
  check((await page.textContent('.qcs .qc-sbig')) === '8 servers keep the average wait within 12 s' && await page.isHidden('.qcs .qc-pw'), 'queue: average-wait target');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.qcs .qc-scsv')]); const f = OUT + 'staff.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0].startsWith('servers,utilisation %') && rows.some((r) => r.startsWith('8,62.5')), 'queue: staffing CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.qcs .qc-pcsv')]); const f = OUT + 'pn.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'n in system,formula probability,simulated share of time' && rows.length > 10, 'queue: number-in-system CSV'); }
  await page.fill('.qcs .qc-c', '4'); await page.waitForTimeout(400);
  check((await big()) === 'The queue grows without limit' && (await page.textContent('.qcs .qc-note')).includes('At least 6 servers') && await page.isHidden('.qcs .qc-simc'), 'queue: unstable queue message');
  await page.fill('.qcs .qc-c', '6');
  await page.selectOption('.qcs .qc-k', 'mm1'); await page.fill('.qcs .qc-l', '8'); await page.selectOption('.qcs .qc-lu', '60'); await page.fill('.qcs .qc-s', '0.1'); await page.waitForTimeout(400);
  check((await big()) === 'Average wait in the queue Wq = 0.4000 minutes' && (await facts()).includes('In the system L4'), 'queue: M/M/1 8 per minute, 0.1 min service');
  await page.selectOption('.qcs .qc-k', 'mg1'); await page.fill('.qcs .qc-sd', '0'); await page.waitForTimeout(400);
  check((await big()) === 'Average wait in the queue Wq = 0.2000 minutes' && await page.isHidden('.qcs .qc-staff'), 'queue: M/D/1 halves the wait');
  await page.selectOption('.qcs .qc-k', 'mmck'); await page.fill('.qcs .qc-l', '5'); await page.selectOption('.qcs .qc-lu', '60'); await page.fill('.qcs .qc-s', '0.5'); await page.fill('.qcs .qc-c', '2'); await page.fill('.qcs .qc-K', '5'); await page.waitForTimeout(400);
  check((await facts()).includes('Turned away28.37 %') && (await page.textContent('.qcs .qc-simtab')).includes('Turned away'), 'queue: M/M/c/K blocking 28.37 %');
  await page.fill('.qcs .qc-K', '1'); await page.waitForTimeout(400);
  check((await page.textContent('.qcs .qc-err')).includes('at least the number of servers'), 'queue: K below c message');
  await page.selectOption('.qcs .qc-k', 'erlangb'); await page.fill('.qcs .qc-l', '10'); await page.fill('.qcs .qc-s', '1'); await page.fill('.qcs .qc-c', '12'); await page.waitForTimeout(400);
  check((await big()) === '11.97 % of arrivals are lost' && (await page.textContent('.qcs .qc-sbig')) === '18 servers lose at most 1 %', 'queue: Erlang B and lines for 1 %');
  await page.selectOption('.qcs .qc-k', 'mminf'); await page.fill('.qcs .qc-l', '3'); await page.fill('.qcs .qc-s', '2'); await page.waitForTimeout(400);
  check((await big()) === 'On average 6 in the system, nobody waits', 'queue: M/M/∞');
  await page.fill('.qcs .qc-l', 'abc'); await page.waitForTimeout(400);
  check((await page.textContent('.qcs .qc-err')).includes('arrival rate') && await page.isHidden('.qcs .qc-out'), 'queue: bad input message');
  await page.fill('.qcs .qc-l', '3'); await page.selectOption('.qcs .qc-k', 'mmc'); await page.fill('.qcs .qc-l', '100'); await page.selectOption('.qcs .qc-lu', '3600'); await page.fill('.qcs .qc-s', '3'); await page.fill('.qcs .qc-c', '6'); await page.waitForTimeout(400);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.qcs .dl [data-f=docx]')]); check((await d.suggestedFilename()).endsWith('.docx'), 'queue: Word report'); }
};
