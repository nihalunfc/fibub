// #569 small model trainer
export const path = '/science/small-model-trainer/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const T = (s) => page.textContent('.smt ' + s);
  const done = async () => { await page.waitForTimeout(450); await page.waitForFunction(() => document.querySelector('.smt .smt-status').textContent === '', null, { timeout: 20000 }); await page.waitForTimeout(100); };
  await page.goto(`${BASE}/science/small-model-trainer/`); await done();
  check((await T('.smt-big')) === 'Test accuracy 78.9 % (training 92.0 %)' && (await page.inputValue('.smt .smt-target')) === 'variety', 'trainer: decision tree on the example (worker), class column guessed');
  { const t = await T('.smt-facts'); check(t.includes('150 (112 train, 38 test)') && t.includes('Test macro F10.793'), 'trainer: rows and test scores'); }
  check((await T('.smt-tab')).startsWith('FeatureImportance') && (await T('.smt-tab')).includes('leaf_length_mm0.677') && await page.isVisible('.smt .smt-fig') && (await T('.smt-fig-h')) === 'Tree: 7 leaves, depth 3', 'trainer: tree drawing and feature importance');
  check((await T('.smt-note')).includes('soil turned into 0/1 columns') && (await T('.smt-note')).includes('overfitting'), 'trainer: notes on encoding and overfitting');
  { const cm = await page.$$eval('.smt .smt-cm tbody tr', (rs) => rs.map((r) => [...r.cells].map((c) => c.textContent))); check(cm.length === 3 && cm.reduce((s, r) => s + Number(r[1]) + Number(r[2]) + Number(r[3]), 0) === 38, 'trainer: test confusion matrix adds up to 38'); }
  await page.fill('.smt .smt-depth', '1'); await done();
  check((await T('.smt-fig-h')) === 'Tree: 2 leaves, depth 1', 'trainer: depth 1 gives a stump');
  await page.fill('.smt .smt-depth', '0'); await page.waitForTimeout(500);
  check((await T('.smt-err')).includes('maximum depth must be a whole number from 1 to 30') && await page.isHidden('.smt .smt-out'), 'trainer: bad depth message');
  await page.fill('.smt .smt-depth', '3'); await page.selectOption('.smt .smt-crit', 'entropy'); await done();
  check(/^Test accuracy [\d.]+ % \(training [\d.]+ %\)$/.test(await T('.smt-big')) && (await T('.smt-fig-note')).includes('entropy'), 'trainer: entropy split rule');
  await page.selectOption('.smt .smt-model', 'logistic'); await done();
  check((await T('.smt-big')) === 'Test accuracy 94.7 % (training 89.3 %)' && (await T('.smt-tab')).includes('leaf_length_mm−1.9210.44031.481') && await page.isHidden('.smt .smt-c-fig'), 'trainer: logistic regression weights per class');
  await page.fill('.smt .smt-c', '0.01'); await done();
  { const t = await T('.smt-tab'); check(!t.includes('−1.921') && (await T('.smt-tab-h')).startsWith('Weights'), 'trainer: smaller C shrinks the weights'); }
  await page.fill('.smt .smt-c', '0'); await page.waitForTimeout(500);
  check((await T('.smt-err')).includes('C must be above 0'), 'trainer: bad C message');
  await page.fill('.smt .smt-c', '1'); await page.selectOption('.smt .smt-model', 'knn'); await done();
  check((await T('.smt-big')) === 'Test accuracy 84.2 % (training 89.3 %)' && (await T('.smt-fig-h')) === 'Test accuracy against k' && await page.isHidden('.smt .smt-c-tab'), 'trainer: k-NN and the accuracy-against-k chart');
  const knn1 = await T('.smt-big');
  await page.selectOption('.smt .smt-weights', 'distance'); await page.selectOption('.smt .smt-metric', 'manhattan'); await done();
  check(/^Test accuracy/.test(await T('.smt-big')) && (await T('.smt-facts')).includes('112 train'), 'trainer: k-NN with Manhattan distance and distance weights');
  await page.click('.smt .smt-scale'); await done();
  check((await T('.smt-big')) !== knn1 && !(await T('.smt-note')).includes('scaled'), `trainer: k-NN without scaling changes the result (${await T('.smt-big')})`);
  await page.click('.smt .smt-scale'); await page.fill('.smt .smt-k', '500'); await page.waitForTimeout(600); await done();
  check((await T('.smt-err')).includes('k must be a whole number from 1 to 112'), 'trainer: k too large message');
  await page.fill('.smt .smt-k', '5');
  await page.selectOption('.smt .smt-model', 'kmeans'); await done();
  check((await T('.smt-big')) === '3 clusters: inertia 282.8, silhouette 0.419' && await page.isHidden('.smt .smt-target-w') && await page.isVisible('.smt .smt-fig2') && (await T('.smt-tab-h')) === 'Cluster centres (original units)', 'trainer: k-means with the elbow plot and centres');
  check(!(await T('.smt-tab')).includes('e−1'), 'trainer: no rounding noise in the centres');
  await page.selectOption('.smt .smt-py', '2'); await page.waitForTimeout(200);
  check((await page.getAttribute('.smt .smt-fig', 'aria-label')).includes('on leaf_length_mm and height_cm'), 'trainer: cluster plot axes');
  for (const box of await page.$$('.smt .smt-f')) if (/soil/.test(await box.getAttribute('value'))) await box.click();
  await done();
  check((await T('.smt-facts')).includes('Features3') && (await T('.smt-big')).startsWith('3 clusters'), 'trainer: k-means on number features only');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.smt .smt-csv')]); const f = OUT + 'clusters.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(d.suggestedFilename() === 'seedlings-clusters.csv' && rows.length === 151 && rows[0].endsWith(',cluster') && rows.slice(1).every((r) => /,[123]$/.test(r)), 'trainer: table with the cluster column'); }
  for (const ff of ['pdf', 'docx', 'png']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.smt .dl [data-f=${ff}]`)]); const f = OUT + 'm.' + ff; await d.saveAs(f); check(readFileSync(f).length > 5000, `trainer: ${ff} report`); }
  await page.fill('.smt .smt-clusters', '200'); await page.waitForTimeout(600); await done();
  check((await T('.smt-err')).includes('clusters must be from 1 to 30'), 'trainer: too many clusters message');
  await page.fill('.smt .smt-clusters', '3');
  await page.selectOption('.smt .smt-model', 'tree'); await done();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.smt .smt-csv')]); const f = OUT + 'pred.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0].endsWith(',split,predicted_variety') && rows.filter((r) => r.includes(',test,')).length === 38, 'trainer: predictions CSV with split column'); }
  for (const box of await page.$$('.smt .smt-f:checked')) await box.click();
  await done();
  check((await T('.smt-err')).includes('Tick at least one feature'), 'trainer: no features message');
  // A file: a gap, a constant class, then a usable class.
  writeFileSync(OUT + 'flowers.csv', 'x,y,g,one\n1,2,a,k\n2,1,a,k\n3,4,b,k\n4,3,b,k\n,5,a,k\n5,6,b,k\n6,5,a,k\n7,8,b,k\n8,7,a,k\n');
  await page.setInputFiles('.smt .dfb-in', OUT + 'flowers.csv'); await page.waitForTimeout(500); await done();
  await page.selectOption('.smt .smt-target', 'one'); await done();
  check((await T('.smt-err')).includes('has only one value'), 'trainer: one-class target message');
  await page.selectOption('.smt .smt-target', 'g'); await done();
  check((await T('.smt-note')).includes('1 row with a gap left out') && (await T('.smt-facts')).includes('8 (6 train, 2 test)'), `trainer: opened file, gap row left out (${await T('.smt-facts')})`);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.smt .smt-csv')]); check(d.suggestedFilename() === 'flowers-predictions.csv', 'trainer: download named after the file'); }
  await page.setViewportSize({ width: 375, height: 800 }); await page.goto(`${BASE}/science/small-model-trainer/`); await done();
  await page.screenshot({ path: OUT + 'trainer-375.png', fullPage: true });
  await page.setViewportSize({ width: 1280, height: 800 });
};
