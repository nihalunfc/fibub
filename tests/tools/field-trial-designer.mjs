// #385 field trial designer
export const path = '/science/field-trial-designer/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/field-trial-designer/`); await page.waitForTimeout(600);
  const r = '.ftd ';
  check((await page.textContent(r + '.fd-big')) === '20 plots: 5 treatments × 4 blocks', 'field trial: example RCBD on load');
  check((await page.textContent(r + '.fd-valid')).includes('Checked') && (await page.textContent(r + '.fd-valid')).includes('every block exactly once') && await page.isVisible(r + '.fd-fig'), 'field trial: layout checked and plot map drawn');
  { const t = await page.textContent(r + '.fd-tab'); check(t.startsWith('PlotBlockPositionTreatment11 1Variety A') || t.includes('111Variety A'), 'field trial: field book starts with plot 1 Variety A'); }
  check((await page.textContent(r + '.fd-df')).includes('Error12') && (await page.textContent(r + '.fd-df')).includes('Total19'), 'field trial: ANOVA outline df');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(r + '.fd-csv')]); const f = OUT + 'ftd.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows.length === 21 && rows[0] === 'plot,block,column,treatment' && rows[1] === '1,1,1,Variety A' && rows[2] === '2,1,2,Variety E' && rows[6] === '6,2,1,Variety D' && d.suggestedFilename() === 'rcbd-layout-seed-2026.csv', 'field trial: CSV matches the guide example'); }
  // Same seed again gives the same layout; a new seed changes it.
  const before = await page.textContent(r + '.fd-tab');
  await page.click(r + '.fd-new'); await page.waitForTimeout(150);
  const seed = await page.inputValue(r + '.fd-seed');
  check(seed !== '2026', `field trial: new random layout picks a new seed (${seed})`);
  await page.fill(r + '.fd-seed', '2026'); await page.waitForTimeout(400);
  check((await page.textContent(r + '.fd-tab')) === before, 'field trial: typing the seed back gives the same layout');
  // Latin square.
  await page.selectOption(r + '.fd-design', 'latin'); await page.waitForTimeout(150);
  check((await page.textContent(r + '.fd-big')) === '25 plots: 5 × 5 Latin square' && (await page.textContent(r + '.fd-valid')).includes('every row and every column') && await page.isHidden(r + '.fd-repl'), 'field trial: Latin square');
  check((await page.textContent(r + '.fd-df')).includes('Columns4') && (await page.textContent(r + '.fd-df')).includes('Error12'), 'field trial: Latin square df');
  // CRD with 4 plots per row and block numbering.
  await page.selectOption(r + '.fd-design', 'crd'); await page.fill(r + '.fd-reps', '3'); await page.fill(r + '.fd-cols', '4'); await page.waitForTimeout(400);
  check((await page.textContent(r + '.fd-big')) === '15 plots: 5 treatments × 3 replicates' && (await page.textContent(r + '.fd-valid')).includes('Each treatment has 3 plots') && (await page.textContent(r + '.fd-dfnote')).includes('Only 10 error'), 'field trial: CRD with a small-power warning');
  await page.selectOption(r + '.fd-num', 'block'); await page.check(r + '.fd-serp'); await page.waitForTimeout(150);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(r + '.fd-csv')]); const f = OUT + 'ftd2.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows[0] === 'plot,row,column,replicate,treatment' && rows[1].startsWith('101,1,1,') && rows.some((x) => x.startsWith('201,2,4,')) && rows.length === 16, 'field trial: CRD CSV with block numbering and serpentine rows'); }
  // RCBD with the PDF report.
  await page.selectOption(r + '.fd-design', 'rcbd'); await page.waitForTimeout(150);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(r + '.dl [data-f=pdf]')]); check(d.suggestedFilename().endsWith('.pdf'), 'field trial: PDF report'); }
  // Bad input.
  await page.fill(r + '.fd-trt', 'A\nA\nB'); await page.waitForTimeout(400);
  check((await page.textContent(r + '.fd-err')).includes('must be different') && await page.isHidden(r + '.fd-out'), 'field trial: duplicate treatment message');
  await page.fill(r + '.fd-trt', 'Only one'); await page.waitForTimeout(400);
  check((await page.textContent(r + '.fd-err')).includes('at least 2'), 'field trial: one treatment message');
  await page.fill(r + '.fd-trt', 'A\nB\nC'); await page.fill(r + '.fd-reps', '1'); await page.waitForTimeout(400);
  check((await page.textContent(r + '.fd-err')).includes('at least 2 blocks'), 'field trial: one block message');
  await page.click(r + '.fd-ex'); await page.waitForTimeout(150);
  check((await page.textContent(r + '.fd-big')) === '20 plots: 5 treatments × 4 blocks', 'field trial: example button restores');
};
