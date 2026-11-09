// #407 Allometric body mass estimator
export const path = '/science/body-mass-estimator/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/body-mass-estimator/`); await page.waitForTimeout(700);
  check((await page.textContent('.bme .bm-big')) === 'log₁₀ M = −2.8593 + 2.4384 log₁₀ X (n = 12, r² = 0.9928)', 'bodymass: example fit loads with the page');
  { const t = await page.textContent('.bme .bm-facts'); check(t.includes('0.0592') && t.includes('14.6 %') && t.includes('10.4 %') && t.includes('1.0078') && t.includes('1.0093'), 'bodymass: SEE, %SEE, %PE, smearing, QMLE'); }
  { const t = await page.textContent('.bme .bm-ftab'); check(t.includes('Fossil A160330238.5 to 449.4') && t.includes('Fossil B6536.6926.02 to 50.94') && t.includes('Fossil C41032732282 to 4622outside the reference range'), `bodymass: fossil estimates and 95 % PIs`); }
  check(await page.isVisible('.bme .bm-fig') && (await page.textContent('.bme .bm-rtab')).includes('Ref 1200572.6'), 'bodymass: plot and reference table');
  await page.selectOption('.bme .bm-cf', 'none'); await page.selectOption('.bme .bm-lv', '0.9'); await page.waitForTimeout(150);
  check((await page.textContent('.bme .bm-ftab')).includes('Fossil A160327.4253.1 to 423.6'), 'bodymass: no correction, 90 % interval (statsmodels values)');
  await page.selectOption('.bme .bm-cf', 'qmle'); await page.waitForTimeout(150);
  check((await page.textContent('.bme .bm-ftab')).includes('Fossil A160330.5'), 'bodymass: QMLE correction');
  { await page.locator('.bme .bm-csv').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click('.bme .bm-csv')]); const f = OUT + 'bm.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8');
    check(t.startsWith('name,x_mm,mass_kg,prediction_interval,note\nFossil A,160,330.5,253.1 to 423.6,') && t.includes('a,-2.85931304') && t.includes('correction_used,qmle,interval,0.9'), 'bodymass: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.bme .dl [data-f=png]')]); const f = OUT + 'bm.png'; await d.saveAs(f); check(readFileSync(f).subarray(1, 4).toString() === 'PNG', 'bodymass: image report'); }
  await page.fill('.bme .bm-fos', 'Tiny one 20'); await page.waitForTimeout(400);
  check((await page.textContent('.bme .bm-ftab')).includes('Tiny one20') && (await page.textContent('.bme .bm-fnote')).includes('extrapolations'), 'bodymass: fossil name with spaces, extrapolation note');
  await page.fill('.bme .bm-ref', 'A,10,5\nB,20,-1\nC,30'); await page.waitForTimeout(400);
  { const t = await page.textContent('.bme .bm-msg'); check(t.includes('values must be above zero') && t.includes('needs 2 numbers') && t.includes('at least 3 reference specimens') && await page.isHidden('.bme .bm-out'), 'bodymass: bad reference rows'); }
  // Typed equation: log10 M = -2 + 2.5 log10 X, X = 100 → 1000.
  await page.click('.bme [data-m=eq]'); await page.fill('.bme .bm-a', '-2'); await page.fill('.bme .bm-b', '2.5'); await page.fill('.bme .bm-fos', 'Test\t100'); await page.waitForTimeout(400);
  check((await page.textContent('.bme .bm-big')) === 'log₁₀ M = -2 + 2.5 log₁₀ X (typed in)' && (await page.textContent('.bme .bm-ftab')).includes('Test1001000') && await page.isHidden('.bme .bm-fig') && await page.isHidden('.bme .bm-rtab'), 'bodymass: typed equation');
  await page.selectOption('.bme .bm-base', 'e'); await page.fill('.bme .bm-ecf', '1.1'); await page.waitForTimeout(400);
  check((await page.textContent('.bme .bm-ftab')).includes(`Test100${Math.round(Math.exp(-2 + 2.5 * Math.log(100)) * 1.1)}`), 'bodymass: natural log and correction factor');
  await page.click('.bme [data-m=fit]'); await page.fill('.bme .bm-ref', ''); await page.waitForTimeout(100);
  writeFileSync(OUT + 'bm-ref.csv', 'name,x,m\nP,1,3\nQ,2,8.4853\nR,4,24\nS,8,67.882\n');
  await page.setInputFiles('.bme .dfb-in', OUT + 'bm-ref.csv'); await page.waitForTimeout(600);
  check((await page.textContent('.bme .bm-big')).startsWith('log₁₀ M = 0.4771 + 1.5000 log₁₀ X (n = 4') && (await page.textContent('.bme .bm-msg')).includes('Few specimens'), 'bodymass: reference file, exact power law, small-sample note');
  await page.click('.bme .bm-ex'); await page.waitForTimeout(300);
};
