// #561 Regression workbench
export const path = '/science/regression-workbench/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const vp0 = page.viewportSize();
  const big = () => page.textContent('.rw .rw-big');
  const err = () => page.textContent('.rw .rw-err');
  const wait = (ms = 450) => page.waitForTimeout(ms);
  const csvOf = async (sel, name) => { const [dl] = await Promise.all([page.waitForEvent('download'), page.click(sel)]); const f = OUT + name; await dl.saveAs(f); return readFileSync(f, 'utf8').trim().split('\n'); };
  await page.goto(`${BASE}${path}`); await wait(700);

  // Example 1: multiple regression with a text column.
  check((await big()) === 'R² = 0.8555, adjusted R² = 0.8278 (n = 32)', `regression: plant example fit (${await big()})`);
  check((await page.textContent('.rw .rw-eq')).startsWith('height_cm = 9.8 + 1.833 × fertiliser_g') && (await page.textContent('.rw .rw-notes')).includes('compared with clay'), 'regression: equation and group note');
  { const t = await page.textContent('.rw .rw-coef'); check(t.includes('1.8328') && t.includes('1.21 × 10⁻⁸') && t.includes('soil[loam]') && t.includes('0.154') && t.includes('VIF'), 'regression: coefficient table with p-values and VIF'); }
  check((await page.textContent('.rw .rw-facts')).includes('F(5, 26) = 30.79, p = 3.89 × 10⁻¹⁰'), 'regression: F test');
  check(await page.isVisible('.rw .rw-fit') && await page.isVisible('.rw .rw-rvf') && await page.isVisible('.rw .rw-qq') && await page.isVisible('.rw .rw-lev') && await page.isVisible('.rw .rw-cook'), 'regression: five diagnostic plots');
  check((await page.textContent('.rw .rw-inf')).includes('21') && (await page.textContent('.rw .rw-inf-help')).includes("Cook's distance above 4/n"), 'regression: rows to look at');
  await page.setViewportSize({ width: 375, height: 900 }); await wait(); await page.screenshot({ path: OUT + 'regression-workbench-375.png', fullPage: true }); await page.setViewportSize(vp0);
  // Prediction.
  await page.fill('.rw .rw-pred-in [data-src="fertiliser_g"]', '5'); await page.fill('.rw .rw-pred-in [data-src="water_ml"]', '250'); await page.fill('.rw .rw-pred-in [data-src="light_h"]', '8'); await page.selectOption('.rw .rw-pred-in [data-src="soil"]', 'loam'); await wait();
  check((await page.textContent('.rw .rw-pred-out')) === 'height_cm ≈ 40.94' && (await page.textContent('.rw .rw-pred-help')).includes('prediction interval for one new value: 34.432 to 47.449'), `regression: prediction with intervals (${await page.textContent('.rw .rw-pred-help')})`);
  await page.fill('.rw .rw-pred-in [data-src="light_h"]', '30'); await wait();
  check((await page.textContent('.rw .rw-pred-help')).includes('outside the range'), 'regression: warns when predicting outside the data');
  await page.fill('.rw .rw-pred-in [data-src="light_h"]', 'abc'); await wait();
  check((await page.textContent('.rw .rw-pred-help')).includes('must be a number'), 'regression: bad prediction value');
  // CSVs.
  { const r = await csvOf('.rw .rw-ccsv', 'rw-coef.csv'); check(r[0] === 'term,estimate,se,t,p,ci_low,ci_high,vif' && r.length === 7 && r[2].startsWith('fertiliser_g,1.83'), 'regression: coefficients CSV'); }
  { const r = await csvOf('.rw .rw-rcsv', 'rw-res.csv'); check(r[0].startsWith('row,observed,fitted,residual') && r.length === 33, 'regression: residuals CSV'); }
  // Confidence level and dropping a predictor.
  await page.selectOption('.rw .rw-conf', '0.9'); await wait();
  check((await page.textContent('.rw .rw-coef thead')).includes('90 % CI low'), 'regression: 90 % intervals');
  await page.uncheck('.rw .rw-xs input[value="soil"]'); await wait();
  check((await big()) === 'R² = 0.7927, adjusted R² = 0.7705 (n = 32)' && !(await page.textContent('.rw .rw-coef')).includes('soil'), `regression: predictor left out (${await big()})`);
  await page.uncheck('.rw .rw-int'); await wait();
  check(!(await page.textContent('.rw .rw-coef')).includes('Intercept') && (await page.textContent('.rw .rw-facts')).includes('measured from zero'), 'regression: no intercept');
  await page.check('.rw .rw-int'); await page.selectOption('.rw .rw-conf', '0.95');

  // Example 2: polynomial.
  await page.selectOption('.rw .rw-ex', 'stop'); await wait();
  check((await big()) === 'R² = 0.9935, adjusted R² = 0.9928 (n = 22)' && (await page.textContent('.rw .rw-coef')).includes('speed_kmh^2'), `regression: polynomial example (${await big()})`);
  await page.fill('.rw .rw-pred-in [data-src="speed_kmh"]', '90'); await wait();
  check((await page.textContent('.rw .rw-pred-out')) === 'distance_m ≈ 70.688', `regression: polynomial prediction (${await page.textContent('.rw .rw-pred-out')})`);
  await page.selectOption('.rw .rw-deg', '3'); await wait();
  check((await page.textContent('.rw .rw-coef')).includes('speed_kmh^3'), 'regression: degree 3');
  await page.selectOption('.rw .rw-kind', 'linear'); await wait();
  check((await big()).startsWith('R² = 0.9') && !(await page.textContent('.rw .rw-coef')).includes('^2'), 'regression: straight line on the same data');

  // Example 3: logistic.
  await page.selectOption('.rw .rw-ex', 'exam'); await wait();
  check((await big()) === 'McFadden R² = 0.6055, 87.5 % classified right (n = 40)', `regression: logistic example (${await big()})`);
  { const t = await page.textContent('.rw .rw-coef'); check(t.includes('Odds ratio') && t.includes('2.111') && t.includes('0.00116'), 'regression: odds ratios and z tests'); }
  check((await page.textContent('.rw .rw-facts')).includes('χ²(2) = 33.33') && (await page.textContent('.rw .rw-notes')).includes('“1” counts as 1'), 'regression: likelihood-ratio test and response coding');
  check(await page.isHidden('.rw .rw-qq') && await page.isVisible('.rw .rw-fit'), 'regression: logistic plots (no Q-Q)');
  await page.fill('.rw .rw-pred-in [data-src="hours_studied"]', '6'); await page.fill('.rw .rw-pred-in [data-src="practice_tests"]', '2'); await wait();
  check((await page.textContent('.rw .rw-pred-out')) === 'P(passed = 1) ≈ 0.4314' && (await page.textContent('.rw .rw-pred-help')).includes('0.1969 to 0.7013'), 'regression: logistic prediction');
  { const r = await csvOf('.rw .rw-rcsv', 'rw-logit.csv'); check(r[0].startsWith('row,observed,probability') && r.length === 41, 'regression: logistic residuals CSV'); }
  await page.uncheck('.rw .rw-xs input[value="practice_tests"]'); await wait();
  check((await page.textContent('.rw .rw-fit')) !== null && await page.isVisible('.rw .rw-fit'), 'regression: one-predictor logistic curve');

  // Downloads.
  for (const f of ['png', 'pdf', 'docx']) { const [dl] = await Promise.all([page.waitForEvent('download'), page.click(`.rw .dl button[data-f="${f}"]`)]); check(dl.suggestedFilename() === `regression.${f}`, `regression: ${f} download`); }

  // Own data: missing values, text response with logistic, separation, and errors.
  await page.selectOption('.rw .rw-kind', 'linear');
  await page.fill('.rw .rw-data', 'y,x,g\n1,2,a\n2,,b\n3,4,NA\n4,5,a\n5,7,b\n6,8,a\n7,9,b\n8,11,a'); await wait(700);
  check((await page.inputValue('.rw .rw-ex')) === '' && (await page.textContent('.rw .rw-notes')).includes('2 rows with an empty or missing value left out'), 'regression: own data, missing rows counted');
  await page.selectOption('.rw .rw-kind', 'logistic'); await wait();
  check((await err()).includes('exactly two values'), 'regression: logistic needs a two-value response');
  await page.fill('.rw .rw-data', 'ok,dose\nno,1\nno,2\nno,3\nyes,4\nyes,5\nyes,6'); await wait(700);
  check((await page.textContent('.rw .rw-warn')).includes('separation'), 'regression: separation warning');
  await page.selectOption('.rw .rw-kind', 'linear'); await wait();
  check((await err()).includes('has text in it'), 'regression: text response refused for linear');
  await page.fill('.rw .rw-data', 'y,a,b\n1,1,2\n2,2,4\n4,3,6\n3,4,8\n5,5,10'); await wait(700);
  check((await err()).includes('copy or combination'), 'regression: collinear columns refused');
  await page.fill('.rw .rw-data', '1,2\n3,4'); await wait(700);
  check((await err()).length > 0 && await page.isHidden('.rw .rw-out'), 'regression: table without a header refused');
  // A file.
  writeFileSync(OUT + 'rw.csv', 'yield,temp,group\n10,20,A\n12,22,B\n15,25,A\n18,27,B\n19,30,A\n23,33,B\n25,35,A\n');
  await page.setInputFiles('.rw .dfb-in', OUT + 'rw.csv'); await wait(800);
  check((await big()).includes('(n = 7)') && (await page.textContent('.rw .dfb-note')).includes('Opened rw.csv'), `regression: data from a file (${await big()})`);
};
