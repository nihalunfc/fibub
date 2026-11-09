// #204 linkage map calculator
export const path = '/science/linkage-map-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/linkage-map-calculator/`); await page.waitForTimeout(900);
  const t = (s) => page.textContent(`.lkm ${s}`);
  { const c = await t('.lk-ctab'); check(c.includes('Haldane25.54 cM') && c.includes('Kosambi21.18 cM') && c.includes('20.00 cM'), 'linkage: RF 0.2 to cM (Haldane, Kosambi, none)'); }
  check(await page.isVisible('.lkm .lk-cfig'), 'linkage: mapping function chart');
  await page.fill('.lkm .lk-v', '20 %'); await page.waitForTimeout(400);
  check((await t('.lk-ctab')).includes('Haldane25.54 cM'), 'linkage: percentage input');
  await page.selectOption('.lkm .lk-dir', 'cm'); await page.fill('.lkm .lk-v', '25'); await page.waitForTimeout(400);
  { const c = await t('.lk-ctab'); check(c.includes('0.1967 (19.67 %)') && c.includes('0.2311 (23.11 %)') && c.includes('0.2500'), 'linkage: cM to RF'); }
  await page.fill('.lkm .lk-v', '80'); await page.waitForTimeout(400);
  check((await t('.lk-ctab')).includes('over 0.5: not defined'), 'linkage: 80 cM has no linear RF');
  await page.selectOption('.lkm .lk-dir', 'rf'); await page.fill('.lkm .lk-v', '60 %'); await page.waitForTimeout(400);
  check((await t('.lk-cerr')).includes('unlinked'), 'linkage: RF 60 % message');
  await page.fill('.lkm .lk-v', '0.2');
  check((await t('.lk-mbig')) === 'A – D – B – E – C: 41.7 cM' && (await t('.lk-mfacts')).includes('all 60 orders') && (await t('.lk-mfacts')).includes('SARF0.410'), 'linkage: example map order = Python (SARF 0.41)');
  { const m = await t('.lk-mtab'); check(m.includes('D12.24') && m.includes('C41.68'), 'linkage: Kosambi positions'); }
  await page.selectOption('.lkm .lk-fn', 'haldane'); await page.waitForTimeout(400);
  check((await t('.lk-mbig')) === 'A – D – B – E – C: 46.2 cM', 'linkage: Haldane map length = Python');
  await page.selectOption('.lkm .lk-crit', 'sad'); await page.waitForTimeout(400);
  check((await t('.lk-mfacts')).includes('46.21 cM') && (await t('.lk-mbig')).startsWith('A – D – B – E – C'), 'linkage: order by summed distances');
  await page.selectOption('.lkm .lk-fn', 'none'); await page.selectOption('.lkm .lk-crit', 'sarf'); await page.waitForTimeout(400);
  check((await t('.lk-mbig')) === 'A – D – B – E – C: 41.0 cM', 'linkage: no mapping function');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.lkm .lk-mcsv')]); const f = OUT + 'lk-map.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 6 && r[0].startsWith('locus,position_cM') && r[5].startsWith('C,41.00'), 'linkage: map CSV'); }
  await page.selectOption('.lkm .lk-unit', 'pct'); await page.waitForTimeout(400);
  check((await t('.lk-mbig')) === 'A – D – B – E – C: 0.4 cM', 'linkage: percentages option');
  await page.selectOption('.lkm .lk-unit', 'frac');
  writeFileSync(OUT + 'lk.csv', 'a,b,rf\nX,Y,0.1\nY,Z,0.15\nX,Z,0.22\n');
  await page.setInputFiles('.lkm .dfb-in', OUT + 'lk.csv'); await page.waitForTimeout(700);
  check((await t('.lk-mbig')) === 'X – Y – Z: 25.0 cM', 'linkage: CSV file opened');
  await page.fill('.lkm .lk-pairs', 'A\tB\t0.1\nC\tD\t0.1'); await page.waitForTimeout(400);
  check((await t('.lk-merr')).includes('no frequency is given'), 'linkage: missing pair message');
  await page.fill('.lkm .lk-pairs', 'A\tB\t12\nB\tC\t8'); await page.waitForTimeout(400);
  check((await t('.lk-merr')).includes('switch "Frequencies given as" to percentages'), 'linkage: percentage hint');
  await page.fill('.lkm .lk-pairs', 'A\tB\t0.1\nA\tB\t0.2\nB\tC\t0.1'); await page.waitForTimeout(400);
  check((await t('.lk-merr')).includes('given twice'), 'linkage: duplicate pair message');
  await page.fill('.lkm .lk-pairs', 'A\tB\t0.1\nB\tC\t0.5\nA\tC\t0.5'); await page.waitForTimeout(400);
  check((await t('.lk-merr')).includes('more than one linkage group'), 'linkage: unlinked groups message');
  // Three-point
  check((await t('.lk-tbig')) === 'Gene order: a – c – b', 'linkage: three-point gene order (hand)');
  { const f = await t('.lk-tfacts'); check(f.includes('RF a–c0.1600') && f.includes('RF c–b0.1380') && f.includes('29.8 cM') && f.includes('22.08') && f.includes('coincidence0.906') && f.includes('Interference0.094'), 'linkage: three-point RFs, CoC and interference (hand)'); }
  { const tb = await t('.lk-ttab'); check(tb.includes('+ + c9') && tb.includes('Double crossover') && tb.includes('Single crossover, a–c'), 'linkage: class table'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.lkm .lk-tcsv')]); const f = OUT + 'lk-tp.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 9 && r[1].startsWith('+ + +,366,Parental'), 'linkage: classes CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.lkm .dl [data-f="pdf"]')]); const f = OUT + 'lk.pdf'; await d.saveAs(f); check(readFileSync(f).slice(0, 4).toString() === '%PDF', 'linkage: PDF report'); }
  await page.fill('.lkm .lk-tp', 'b a c 5\n+ + + 366\nb a + 356'); await page.waitForTimeout(400);
  check((await t('.lk-terr')).includes('8 progeny classes'), 'linkage: too few classes');
  await page.fill('.lkm .lk-tp', 'gene1 gene2 gene3 count\n+ + + 366\na b c 356\na + + 68\n+ b c 72\n+ b + 61\na + c 57\n+ + c 9\na b + 11'); await page.waitForTimeout(400);
  check((await t('.lk-tbig')) === 'Gene order: a – c – b', 'linkage: header line skipped');
  await page.fill('.lkm .lk-tp', '+ + + 366\na b c 356\na + + 68\n+ b c 72\n+ b + 61\na + c 57\n+ + c 90\na b + 11'); await page.waitForTimeout(400);
  check((await t('.lk-twarn')).includes('unusual'), 'linkage: odd counts warning');
  await page.fill('.lkm .lk-tp', '+ + 366\na b c 356\na + + 68\n+ b c 72\n+ b + 61\na + c 57\n+ + c 9\na b + 11'); await page.waitForTimeout(400);
  check((await t('.lk-terr')).includes('three alleles and a count'), 'linkage: bad class line');
};
