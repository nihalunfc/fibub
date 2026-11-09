// #469 meta-analysis: forest and funnel plots.
export const path = '/science/meta-analysis/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/meta-analysis/`); await page.waitForTimeout(700);
  const txt = (s) => page.textContent(`.ma ${s}`);
  const settle = () => page.waitForTimeout(450);
  const kind = async (k) => { await page.locator(`.ma .ma-kind button[data-k="${k}"]`).scrollIntoViewIfNeeded(); await page.click(`.ma .ma-kind button[data-k="${k}"]`); await settle(); };
  check((await page.textContent('.ma')).includes('For study and teaching, not medical advice. Check with a qualified professional.'), 'meta: medical notice near the top');
  check((await txt('.ma-big')) === 'Random effects: Odds ratio 0.648 (95 % CI 0.446 to 0.940), p = 0.022', `meta: example random-effects OR (${await txt('.ma-big')})`);
  { const f = await txt('.ma-facts'); check(f.includes('Studies8') && f.includes('0.654 (0.497 to 0.860)') && f.includes('10.991 (7 df), p = 0.139') && f.includes('I²36.3 %') && f.includes('0.097 (log scale)') && f.includes('0.265 to 1.580') && f.includes('intercept −0.691, p = 0.586'), `meta: facts as statsmodels (${f})`); }
  check((await txt('.ma-skip')).includes('0.5 added to each cell for Trial E'), 'meta: zero-cell note');
  check(await page.isVisible('.ma .ma-forest') && await page.isVisible('.ma .ma-funnel'), 'meta: forest and funnel plots drawn');
  { const rows = await page.$$eval('.ma .ma-tab tbody tr', (t) => t.map((tr) => [...tr.cells].map((c) => c.textContent))); check(rows.length === 10 && rows[9][1] === '0.648' && rows[8][1] === '0.654', 'meta: studies table with pooled rows'); }
  // Fixed effect, REML, PM, level.
  await page.selectOption('.ma .ma-model', 'fixed'); await settle();
  check((await txt('.ma-big')).startsWith('Fixed effect: Odds ratio 0.654 (95 % CI 0.497 to 0.860)'), 'meta: fixed effect main result');
  await page.selectOption('.ma .ma-model', 'random');
  await page.selectOption('.ma .ma-tau', 'REML'); await settle();
  check((await txt('.ma-big')).includes('0.653') && (await txt('.ma-facts')).includes('tau² (REML)0.006'), 'meta: REML (scipy root 0.00611)');
  await page.selectOption('.ma .ma-tau', 'PM'); await settle();
  check((await txt('.ma-facts')).includes('tau² (Paule-Mandel)0.180') && (await txt('.ma-big')).includes('0.644'), 'meta: Paule-Mandel (statsmodels iterated 0.1801)');
  await page.selectOption('.ma .ma-tau', 'DL');
  await page.selectOption('.ma .ma-lvl', '0.9'); await settle();
  check((await txt('.ma-big')).includes('90 % CI') && (await txt('.ma-facts')).includes('90 % prediction interval'), 'meta: 90 % level');
  await page.selectOption('.ma .ma-lvl', '0.95');
  // Risk ratio and risk difference.
  await page.selectOption('.ma .ma-mbin', 'RR'); await settle();
  check((await txt('.ma-big')).startsWith('Random effects: Risk ratio 0.687 (95 % CI 0.499 to 0.946)'), 'meta: risk ratio');
  await page.selectOption('.ma .ma-mbin', 'RD'); await settle();
  check((await txt('.ma-big')).startsWith('Random effects: Risk difference −0.052 (95 % CI −0.093 to −0.010)') && !(await txt('.ma-facts')).includes('log scale'), 'meta: risk difference');
  // CSV.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ma .ma-csv')]); const f = OUT + 'meta.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows.length === 11 && rows[0] === 'study,effect,se,lower,upper,weight_fixed,weight_random' && rows[10].startsWith('Random effects (DerSimonian-Laird),-0.0516711962'), 'meta: CSV of studies and pooled rows'); }
  await page.selectOption('.ma .ma-mbin', 'OR'); await settle();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ma .ma-csv')]); const f = OUT + 'meta2.csv'; await d.saveAs(f); check(readFileSync(f, 'utf8').split('\n')[0].includes('log_effect') && readFileSync(f, 'utf8').includes('ratio_lower'), 'meta: ratio CSV has log and ratio columns'); }
  // Reports.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ma .dl button[data-f="png"]')]); check(d.suggestedFilename() === 'meta-analysis.png', 'meta: PNG report'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ma .dl button[data-f="pdf"]')]); const f = OUT + 'ma.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'meta: PDF report'); }
  // Means.
  await kind('continuous');
  check((await txt('.ma-big')).startsWith('Random effects: Mean difference −0.897 (95 % CI −1.236 to −0.559)'), `meta: mean difference (${await txt('.ma-big')})`);
  await page.selectOption('.ma .ma-mcont', 'SMD'); await settle();
  check((await txt('.ma-big')).includes("Hedges' g −0.447 (95 % CI −0.622 to −0.271)") && (await txt('.ma-facts')).includes('I²0.0 %'), "meta: Hedges' g (statsmodels effectsize_smd)");
  // Effect + SE.
  await kind('generic');
  { const f = await txt('.ma-facts'); check((await txt('.ma-big')).startsWith('Random effects: Effect 0.246 (95 % CI 0.111 to 0.382), p < 0.001') && f.includes('I²51.1 %') && f.includes('intercept 3.639, p = 0.001') && (await txt('.ma-egg')).includes('lopsided: small studies'), 'meta: effect and SE with Egger flag'); }
  // Effect + CI, ratio.
  await kind('ci');
  check((await txt('.ma-big')).startsWith('Random effects: Hazard ratio 0.826 (95 % CI 0.705 to 0.967), p = 0.017'), `meta: hazard ratios from CIs (${await txt('.ma-big')})`);
  await page.uncheck('.ma .ma-log'); await settle();
  check(!(await txt('.ma-big')).includes('0.826') && !(await txt('.ma-facts')).includes('log scale'), 'meta: CI on the plain scale');
  await page.check('.ma .ma-log');
  // A file into the CI panel.
  writeFileSync(OUT + 'or.csv', 'study,or,lo,hi\nA,0.5,0.3,0.83\nB,0.7,0.5,0.98\nC,1.1,0.7,1.73\n');
  await page.setInputFiles('.ma .ma-p[data-k="ci"] .dfb-in', OUT + 'or.csv'); await page.waitForTimeout(800);
  check((await txt('.ma-facts')).includes('Studies3'), 'meta: studies from a CSV file');
  // Bad input.
  await page.fill('.ma .ma-in-ci', 'A\t0.5\t0.3\t0.8'); await settle();
  check((await txt('.ma-err')).includes('needs at least two') && await page.isHidden('.ma .ma-out'), 'meta: one study message');
  await page.fill('.ma .ma-in-ci', 'A\t0.5\t0.3\t0.8\nB\t0.7\t0.9\t0.6\nC\t0.8\t0.6\t1.1'); await settle();
  check((await txt('.ma-skip')).includes('upper limit must be above') && await page.isVisible('.ma .ma-forest'), 'meta: bad interval row left out with a note');
  await kind('binary');
  await page.fill('.ma .ma-in-binary', 'X\t0\t20\t0\t22\nY\t3\t30\t5\t30\nZ\t2\t25\t6\t24\nW\t40\t30\t1\t20'); await settle();
  { const s = await txt('.ma-skip'); check(s.includes('Left out X: no events in either group') && s.includes('whole numbers from 0 to the group size'), `meta: double-zero and impossible rows (${s})`); }
  await page.fill('.ma .ma-in-binary', ''); await settle();
  check((await txt('.ma-err')).startsWith('Paste your studies first'), 'meta: empty message');
};
