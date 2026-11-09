// #468 ROC curve and AUC.
export const path = '/science/roc-curve/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/roc-curve/`); await page.waitForTimeout(700);
  const txt = (s) => page.textContent(`.rc ${s}`);
  const settle = () => page.waitForTimeout(450);
  check((await page.textContent('.rc')).includes('For study and teaching, not medical advice. Check with a qualified professional.'), 'roc: medical notice near the top');
  check((await txt('.rc-big')) === 'AUC (Marker A) = 0.895 (95 % CI 0.808 to 0.983)', `roc: example AUC with DeLong CI (${await txt('.rc-big')})`);
  { const f = await txt('.rc-facts'); check(f.includes('With condition (1)25') && f.includes('Without (0)35') && f.includes('≥ 44') && f.includes('0.840, 0.857'), `roc: Youden cut-off facts (${f})`); }
  { const s = await txt('.rc-sum'); check(s.includes('0.676') && s.includes('0.532 to 0.820') && s.includes('0.045'), 'roc: summary of both markers'); }
  { const c = await txt('.rc-cmp'); check(c.includes('0.219') && c.includes('0.071 to 0.368') && c.includes('2.892') && c.includes('p value0.004'), `roc: DeLong paired test (${c})`); }
  check(await page.isVisible('.rc .rc-fig'), 'roc: curve drawn');
  { const best = await page.$eval('.rc .rc-tab tr.rc-best', (tr) => [...tr.cells].map((c) => c.textContent)); check(best.join('|') === '≥ 44|21|5|30|4|0.840|0.857|0.808|0.882|5.880|0.187|0.697', `roc: Youden row in the cut-off table (${best.join('|')})`); }
  check((await page.$$('.rc .rc-tab tbody tr')).length === 34, 'roc: 34 cut-offs (sklearn roc_curve without the starting point)');
  // CSV.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.rc .rc-csv')]); const f = OUT + 'roc.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows.length === 35 && rows[0].startsWith('positive_if,cutoff,tp') && rows.some((r) => r.startsWith('>=,44,21,5,30,4,0.84,')), 'roc: cut-off CSV'); }
  // Second marker table.
  await page.selectOption('.rc .rc-which', 'Marker B'); await settle();
  { const b = await page.$eval('.rc .rc-tab tr.rc-best', (tr) => tr.cells[0].textContent); check(b !== '≥ 44' && (await page.$$('.rc .rc-tab tbody tr')).length !== 34, `roc: table for marker B (best ${b})`); }
  // Level and direction.
  await page.selectOption('.rc .rc-lvl', '0.9'); await settle();
  check((await txt('.rc-big')).includes('90 % CI'), 'roc: 90 % level');
  await page.selectOption('.rc .rc-lvl', '0.95');
  await page.selectOption('.rc .rc-dir', 'lower'); await settle();
  check((await txt('.rc-big')).startsWith('AUC (Marker A) = 0.105') && (await txt('.rc-note')).includes('try the other direction') && (await txt('.rc-facts')).includes('≤'), 'roc: lower direction');
  await page.selectOption('.rc .rc-dir', 'higher');
  // Other label as the condition flips the AUC.
  await page.selectOption('.rc .rc-pos', '0'); await settle();
  check((await txt('.rc-big')).startsWith('AUC (Marker A) = 0.105') && (await txt('.rc-facts')).includes('With condition (0)35'), 'roc: other outcome value as the condition');
  await page.selectOption('.rc .rc-pos', '1'); await settle();
  // Reports.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.rc .dl button[data-f="png"]')]); check(d.suggestedFilename() === 'roc-curve.png', 'roc: PNG report'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.rc .dl button[data-f="docx"]')]); check(d.suggestedFilename() === 'roc-curve.docx', 'roc: Word report'); }
  // One marker from a file, text labels.
  writeFileSync(OUT + 'roc1.csv', 'status,score\ncase,8\ncontrol,3\ncase,6\ncontrol,5\ncase,7\ncontrol,6\ncontrol,2\ncase,4\n');
  await page.setInputFiles('.rc .dfb-in', OUT + 'roc1.csv'); await page.waitForTimeout(800);
  // Cases 8,6,7,4 vs controls 3,5,6,2: wins 4+3+4+4 = 15, plus 3 wins for 7? by hand: 8>all 4; 6>3,5,2 =3 + tie .5; 7>all 4; 4>3,2 = 2 -> 13.5/16.
  check((await txt('.rc-big')).startsWith('AUC = 0.844') && await page.isHidden('.rc .rc-cmpw') && await page.isHidden('.rc .rc-whichw'), `roc: one marker, word labels, from a file (${await txt('.rc-big')})`);
  // Bad input.
  await page.fill('.rc .rc-data', ''); await settle();
  check((await txt('.rc-err')).startsWith('Paste your data first') && await page.isHidden('.rc .rc-out'), 'roc: empty message');
  await page.fill('.rc .rc-data', 'y\tx\n1\t2\n1\t3\n1\t4'); await settle();
  check((await txt('.rc-err')).includes('two different values'), 'roc: one outcome message');
  await page.fill('.rc .rc-data', 'y\tx\n1\t2\n0\t3\n0\t4\n0\tn/a'); await settle();
  check((await txt('.rc-err')).includes('at least 2 positive'), 'roc: too few cases message');
  await page.fill('.rc .rc-data', 'y\tx\n1\t2\n0\t3\n0\t4\n1\t5\n1\tn/a'); await settle();
  check((await txt('.rc-skip')).startsWith('1 row') && await page.isVisible('.rc .rc-fig'), 'roc: non-numeric row left out with a note');
};
