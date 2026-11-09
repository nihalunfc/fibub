// #583 transportation and assignment problem solver
export const path = '/science/transportation-assignment/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/transportation-assignment/`); await page.waitForTimeout(700);
  const big = () => page.textContent('.trx .tr-big'), facts = () => page.textContent('.trx .tr-facts');
  check((await big()) === 'Lowest total cost: 1780', 'transport: example optimum 1780 (scipy)');
  check((await facts()).includes("Starting plan (Vogel's approximation)cost 1780") && (await facts()).includes('Improvement steps0'), 'transport: Vogel start already optimal');
  { const t = await page.textContent('.trx .tr-plan'); check(t.includes('W4') && t.includes('Supply') && (await page.$$('.trx .tr-plan td.on')).length === 6, 'transport: plan table with six used routes'); }
  await page.selectOption('.trx .tr-meth', 'nw'); await page.waitForTimeout(200);
  check((await facts()).includes('cost 2145') && (await facts()).includes('Improvement steps2') && (await big()) === 'Lowest total cost: 1780', 'transport: northwest corner 2145, two MODI steps, same optimum');
  check((await page.$$('.trx .tr-steps tr')).length === 3 && (await page.textContent('.trx .tr-steps')).includes('Total cost after'), 'transport: steps table');
  await page.selectOption('.trx .tr-meth', 'least'); await page.waitForTimeout(200);
  check((await facts()).includes('cost 1820') && (await facts()).includes('Improvement steps1'), 'transport: least cost 1820, one step');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.trx .tr-csv')]); const f = OUT + 'plan.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r[0] === 'from,to,units,cost_per_unit,cost' && r.includes('F1,W4,35,9,315') && r[r.length - 1] === 'total,,140,,1780', 'transport: plan CSV'); }
  for (const x of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.trx .dl button[data-f=${x}]`)]); check(d.suggestedFilename() === `transportation-plan.${x}`, `transport: report download ${x}`); }
  // Unbalanced: F3 supply 60.
  await page.fill('.trx .tr-tin', 'F1,12,18,25,9,40\nF2,22,14,16,28,55\nF3,15,27,11,19,60\nDemand,30,35,40,35'); await page.waitForTimeout(600);
  check((await big()) === 'Lowest total cost: 1705' && (await facts()).includes('15 units of supply left unused') && (await page.textContent('.trx .tr-plan')).includes('Dummy'), 'transport: unbalanced with a dummy destination (scipy 1705)');
  await page.fill('.trx .tr-tin', '1 x 10\nx 1 0\n5 5'); await page.waitForTimeout(600);
  check((await page.textContent('.trx .tr-warn')).includes('marked x') && await page.isVisible('.trx .tr-warn'), 'transport: unavoidable forbidden route warned');
  await page.fill('.trx .tr-tin', '4 6 10\n5 3 10\n10 10'); await page.selectOption('.trx .tr-goal', 'max'); await page.waitForTimeout(600);
  check((await big()) === 'Highest total profit: 110' && (await page.textContent('.trx .tr-plan')).includes('profit 6'), 'transport: maximise profit 110');
  await page.selectOption('.trx .tr-goal', 'min');
  await page.fill('.trx .tr-tin', '1 2 5\n3 abc 5\n5 5'); await page.waitForTimeout(600);
  check((await page.textContent('.trx .tr-err')).includes('Row 2, column 2: "abc"') && await page.isHidden('.trx .tr-out'), 'transport: bad cost message');
  await page.fill('.trx .tr-tin', '1 2 5\n3 4\n5 5'); await page.waitForTimeout(600);
  check((await page.textContent('.trx .tr-err')).includes('Row 2 has 2 values'), 'transport: short row message');
  // Assignment.
  await page.click('.trx .tr-kind button[data-k=a]'); await page.waitForTimeout(400);
  check((await big()) === 'Lowest total: 38' && (await page.textContent('.trx .tr-pnote')).includes('Asha → Job 3, Ben → Job 2, Chen → Job 1, Dara → Job 4') && await page.isHidden('.trx .tr-ml') && await page.isHidden('.trx .tr-steps-wrap'), 'assignment: example minimum 38 (scipy)');
  await page.selectOption('.trx .tr-goal', 'max'); await page.waitForTimeout(200);
  check((await big()) === 'Highest total: 82', 'assignment: maximum 82 (scipy)');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.trx .tr-csv')]); const f = OUT + 'assign.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r[0] === 'row,column,profit' && r.length === 6 && r[5] === 'total,,82', 'assignment: CSV'); }
  await page.selectOption('.trx .tr-goal', 'min');
  writeFileSync(OUT + 'assign.csv', 'Who,A,B,C\nP,4,1,3\nQ,2,0,5\n');
  await page.setInputFiles('.trx .tr-a .dfb-in', OUT + 'assign.csv'); await page.waitForTimeout(700);
  check((await big()) === 'Lowest total: 3' && (await facts()).includes('Columns left unused1'), 'assignment: rectangular table from a file');
  await page.fill('.trx .tr-ain', '1 2\n3'); await page.waitForTimeout(600);
  check((await page.textContent('.trx .tr-err')).includes('every row needs 2'), 'assignment: ragged table message');
  await page.click('.trx .tr-ex'); await page.waitForTimeout(400);
  check((await big()) === 'Lowest total: 38', 'assignment: example button');
  await page.click('.trx .tr-kind button[data-k=t]'); await page.click('.trx .tr-ex'); await page.waitForTimeout(400);
  await page.setViewportSize({ width: 375, height: 800 }); await page.waitForTimeout(300);
  await page.locator('.trx .tr-plan').scrollIntoViewIfNeeded(); await page.screenshot({ path: OUT + 'transport-375.png' });
  await page.setViewportSize({ width: 1280, height: 800 });
};
