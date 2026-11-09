// #570 confusion matrix and metrics calculator
export const path = '/science/confusion-matrix/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const T = (s) => page.textContent('.cfm ' + s);
  await page.goto(`${BASE}/science/confusion-matrix/`); await page.waitForTimeout(600);
  check((await T('.cfm-big')) === 'Accuracy 86.0 % (95 % CI 77.9 to 91.5 %)', 'confusion: four-count example accuracy and Wilson CI');
  { const t = await T('.cfm-facts'); check(t.includes("Cohen's kappa0.720 (95 % CI 0.584 to 0.856)") && t.includes('Matthews correlation (MCC)0.721') && t.includes('Balanced accuracy86.0 %'), `confusion: kappa, MCC, balanced accuracy (${t})`); }
  { const t = await T('.cfm-bin'); check(t.includes('Sensitivity (recall, true positive rate)84.0 %71.5–91.7 %') && t.includes('Specificity (true negative rate)88.0 %76.2–94.4 %') && t.includes('Negative predictive value84.6 %') && t.includes('Positive likelihood ratio7.000') && await page.isHidden('.cfm .cfm-pos-w'), 'confusion: two-class measures'); }
  { const t = await T('.cfm-cls'); check(t.includes('Disease5048') && t.includes('Healthy5052'), 'confusion: per-class table'); }
  await page.fill('.cfm .cfm-fp', '-1'); await page.waitForTimeout(400);
  check((await T('.cfm-err')) === 'FP must be a whole number, 0 or more.' && await page.isHidden('.cfm .cfm-out'), 'confusion: bad count message');
  await page.fill('.cfm .cfm-fp', '0'); await page.fill('.cfm .cfm-tn', '0'); await page.waitForTimeout(400);
  check((await T('.cfm-bin')).includes('Specificity (true negative rate)0.0 %–'), 'confusion: no negatives: specificity 0 with no interval');
  await page.fill('.cfm .cfm-fp', '6'); await page.fill('.cfm .cfm-tn', '44');
  await page.selectOption('.cfm .cfm-mode', 'matrix'); await page.waitForTimeout(300);
  check((await T('.cfm-big')) === 'Accuracy 80.0 % (95 % CI 72.3 to 86.0 %)' && await page.isHidden('.cfm .cfm-bin-card'), 'confusion: 3-class matrix example');
  { const t = await T('.cfm-avg'); check(t.includes('Macro0.7970.8040.800') && t.includes('Weighted0.8000.8000.799') && t.includes('Micro0.8000.8000.800'), `confusion: averages (${t})`); }
  { const t = await T('.cfm-cls'); check(t.includes('dog5047') && t.includes('0.740 (0.604 to 0.841)'), 'confusion: dog recall and CI'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cfm .cfm-csv')]); const f = OUT + 'cm.csv'; await d.saveAs(f); const s = readFileSync(f, 'utf8');
    check(s.startsWith('class,actual,predicted,tp') && s.includes('\ncat,50,51,42,9,8,') && s.includes('macro average,130') && s.includes('0.8,0.72307855') && s.includes('\ndog,8,37,5'), 'confusion: metrics CSV with the matrix'); }
  for (const ff of ['pdf', 'docx', 'png']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.cfm .dl [data-f=${ff}]`)]); const f = OUT + 'cm.' + ff; await d.saveAs(f); check(readFileSync(f).length > 3000, `confusion: ${ff} report`); }
  await page.fill('.cfm .cfm-mx', '5,1\n2'); await page.waitForTimeout(400);
  check((await T('.cfm-err')).includes('must be square'), 'confusion: ragged matrix message');
  await page.fill('.cfm .cfm-mx', '5\t1\n2\t7'); await page.waitForTimeout(400);
  check((await T('.cfm-cls')).includes('Class 1') && await page.isVisible('.cfm .cfm-pos-w'), 'confusion: matrix without names, positive class choice shown');
  await page.selectOption('.cfm .cfm-mode', 'pairs'); await page.waitForTimeout(300);
  check((await T('.cfm-big')).startsWith('Accuracy 80.0 %') && (await page.inputValue('.cfm .cfm-pos')) === 'spam' && (await T('.cfm-bin')).includes('(positive: spam)7, 2, 2, 9') && (await T('.cfm-note')).startsWith('20 rows used.'), 'confusion: spam/ham pairs, spam guessed as positive');
  await page.selectOption('.cfm .cfm-pos', 'ham'); await page.waitForTimeout(200);
  check((await T('.cfm-bin')).includes('(positive: ham)9, 2, 2, 7'), 'confusion: switch positive class');
  // A file with a third column, swapped order and a gap.
  writeFileSync(OUT + 'preds.csv', 'id,y_pred,y_true\n1,a,a\n2,b,a\n3,c,c\n4,,b\n5,b,b\n6,a,a\n7,c,b\n');
  await page.setInputFiles('.cfm .dfb-in', OUT + 'preds.csv'); await page.waitForTimeout(800);
  check((await page.inputValue('.cfm .cfm-ca')) === 'y_true' && (await page.inputValue('.cfm .cfm-cp')) === 'y_pred' && (await T('.cfm-note')).startsWith('6 rows used; 1 with a missing class left out.') && (await T('.cfm-big')).startsWith('Accuracy 66.7 %'), 'confusion: file columns guessed, gap left out');
  await page.selectOption('.cfm .cfm-cp', 'y_true'); await page.waitForTimeout(300);
  check((await T('.cfm-err')).includes('two different columns'), 'confusion: same column message');
  await page.selectOption('.cfm .cfm-ca', 'id'); await page.waitForTimeout(300);
  check((await T('.cfm-big')).startsWith('Accuracy 0.0 %') && (await T('.cfm-cls')).includes('Class') , 'confusion: other columns can be chosen');
  await page.setViewportSize({ width: 375, height: 800 }); await page.selectOption('.cfm .cfm-mode', 'matrix'); await page.fill('.cfm .cfm-mx', ',cat,dog,rabbit\ncat,42,6,2\ndog,8,37,5\nrabbit,1,4,25'); await page.waitForTimeout(400);
  await page.screenshot({ path: OUT + 'confusion-375.png', fullPage: true });
  await page.setViewportSize({ width: 1280, height: 800 });
};
