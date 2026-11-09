// #657 consolidation settlement and time
export const path = '/science/consolidation-settlement/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/consolidation-settlement/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.cst .cs-big'), facts = () => page.textContent('.cst .cs-facts');
  check((await big()) === 'Settlement 195 mm; 90 % after 4.16 years', `consolidation-settlement: example (${await big()})`);
  { const t = await page.textContent('.cst .cs-tab'); check(t.includes('42.6') && t.includes('102.6') && t.includes('93.0') && t.includes('102.3') && t.includes('OC to NC: Cr, Cc') && t.includes('none'), 'consolidation-settlement: layer table'); }
  { const f = await facts(); check(f.includes('11.6 months') && f.includes('3.50 m') && f.includes('Tv = 0.8481'), 'consolidation-settlement: times and drainage path'); }
  check(await page.isVisible('.cst .cs-fig') && await page.isVisible('.cst .cs-iso'), 'consolidation-settlement: both charts');
  await page.fill('.cst .cs-u', '50'); await page.waitForTimeout(100);
  check((await big()).endsWith('50 % after 11.6 months'), 'consolidation-settlement: time to 50 %');
  await page.selectOption('.cst .cs-dr', '1'); await page.waitForTimeout(100);
  check((await big()).endsWith('50 % after 3.86 years') && (await facts()).includes('drained one face'), 'consolidation-settlement: one-way drainage takes four times as long');
  await page.fill('.cst .cs-n', '5'); await page.waitForTimeout(100);
  check((await big()).startsWith('Settlement 195 mm') && (await facts()).includes('each split into 5'), 'consolidation-settlement: sublayers');
  await page.fill('.cst .cs-n', '1');
  await page.selectOption('.cst .cs-lk', 'footing'); await page.fill('.cst .cs-q', '150'); await page.waitForTimeout(100);
  check(await page.isVisible('.cst .cs-b') && (await big()).startsWith('Settlement 29.0 mm'), `consolidation-settlement: footing 2:1 spread (${await big()})`);
  await page.fill('.cst .cs-l', ''); await page.waitForTimeout(100);
  check(!(await big()).startsWith('Settlement 29.0 mm'), 'consolidation-settlement: strip footing');
  // Lab cv.
  await page.click('.cst .cs-lab summary'); await page.waitForTimeout(100);
  check((await page.textContent('.cst .cl-big')) === 'cv = 2.08 m²/year' && (await page.textContent('.cst .cl-help')).includes('Tv = 0.1967'), 'consolidation-settlement: cv from t50');
  await page.selectOption('.cst .cl-m', '0.9'); await page.fill('.cst .cl-t', '19'); await page.waitForTimeout(100);
  check((await page.textContent('.cst .cl-big')).startsWith('cv = 2.12'), `consolidation-settlement: cv from t90 (${await page.textContent('.cst .cl-big')})`);
  await page.click('.cst .cl-use'); await page.waitForTimeout(100);
  check((await page.inputValue('.cst .cs-cv')) === '2.12', 'consolidation-settlement: use the lab cv');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cst .cs-csv')]); const f = OUT + 'cs.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 122 && r[0] === 'time_years,Tv,U,settlement_mm', 'consolidation-settlement: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cst .dl [data-f=docx]')]); check((await d.suggestedFilename()).endsWith('.docx'), 'consolidation-settlement: Word report'); }
  await page.fill('.cst .cs-data', 'Clay\t3\t17\t1\t0\t0\t0'); await page.waitForTimeout(150);
  check((await page.textContent('.cst .cs-err')).includes('No layer is compressible') && await page.isHidden('.cst .cs-out'), 'consolidation-settlement: nothing compressible');
  await page.fill('.cst .cs-data', 'Clay\t-3\t17\t1\t0.3\t0.03\t0'); await page.waitForTimeout(150);
  check((await page.textContent('.cst .cs-err')).includes('thickness must be above zero'), 'consolidation-settlement: bad thickness');
  await page.fill('.cst .cs-data', 'Clay\t3\t17\t1\t0.3\t0.03\t0'); await page.fill('.cst .cs-u', '100'); await page.waitForTimeout(150);
  check((await page.textContent('.cst .cs-err')).includes('between 0 and 100 %'), 'consolidation-settlement: U of 100 % refused');
};
