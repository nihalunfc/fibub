// #985 volcano plot and PCA
export const path = '/science/metabolite-volcano-pca/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.mvp ';
  const t = (s) => page.textContent(R + s);
  const pick = async (sel, v) => { await page.selectOption(R + sel, v); await page.waitForTimeout(450); };
  const set = async (sel, v) => { await page.fill(R + sel, v); await page.waitForTimeout(450); };
  await page.goto(`${BASE}/science/metabolite-volcano-pca/`); await page.waitForTimeout(700);
  check((await t('.mv-big')) === '4 up, 1 down of 12 metabolites', 'volcano: example 4 up, 1 down (SciPy Welch + BH)');
  { const f = await t('.mv-facts'); check(f.includes('Treated vs Ctrl') && f.includes('8.3 × 10⁻⁵') && f.includes('6 metabolites have raw p < 0.05') && f.includes('1 filled'), 'volcano: facts (lowest q, raw p count, missing filled)'); }
  { const rows = await page.$$eval(R + '.mv-tab tbody tr', (r) => r.map((x) => [...x.cells].map((c) => c.textContent).join('|'))); check(rows[0].startsWith('Hypoxanthine|41.25|86.65|2.10×') && rows[0].endsWith('▲ up') && rows.some((r) => r.startsWith('Glutamine') && r.endsWith('▼ down')) && rows.some((r) => r.startsWith('Citrate') && r.endsWith('|')), 'volcano: table sorted by p, up/down marks, citrate not called'); }
  check((await t('.mv-psum')).includes('PC1 explains 55.3 %') && (await t('.mv-psum')).includes('PC2 15.7 %') && (await t('.mv-psum')).includes('PC3 10 %'), 'PCA: explained variance (NumPy SVD)');
  check(await page.isVisible(R + '.mv-vol') && await page.isVisible(R + '.mv-pca') && (await page.$$eval(R + '.mv-ltab tbody tr', (r) => r.length)) === 10, 'PCA: charts and 10 top loadings');
  await pick('.mv-by', 'p');
  check((await t('.mv-big')) === '4 up, 1 down of 12 metabolites', 'volcano: raw p rule');
  await set('.mv-fc', '1');
  check((await t('.mv-big')) === '4 up, 2 down of 12 metabolites', 'volcano: no fold change threshold calls citrate too');
  await set('.mv-fc', '2'); await pick('.mv-by', 'q'); await set('.mv-alpha', '0.001');
  check((await t('.mv-big')) === '3 up, 0 down of 12 metabolites', 'volcano: q < 0.001');
  await set('.mv-alpha', '0.05');
  await pick('.mv-miss', 'drop');
  check((await t('.mv-big')).endsWith('of 11 metabolites') && (await t('.mv-facts')).includes('1 metabolite left out'), 'volcano: drop missing');
  await pick('.mv-miss', 'half-min'); await pick('.mv-tr', 'none');
  check((await t('.mv-big')).endsWith('of 12 metabolites'), 'volcano: no transform');
  await pick('.mv-tr', 'log2'); await pick('.mv-sc', 'pareto');
  check(!(await t('.mv-psum')).includes('PC1 explains 55.3 %'), 'PCA: Pareto scaling changes the variance split');
  await pick('.mv-sc', 'auto');
  await pick('.mv-gb', 'Ctrl'); await pick('.mv-ga', 'Treated');
  check((await t('.mv-big')) === '1 up, 4 down of 12 metabolites', 'volcano: groups swapped');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.mv-csv')]); const f = OUT + 'vr.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 13 && r[0].startsWith('metabolite,mean_Treated,mean_Ctrl,fold_change'), 'volcano: results CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.mv-pcsv')]); const f = OUT + 'ps.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 9 && r[0] === 'sample,group,PC1,PC2,PC3' && r[1].startsWith('Ctrl_1,Ctrl,-2.0791985'), 'PCA: scores CSV (NumPy PC1 −2.0792)'); }
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl button[data-f=${fmt}]`)]); check(d.suggestedFilename() === `volcano-pca.${fmt}`, `volcano: ${fmt} download`); }
  // A file with a Group row, samples in rows.
  writeFileSync(OUT + 'met.csv', 'Sample,Group,M1,M2,M3\nS1,WT,10,20,5\nS2,WT,11,19,6\nS3,WT,9,21,5.5\nS4,KO,30,20,5\nS5,KO,33,18,6\nS6,KO,29,22,5.2\n');
  await pick('.mv-lay', 'cols');
  await page.setInputFiles(R + '.dfb-in', OUT + 'met.csv'); await page.waitForTimeout(900);
  check((await t('.mv-big')).endsWith('of 3 metabolites') && (await t('.mv-facts')).includes('KO vs WT'), 'volcano: samples-in-rows CSV with a Group column');
  await pick('.mv-lay', 'rows'); await set('.mv-data', 'M\tA_1\tA_2\nx\t1\t2');
  check((await t('.mv-err')).includes('one group'), 'volcano: one group message');
  await set('.mv-data', 'M\tA_1\tB_1\tB_2\nx\t1\t2\t3');
  check((await t('.mv-err')).includes('at least two samples'), 'volcano: group too small message');
  await set('.mv-data', 'M\tA_1\tA_2\tB_1\tB_2\nx\t1\toops\t2\t3');
  check((await t('.mv-err')).includes('not a number') && await page.isHidden(R + '.mv-out'), 'volcano: bad cell message');
  await set('.mv-data', 'M\tA_1\tA_2\tB_1\tB_2\nx\t0\t1\t2\t3');
  check((await t('.mv-err')).includes('above 0'), 'volcano: zero with log message');
};
