// #571 dataset train/test splitter and stratifier
export const path = '/science/train-test-splitter/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const T = (s) => page.textContent('.tts ' + s);
  const csv = async (sel, name) => { await page.locator(sel).scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(sel)]); const f = OUT + name; await d.saveAs(f); return { name: d.suggestedFilename(), rows: readFileSync(f, 'utf8').trim().split('\n') }; };
  await page.goto(`${BASE}/science/train-test-splitter/`); await page.waitForTimeout(600);
  check((await T('.tts-big')) === 'Train 32 · Test 8' && (await page.inputValue('.tts .tts-cls')) === 'kind', 'splitter: stratified example, class column guessed');
  { const t = await T('.tts-bal'); check(t.includes('apple24 (60.0 %)19 (59.4 %)5 (62.5 %)') && t.includes('orange7 (17.5 %)6 (18.8 %)1 (12.5 %)') && t.includes('pear9 (22.5 %)7 (21.9 %)2 (25.0 %)'), 'splitter: class balance as sklearn (test 5/1/2)'); }
  { const a = await csv('.tts .tts-all', 'all.csv'); check(a.name === 'fruit-split.csv' && a.rows.length === 41 && a.rows[0].endsWith(',split') && a.rows.filter((r) => r.endsWith(',test')).length === 8, 'splitter: table with a split column'); }
  { const a = await csv('.tts .tts-p[data-p="1"]', 'test.csv'); check(a.name === 'fruit-test.csv' && a.rows.length === 9 && a.rows[0] === 'fruit_id,farm,picked,kind,weight_g,sugar_pct', 'splitter: test rows CSV'); }
  { const first = (await csv('.tts .tts-p[data-p="1"]', 't1.csv')).rows.join(); await page.fill('.tts .tts-seed', '7'); await page.waitForTimeout(400); const second = (await csv('.tts .tts-p[data-p="1"]', 't2.csv')).rows.join();
    await page.fill('.tts .tts-seed', '42'); await page.waitForTimeout(400); const again = (await csv('.tts .tts-p[data-p="1"]', 't3.csv')).rows.join();
    check(first !== second && first === again && (await T('.tts-bal')).includes('5 (62.5 %)'), 'splitter: the seed changes the rows, not the counts; same seed, same split'); }
  await page.fill('.tts .tts-val', '10'); await page.waitForTimeout(400);
  check((await T('.tts-big')) === 'Train 28 · Test 8 · Validation 4' && await page.isVisible('.tts .tts-p[data-p="2"]'), 'splitter: train, test and validation');
  await page.fill('.tts .tts-val', '0'); await page.selectOption('.tts .tts-m', 'random'); await page.waitForTimeout(300);
  check((await T('.tts-big')) === 'Train 32 · Test 8' && await page.isHidden('.tts .tts-grp-w'), 'splitter: random split');
  await page.selectOption('.tts .tts-m', 'group'); await page.waitForTimeout(300);
  check((await page.inputValue('.tts .tts-grp')) === 'farm' && (await T('.tts-facts')).includes('Groupstrain 6, test 2'), 'splitter: grouped by farm, 2 of 8 farms tested');
  { const a = await csv('.tts .tts-all', 'g.csv'); const by = {}; for (const r of a.rows.slice(1)) { const c = r.split(','); (by[c[1]] ??= new Set()).add(c[6]); } check(Object.values(by).every((s) => s.size === 1), 'splitter: no farm in both parts'); }
  await page.selectOption('.tts .tts-m', 'time'); await page.waitForTimeout(300);
  check((await page.inputValue('.tts .tts-time')) === 'picked' && (await T('.tts-facts')).includes('Training ends2026-10-17Test starts2026-10-19') && await page.isHidden('.tts .tts-seed-w'), 'splitter: time-ordered hold-out');
  await page.selectOption('.tts .tts-m', 'kfold'); await page.waitForTimeout(300);
  { const t = await T('.tts-bal'); check((await T('.tts-big')) === 'Fold 1 8 · Fold 2 8 · Fold 3 8 · Fold 4 8 · Fold 5 8' && t.includes('apple24 (60.0 %)5 (62.5 %)5 (62.5 %)5 (62.5 %)5 (62.5 %)4 (50.0 %)') && t.includes('orange7 (17.5 %)1 (12.5 %)1 (12.5 %)1 (12.5 %)2 (25.0 %)2 (25.0 %)'), 'splitter: stratified 5-fold as sklearn StratifiedKFold'); }
  { const a = await csv('.tts .tts-all', 'f.csv'); check(a.name === 'fruit-folds.csv' && a.rows[0].endsWith(',fold') && a.rows.slice(1).every((r) => /,[1-5]$/.test(r)) && await page.isHidden('.tts .tts-p'), 'splitter: fold column CSV, folds 1 to 5'); }
  await page.selectOption('.tts .tts-kk', 'group'); await page.fill('.tts .tts-k', '3'); await page.waitForTimeout(400);
  check((await T('.tts-facts')).includes('Groupsfold 1 2, fold 2 3, fold 3 3') && (await T('.tts-big')) === 'Fold 1 12 · Fold 2 14 · Fold 3 14', 'splitter: grouped 3-fold as sklearn GroupKFold (biggest farms first)');
  { const a = await csv('.tts .tts-all', 'gf.csv'); const by = {}; for (const r of a.rows.slice(1)) { const c = r.split(','); (by[c[1]] ??= new Set()).add(c[6]); } check(Object.values(by).every((s) => s.size === 1), 'splitter: grouped folds keep farms whole'); }
  await page.selectOption('.tts .tts-kk', 'blocks'); await page.waitForTimeout(300);
  { const a = await csv('.tts .tts-all', 'b.csv'); check(a.rows.slice(1).map((r) => r.at(-1)).join('') === '1'.repeat(14) + '2'.repeat(13) + '3'.repeat(13), 'splitter: folds in order (blocks of 14, 13, 13)'); }
  await page.fill('.tts .tts-k', '1'); await page.waitForTimeout(400);
  check((await T('.tts-err')).includes('from 2 to 40') && await page.isHidden('.tts .tts-out'), 'splitter: bad k message');
  await page.fill('.tts .tts-k', '5'); await page.selectOption('.tts .tts-kk', 'stratified'); await page.waitForTimeout(300);
  // A file where one class has a single row.
  writeFileSync(OUT + 'tiny.csv', 'x,label\n1,a\n2,a\n3,a\n4,b\n5,b\n6,c\n7,a\n8,b\n9,a\n10,b\n');
  await page.setInputFiles('.tts .dfb-in', OUT + 'tiny.csv'); await page.waitForTimeout(800);
  check((await page.inputValue('.tts .tts-cls')) === 'label' && (await T('.tts-warn')).includes('fewer than 5 rows'), 'splitter: opened file; small-class warning for folds');
  await page.selectOption('.tts .tts-m', 'stratified'); await page.waitForTimeout(300);
  check((await T('.tts-warn')).includes('only one row') && (await T('.tts-big')) === 'Train 8 · Test 2', 'splitter: single-row class warning');
  { const a = await csv('.tts .tts-p[data-p="0"]', 'tr.csv'); check(a.name === 'tiny-train.csv' && a.rows.length === 9, 'splitter: file name used for downloads'); }
  await page.fill('.tts .tts-test', '100'); await page.waitForTimeout(400);
  check((await T('.tts-err')).includes('percentage from 0 to below 100'), 'splitter: bad percentage message');
  await page.fill('.tts .tts-test', '60'); await page.fill('.tts .tts-val', '35'); await page.waitForTimeout(400);
  check((await T('.tts-err')).includes('no rows for training'), 'splitter: nothing left for training message');
  await page.fill('.tts .tts-in', 'a\n1'); await page.waitForTimeout(400);
  check((await T('.tts-err')).includes('at least two rows'), 'splitter: too little data message');
  await page.setViewportSize({ width: 375, height: 800 }); await page.fill('.tts .tts-in', 'x'); await page.waitForTimeout(100);
  await page.goto(`${BASE}/science/train-test-splitter/`); await page.waitForTimeout(500);
  await page.screenshot({ path: OUT + 'splitter-375.png', fullPage: true });
  await page.setViewportSize({ width: 1280, height: 800 });
};
